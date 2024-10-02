import { ModrinthMcVersion } from "./platform/modrinth/types";
import type { ActionInputs, Platform, Loader } from "./types";
import validRange from "semver/functions/valid";
import satisfies from "semver/functions/satisfies";

export function filterTargetVersions(versionRange: string, allVerions: ModrinthMcVersion[]): string[] {
    if (validRange(versionRange) === null) {
        throw new Error(`The provided 'version-range' is formatted incorrectly! Formatting example: '>= 1.20.1 <1.21'`);
    }
    const releases = allVerions.filter(e => e.version_type === "release");
    const results: string[] = [];

    for (const release of releases) {
        if (satisfies(release.version, versionRange)) {
            results.push(release.version)
        }
    }

    return results;
}

/** properly capitalize the loader name */
export function capitalize(input: Loader) {
    return input.replace(/[fn]/g, (match) => match.toUpperCase());
}

export function makeVersion(inputs: ActionInputs, loader: Loader, platform: Platform): string {
    if (inputs[platform].version.length >= 1) {
        return inputs[platform].version;
    }
    const loaderCap = capitalize(loader);
    return `${inputs.minecraftVersion}-${inputs.modVersion}-${loaderCap}`;
}

export function makeName(inputs: ActionInputs, loader: Loader, platform: Platform): string {
    if (inputs[platform].name.length >= 1) {
        return inputs[platform].name;
    }
    const loaderCap = capitalize(loader);
    return `${inputs.minecraftVersion} - ${inputs.modVersion} - ${loaderCap}`;
}



