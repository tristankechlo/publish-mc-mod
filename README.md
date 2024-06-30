# Publish MC Mod Files

Published modfiles (java-jar-files) to CurseForge and Modrinth.  
Expected file locations:
- `./dist/*-neoforge-*jar`
- `./dist/*-fabric-*jar`
- `./dist/*-forge-*jar`

## How to use?

```yml
- uses: tristankechlo/publish-mc-mod@v1.0.0 # replace with the actual version needed
  with:
    mc-version: "1.20.4" # required
    mod-version: "2.0.0" # required
    version-range: "[1.20.4,1.21)" # required
    curseforge-id: 00000000 # required
    modrinth-id: "abcdefgh" # required
    featured: true # optional (default: true), if the files should be marked as featured on modrinth
    neoforge: true # optional (default: true), if the neoforge files should be published
    fabric: true # optional (default: true), if the fabric files should be published
    forge: true # optional (default: true), if the forge files should be published
    changelog: "this is a changelog" # optional (default: ""), the changelog displayed next to the files on curseforge and modrinth
    curseforge-token: ${{ secrets.CURSEFORGE_TOKEN }} # required
    modrinth-token: ${{ secrets.MODRINTH_TOKEN }} # required

```
