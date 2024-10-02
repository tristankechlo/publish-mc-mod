import type { DependencyType, VersionType } from "src/types";

export interface CreatableVersion {
    name: string; // The name of this version
    version_number: string; // The version number. Ideally will follow semantic versioning
    changelog: string | null; // The changelog for this version
    dependencies: VersionDependency[]; // A list of specific versions of projects that this version depends on
    game_versions: string[]; // A list of versions of Minecraft that this version supports
    version_type: VersionType; // The release channel for this version
    loaders: string[]; // The mod loaders that this version supports
    featured: boolean; // Whether the version is featured or not
    project_id: string; // The ID of the project this version is for
    file_parts: string[]; // An array of the multipart field names of each file that goes with this version
    primary_file: string; // The multipart field name of the primary file
}

export interface CreatableVersionAddon {
    author_id: string;
    date_published: string;
    downloads: number;
    files: any[];
}

export type CreatableVersionResponse = CreatableVersion | CreatableVersionAddon;

export interface VersionDependency {
    project_id: string;
    dependency_type: DependencyType;
}

export interface ModrinthMcVersion {
    version: string;
    version_type: McVersionType;
    date: string;
    major: boolean;
}

export type McVersionType = "snapshot" | "release" | "alpha" | "beta";

export interface Project {
    slug: string;
    id: string;
}