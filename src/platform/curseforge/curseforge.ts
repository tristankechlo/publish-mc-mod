import type { ActionInputs, DependencyType, Loader } from "src/types";
import type { CreatableVersion, CreatableVersionResponse, CurseforgeDependencyType, GameVersion, Relation } from "./types";
import * as core from "@actions/core";
import * as utils from "../../util";
import axios from "axios";
import * as fs from 'fs';

// small runtime improvement, values are likely never going to change, so no need the fetch them from curseforge
// WHY THE FUCK IS THE API SO COMPLICATED WITH ALL THOSE IDS
export const IDS: { [key: string]: number } = {
    "forge": 7498, // type id 68441
    "fabric": 7499, // type id 68441
    "neoforge": 10150, // type id 68441
    "client": 9638, // type id 75208
    "server": 9639, // type id 75208
};

const CURSEFORGE_API = "https://minecraft.curseforge.com/api";

/** this does only return all release version (1.21.1 | 1.21 | ...) and no snapshots/betas/... */
async function getAllVersions(): Promise<GameVersion[]> {
    const url = "https://api.curseforge.com/v1/minecraft/version";
    // other urls
    // https://minecraft.curseforge.com/api/game/dependencies not existant? but should be used according to curseforge-docs
    // https://minecraft.curseforge.com/api/game/versions contains some duplicates with some IDs where I do not know what the fuck they are for

    const response = await axios.get<{ data: GameVersion[] }>(url);
    if (response.status !== 200) {
        throw new Error(`Could not get version from '${url}'`);
    }
    return response.data.data;
}

export async function mapVersions(targetVersions: string[]): Promise<number[]> {
    const allVersions = await getAllVersions();
    return allVersions
        .filter(v => targetVersions.includes(v.versionString))
        .map(v => v.gameVersionId);
}

export async function upload(inputs: ActionInputs, loader: Loader, versions: number[], token: string): Promise<CreatableVersionResponse> {
    const url = `${CURSEFORGE_API}/projects/${inputs.curseforge.id}{projectId}/upload-file`;

    const namedLoader = utils.capitalize(loader);
    core.startGroup(`[${namedLoader}] Upload to Curseforge`);
    core.info(`[${namedLoader}] starting upload to curseforge.com`);

    const data = await createPostData(inputs, loader, versions);
    const formData = {
        metadata: data,
        file: fs.createReadStream(inputs[loader].path)
    };

    const response = await axios.postForm<CreatableVersionResponse>(url, formData, { headers: { 'X-Api-Token': token } });

    if (response.status !== 200) {
        core.endGroup()
        throw new Error(`[${namedLoader}] upload to curseforge.com failed with message: ${JSON.stringify(response.data)}`);
    }

    core.info(`[${namedLoader}] finished upload to curseforge.com`)
    core.endGroup();
    return response.data;
}

async function createPostData(inputs: ActionInputs, loader: Loader, versions: number[]): Promise<CreatableVersion> {

    const cfLoaderId = IDS[loader];
    const dependencies: Relation[] = [];

    for (const dep of inputs[loader].dependencies) {
        const slug = dep.id; // if this slug does not exist => user fault
        const type = transformDependency(dep.dependency_type);
        dependencies.push({ slug, type });
    }

    const versionData: CreatableVersion = {
        changelog: inputs.changelog,
        changelogType: inputs.changelogFormat,
        displayName: inputs.curseforge.name || undefined,
        gameVersions: [cfLoaderId, ...versions],
        releaseType: inputs.versionType,
        relations: {
            projects: dependencies
        }
    };
    return versionData;
}

function transformDependency(dependency: DependencyType): CurseforgeDependencyType {
    if (dependency === "required") {
        return "requiredDependency";
    } else if (dependency === "optional") {
        return "optionalDependency";
    } else if (dependency === "incompatible") {
        return "incompatible";
    } else if (dependency === "embedded") {
        return "embeddedLibrary";
    }
    return "SOMETHING WENT TERRIBLY WRONG" as CurseforgeDependencyType;
}
