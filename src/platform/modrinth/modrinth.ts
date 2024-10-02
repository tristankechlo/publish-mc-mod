import type { CreatableVersion, CreatableVersionResponse, ModrinthMcVersion, Project, VersionDependency } from "./types";
import type { ActionInputs, Loader } from "../../types";
import * as core from "@actions/core";
import * as utils from "../../util";
import axios from "axios";
import * as fs from 'fs';

const MODRINTH_API = "https://api.modrinth.com/v2";
const FILE_ID = "primaryFile";

export async function getAllVersions(token: string): Promise<ModrinthMcVersion[]> {
    const url = MODRINTH_API + "/version?chache=true"
    const response = await axios.get<ModrinthMcVersion[]>(url, { headers: { Authorization: token } });
    if (response.status !== 200) {
        throw new Error(`Could not get version from '${url}'`);
    }
    return response.data;
}

async function getProjectId(slug: string, token: string): Promise<string> {
    const url = `${MODRINTH_API}/project/${slug}`;
    const response = await axios.get<Project>(url, { headers: { Authorization: token } });
    if (response.status !== 200) {
        throw new Error(`Could not get project with id|slug '${slug}' from '${url}'`);
    }
    return response.data.id;
}

export async function upload(inputs: ActionInputs, loader: Loader, versions: string[], token: string): Promise<CreatableVersionResponse> {
    const url = MODRINTH_API + "/version";
    const namedLoader = utils.capitalize(loader);
    core.startGroup(`[${namedLoader}] Upload to Modrinth`);
    core.info(`[${namedLoader}] starting upload to modrinth.com`);

    const data = await createPostData(inputs, loader, versions, token);
    const formData: { [key: string]: any } = { data: data };
    formData[FILE_ID] = fs.createReadStream(inputs[loader].path);

    const response = await axios.postForm<CreatableVersionResponse>(url, formData, { headers: { Authorization: token } })

    if (response.status !== 200) {
        core.endGroup()
        throw new Error(`[${namedLoader}] upload to modrinth.com failed with message: ${JSON.stringify(response.data)}`);
    }

    core.info(`[${namedLoader}] finished upload to modrinth.com`)
    core.endGroup();
    return response.data;
}

async function createPostData(inputs: ActionInputs, loader: Loader, versions: string[], token: string): Promise<CreatableVersion> {

    const namedLoader = utils.capitalize(loader);
    const dependencies: VersionDependency[] = [];

    for (const dep of inputs[loader].dependencies) {
        const id = await getProjectId(dep.id, token);
        core.info(`[${namedLoader}] resolved dependency-id '${dep.id}' to project-id '${id}'`)
        dependencies.push({ project_id: id, dependency_type: dep.dependency_type })
    }

    const versionData: CreatableVersion = {
        name: utils.makeName(inputs, loader, "modrinth"),
        version_number: utils.makeVersion(inputs, loader, "modrinth"),
        changelog: inputs.changelog,
        dependencies: dependencies,
        game_versions: versions,
        version_type: inputs.versionType,
        loaders: [loader],
        featured: inputs.featured,
        project_id: `${inputs.modrinth.id}`,
        file_parts: [FILE_ID],
        primary_file: FILE_ID
    };
    return versionData;
}
