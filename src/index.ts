import * as fs from 'fs';
import * as core from "@actions/core";
import * as summary from "./summary";
import * as modrinth from "./platform/modrinth/modrinth";
import * as curseforge from "./platform/curseforge/curseforge";
import { readInputs } from "./inputs";
import * as utils from "./util";
import type { ActionInputs, Loader, LoaderInputs } from './types';

export async function main(): Promise<void> {
    try {
        const [inputs, curseforgeToken, modrinthToken] = readInputs();
        const inputsCodeBlock = summary.makeCodeblock(JSON.stringify(inputs, null, "  "), "json");

        // get all possible versions from modrinth
        const allVersions = await modrinth.getAllVersions(modrinthToken);

        // filter all versions based on the provided versionRange
        const targetVersions = utils.filterTargetVersions(inputs.versionRange, allVersions);
        core.info(`Minecraft target versions: '${targetVersions.join(',')}'`);

        // map those versions to get the ids for curseforge
        const curseforgeVersions = await curseforge.mapVersions(targetVersions);
        core.info(`Curseforge specific versions (excluding the loader): '${curseforgeVersions.join(',')}'`);

        // foreach activated loader => upload to curseforge and modrinth
        const loaders: Loader[] = ["neoforge", "fabric", "forge"];
        for (const loader of loaders) {
            const namedLoader = utils.capitalize(loader);

            core.info(`[${namedLoader}] Checking if upload is requested.`);
            if (inputs[loader].path.length >= 1) {

                // check if the file exists
                if (!fs.existsSync(inputs[loader].path)) {
                    const path = fs.realpathSync(inputs[loader].path, { encoding: "utf-8" });
                    core.warning(`The supplied file '${path}' could not be found. Skipping the upload!`, { title: `[${namedLoader}] Supplied file not found!` });
                    continue
                }

                // when possible upload file to curseforge
                if (`${inputs.curseforge.id}`.length >= 1 && curseforgeToken.length >= 1) {
                    curseforge.upload(inputs, loader, curseforgeVersions, curseforgeToken);
                } else {
                    core.info(`[${namedLoader}] No Curseforge token and project-id provided, not uploading to curseforge.com`);
                }

                // when possible upload file to modrinth
                if (`${inputs.modrinth.id}`.length >= 1 && modrinthToken.length >= 1) {
                    modrinth.upload(inputs, loader, targetVersions, modrinthToken);
                } else {
                    core.info(`[${namedLoader}] No Modrinth token and project-id provided, not uploading to modrinth.com`);
                }
                if (inputs.summary === true) {
                    // TODO write the summary
                }
                core.info(`[${namedLoader}] All uploads finished.`);

            } else {
                core.info(`[${namedLoader}] No file supplied. Skipping the upload!`);
            }
        }

        core.info("All file uploads successfully finished");


    } catch (error) {
        // Fail the workflow run if an error occurs
        if (error instanceof Error) {
            core.setFailed(error.message);
        } else {
            core.setFailed(JSON.stringify(error));
        }
    }
}

main();
