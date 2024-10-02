import type { ChangelogFormat, VersionType } from "src/types";

export interface GameVersion {
    id: number;
    gameVersionId: number; // this is the one needed for the dependencies
    gameVersionTypeId: number;
    versionString: string; // readable string of the version
}

export interface CreatableVersion {
    changelog: string;
    changelogType: ChangelogFormat;
    displayName?: string;
    gameVersions: number[];
    releaseType: VersionType;
    relations: {
        projects: Relation[]
    }
}

export interface Relation {
    slug: string;
    type: CurseforgeDependencyType;
}

export interface CreatableVersionResponse {
    id: number;
}

export type CurseforgeDependencyType = "embeddedLibrary" | "incompatible" | "optionalDependency" | "requiredDependency" | "tool";
