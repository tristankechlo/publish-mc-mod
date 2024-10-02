import type { PlatformInputs, ActionInputs, LoaderInputs, Dependency, DependencyType, VersionType, Platform, Loader, ChangelogFormat } from "./types";
import * as core from "@actions/core";
import { capitalize } from "./util";

const ALLOWED_VERSIONS: VersionType[] = ["alpha", "beta", "release"];
const DEPENDENCY_TYPES: DependencyType[] = ["required", "optional", "incompatible", "embedded"];
const CHANGELOG_FORMATS: ChangelogFormat[] = ["text", "html", "markdown"];

export function readInputs(): [ActionInputs, string, string] {

    // general inputs
    const summary = core.getBooleanInput("summary", { required: true });

    // minecraft specific inputs
    const minecraftVersion = core.getInput("minecraft-version", { required: true });
    const modVersion = core.getInput("mod-version", { required: true });
    const changelog = core.getInput("changelog", { required: true });
    const versionRange = core.getInput("version-range", { required: true });
    const versionType = core.getInput("version-type", { required: true }).toLowerCase() as VersionType;

    if (!ALLOWED_VERSIONS.includes(versionType)) {
        throw new Error(`'version-type' must be one of '${ALLOWED_VERSIONS.join(',')}'`);
    }

    // platform specific inputs
    const [curseforge, curseforgeToken] = loadPlatformInputs("curseforge");
    const changelogFormat = core.getInput("changelog-format").toLowerCase() as ChangelogFormat;
    const [modrinth, modrinthToken] = loadPlatformInputs("modrinth");
    const featured = core.getBooleanInput("featured");

    if (!CHANGELOG_FORMATS.includes(changelogFormat)) {
        throw new Error(`'changelog-format' must be one of '${CHANGELOG_FORMATS.join(',')}'`);
    }

    // loader specific inputs
    const forge = loadLoaderInputs("forge");
    const fabric = loadLoaderInputs("fabric");
    const neoforge = loadLoaderInputs("neoforge");

    const inputs: ActionInputs = {
        summary,
        minecraftVersion, modVersion, changelog, versionRange, versionType: versionType as VersionType,
        curseforge, changelogFormat, modrinth, featured,
        forge, fabric, neoforge,
    };
    return [inputs, curseforgeToken, modrinthToken];
}

function loadPlatformInputs(platform: Platform): [PlatformInputs, string] {
    const id = core.getInput(`${platform}-id`);
    const token = core.getInput(`${platform}-token`);
    const name = core.getInput(`${platform}-name`);
    const version = core.getInput(`${platform}-version`);

    return [{ id, name, version }, token];
}


function loadLoaderInputs(loader: Loader): LoaderInputs {
    const path = core.getInput(`${loader}-path`);
    const depString = core.getInput(`${loader}-dependencies`);

    const namedLoader = capitalize(loader);

    let dependencies: Dependency[] = [];

    // parse dependency string into corresponding array
    depString.split(";").forEach((element) => {
        if (element.includes("@")) {
            let deps = element.split("@");
            if (deps.length === 2) {
                const id = `${deps[0]}`.trim();
                const dependency_type = `${deps[1]}`.trim().toLowerCase() as DependencyType;
                if (!DEPENDENCY_TYPES.includes(dependency_type)) {
                    throw new Error(`[${namedLoader}] The dependency must one of '${DEPENDENCY_TYPES.join(',')}'!`);
                }
                dependencies.push({ id, dependency_type: dependency_type })
            } else {
                throw new Error(`[${namedLoader}] The dependency '${element}' contains more than one '@'!`);
            }
        } else {
            throw new Error(`[${namedLoader}] The dependency '${element}' does not contain the '@'!`);
        }
    });

    return { path, dependencies };
}
