
export interface ActionInputs {
    summary: boolean;
    dryrun: boolean;

    modId: string;
    modVersion: string;
    minecraftVersion: string;
    changelog: string;
    versionRange: string;
    versionType: VersionType;

    curseforge: PlatformInputs;
    changelogFormat: ChangelogFormat;
    modrinth: PlatformInputs;
    featured: boolean;

    forge: LoaderInputs;
    fabric: LoaderInputs;
    neoforge: LoaderInputs;
}

export interface PlatformInputs {
    id: string | number;
    name: string;
    version: string;
}

export interface LoaderInputs {
    path: string;
    dependencies: Dependency[]
}

export interface Dependency {
    id: string;
    dependency_type: DependencyType;
}

export type Loader = "forge" | "fabric" | "neoforge";
export type Platform = "curseforge" | "modrinth";
export type VersionType = "release" | "beta" | "alpha";
export type DependencyType = "required" | "optional" | "incompatible" | "embedded";
export type ChangelogFormat = "text" | "html" | "markdown";
