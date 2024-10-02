import type { DependencyType } from "src/types";
import type { CurseforgeDependencyType, GameVersion } from "./types";
import axios from "axios";

export const CURSEFORGE_API = "https://minecraft.curseforge.com/api";

/** this does only return all release version (1.21.1 | 1.21 | ...) and no snapshots/betas/... */
async function getAllVersions(): Promise<GameVersion[]> {
    const url = "https://api.curseforge.com/v1/minecraft/version";
    // other urls, because
    // https://minecraft.curseforge.com/api/game/dependencies not existant? but should be used according to curseforge-api-docs
    // https://minecraft.curseforge.com/api/game/versions contains some duplicates with some IDs where I do not know which to choose ...

    const response = await axios.get<{ data: GameVersion[] }>(url);
    if (response.status !== 200) {
        throw new Error(`Could not get versions from '${url}'`);
    }
    return response.data.data;
}

/** map the provided array of minecraft versions to curseforge specific version ids */
export async function mapVersions(targetVersions: string[]): Promise<number[]> {
    const allVersions = await getAllVersions();
    return allVersions
        .filter(v => targetVersions.includes(v.versionString))
        .map(v => v.gameVersionId);
}

/** map the provided DependencyType to the curseforge specific type */
export function transformDependency(dependency: DependencyType): CurseforgeDependencyType {
    if (dependency === "required") {
        return "requiredDependency";
    } else if (dependency === "optional") {
        return "optionalDependency";
    } else if (dependency === "incompatible") {
        return "incompatible";
    } else if (dependency === "embedded") {
        return "embeddedLibrary";
    }
    throw new Error(`'${dependency}' is not a valid dependency for curseforge.com. Pls report this error at 'https://github.com/tristankechlo/publish-mc-mod'`);
}
