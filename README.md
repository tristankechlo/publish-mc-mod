# Publish MC Mod Files

Publishes modfiles (java-jar-files) to CurseForge and Modrinth.

## How to use?

```yml
- uses: tristankechlo/publish-mc-mod@v2.0.0 # replace with the actual version needed
  with:
    mc-version: "1.20.4" # required
    mod-version: "2.0.0" # required
    curseforge-id: 00000000 # required
    modrinth-id: "abcdefgh" # required
    version-range: "[1.20.4,1.21)" # required
    version-type: "release" # optional (default: "release"), the type of the version
    loaders: "fabric,forge,neoforge" # optional (default: "fabric,forge,neoforge"), the loaders this update is for
    changelog: "this is a changelog" # optional (default: ""), the changelog displayed next to the files on curseforge and modrinth
    curseforge-token: ${{ secrets.CURSEFORGE_TOKEN }} # required
    modrinth-token: ${{ secrets.MODRINTH_TOKEN }} # required
```

## Used file globs

The action uses the following globs to find the jar-files to publish:

- `./neoforge/build/libs/*-neoforge-!(*-dev|*-sources|*-javadoc).jar`
- `./fabric/build/libs/*-fabric-!(*-dev|*-sources|*-javadoc).jar`
- `./forge/build/libs/*-forge-!(*-dev|*-sources|*-javadoc).jar`


Breakdown what each part does:

- `./forge/build/libs/` the directory to search in
- `*-forge-` matches any file containing `-forge-`
- `!(*-dev|*-sources|*-javadoc)` matches all files not ending with `-dev`, `-sources` or `-javadoc`
- `.jar` matches only files with the extension `.jar`

Can be changed by setting the `neoforge-glob`, `fabric-glob` or `forge-glob` inputs.


> [!NOTE]
> Built on top of the publish action by Kir-Antipov ([https://github.com/Kir-Antipov/mc-publish](https://github.com/Kir-Antipov/mc-publish))
