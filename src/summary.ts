import * as core from "@actions/core";

export function makeCodeblock(content: string, language: string): string {
    const block = core.summary.addCodeBlock(content, language).stringify();
    core.summary.emptyBuffer();
    return block;
}
