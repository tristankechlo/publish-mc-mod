import type { ModrinthMcVersion, Project } from "./types";
import axios from "axios";

export const MODRINTH_API = "https://api.modrinth.com/v2";

/** load all possible minecraft versions */
export async function getAllVersions(token: string): Promise<ModrinthMcVersion[]> {
    const url = MODRINTH_API + "/version?cache=true"
    const response = await axios.get<ModrinthMcVersion[]>(url, { headers: { Authorization: token } });
    if (response.status !== 200) {
        throw new Error(`Could not get version from '${url}'`);
    }
    return response.data;
}

/** get the project id from a give project slug */
export async function getProjectId(slug: string, token: string): Promise<string> {
    const url = `${MODRINTH_API}/project/${slug}?cache=true`;
    const response = await axios.get<Project>(url, { headers: { Authorization: token } });
    if (response.status !== 200) {
        throw new Error(`Could not get project with id|slug '${slug}' from '${url}'`);
    }
    return response.data.id;
}
