import type { CreatableVersion, CreatableVersionResponse, VersionDependency } from "./types";
import type { ActionInputs, Loader } from "../../types";
import * as core from "@actions/core";
import * as utils from "../../util";
import axios from "axios";
import * as fs from 'fs';

import * as mfutil from './modrinth-util';
export { mfutil as util };

const FILE_ID = "primaryFile";

export async function upload(inputs: ActionInputs, loader: Loader, versions: string[], token: string, namedLoader: string): Promise<CreatableVersionResponse | void> {
    core.info(`[${namedLoader}] starting upload to modrinth.com`);

    const data = await createPostData(inputs, loader, versions, token, namedLoader);
    const formData: { [key: string]: any } = { data: data };
    formData[FILE_ID] = fs.createReadStream(inputs[loader].path);

    const url = mfutil.MODRINTH_API + "/version";
    if (inputs.dryrun === true) {
        core.info(`[${namedLoader}] option 'dryrun' active, not uploading to modrinth.com`);
        // TODO write log messages
        return;
    }
    const response = await axios.postForm<CreatableVersionResponse>(url, formData, { headers: { Authorization: token } })

    if (response.status !== 200) {
        throw new Error(`upload to modrinth.com failed with message: ${JSON.stringify(response.data)}`);
    }
    return response.data;
}

async function createPostData(inputs: ActionInputs, loader: Loader, versions: string[], token: string, namedLoader: string): Promise<CreatableVersion> {
    const dependencies: VersionDependency[] = [];

    for (const dep of inputs[loader].dependencies) {
        const id = await mfutil.getProjectId(dep.id, token);
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
