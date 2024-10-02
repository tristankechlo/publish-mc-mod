import type { ActionInputs, Loader } from "src/types";
import type { CreatableVersion, CreatableVersionResponse, Relation } from "./types";
import * as core from "@actions/core";
import axios from "axios";
import * as fs from 'fs';

import * as cfutil from './curseforge-util'
export { cfutil as util }

// small runtime improvement, values are likely never going to change, so no need the fetch them from curseforge
// WHY THE FUCK IS THE API SO COMPLICATED WITH ALL THOSE MEANINGLESS IDS
export const IDS: { [key: string]: number } = {
    "forge": 7498, // type id 68441
    "fabric": 7499, // type id 68441
    "neoforge": 10150, // type id 68441
    "client": 9638, // type id 75208
    "server": 9639, // type id 75208
};

export async function upload(inputs: ActionInputs, loader: Loader, versions: number[], token: string, namedLoader: string): Promise<CreatableVersionResponse | void> {
    core.info(`[${namedLoader}] starting upload to curseforge.com`);

    const data = await createPostData(inputs, loader, versions);
    const formData = {
        metadata: data,
        file: fs.createReadStream(inputs[loader].path)
    };

    const url = `${cfutil.CURSEFORGE_API}/projects/${inputs.curseforge.id}{projectId}/upload-file`;
    if (inputs.dryrun === true) {
        core.info(`[${namedLoader}] option 'dryrun' active, not uploading to curseforge.com`);
        // TODO write log messages
        return;
    }
    const response = await axios.postForm<CreatableVersionResponse>(url, formData, { headers: { 'X-Api-Token': token } });

    if (response.status !== 200) {
        throw new Error(`upload to curseforge.com failed with message: ${JSON.stringify(response.data)}`);
    }
    return response.data;
}

async function createPostData(inputs: ActionInputs, loader: Loader, versions: number[]): Promise<CreatableVersion> {

    const cfLoaderId = IDS[loader];
    const dependencies: Relation[] = [];

    for (const dep of inputs[loader].dependencies) {
        const slug = dep.id; // if this slug does not exist => user fault (user should make sure the slug is correct)
        const type = cfutil.transformDependency(dep.dependency_type);
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

