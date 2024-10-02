# Publish MC Mod Files

GitHub Action to publich modfiles (.jar) to Curseforge and/or Modrinth.  
This action is custom made, it might work for other setups, but my main concern is that it works for me (kinda selfish I know 😆).  
Feel free to open Pull-Requests to make this action more widly accessible.

## How to use?

### Full example

not all values are required to be filled in

```yml
- uses: tristankechlo/publish-mc-mod@v2.0.0
  with:
    summary: true
    dryrun: false

    mod-id: "examplemod"
    mod-version: "2.0.0"
    minecraft-version: "1.20.4"
    changelog: "this is my<br>changelog"
    version-range: ">=1.20.4 <1.21"
    version-type: "release"

    curseforge-id: 00000000
    curseforge-token: ${{ secrets.CURSEFORGE_TOKEN }}
    curseforge-name: "ExampleMod - 1.20.4"
    changelog-format: "html"
    modrinth-id: "abcdefgh"
    modrinth-token: ${{ secrets.MODRINTH_TOKEN }}
    modrinth-name: "ExampleMod - 1.20.4"
    modrinth-version: "1.20.4-2.0.0"
    featured: false

    forge-path: "./forge/build/libs/examplemod-forge-1.20.4-2.7.4.jar"
    forge-dependencies: ""
    fabric-path: "./fabric/build/libs/examplemod-fabric-1.20.4-2.7.4.jar"
    fabric-dependencies: "fabric-api@required"
    neoforge-path: "./neoforge/build/libs/examplemod-neoforge-1.20.4-2.7.4.jar"
    neoforge-dependencies: ""
```

### Minimal setup

All these properties are required for this action to function correctly.  
If you don't want to upload to one of the platform (curseforge/modrinth) just remove the id and token attributes.

```yml
- uses: tristankechlo/publish-mc-mod@v2.0.0
  with:
    mod-id: "examplemod"
    minecraft-version: "1.20.4"
    mod-version: "2.0.0"
    version-range: ">=1.20.4 <1.21"

    curseforge-id: 00000000
    curseforge-token: ${{ secrets.CURSEFORGE_TOKEN }}
    modrinth-id: "abcdefgh"
    modrinth-token: ${{ secrets.MODRINTH_TOKEN }}

    fabric-dependencies: "fabric-api@required"
```

## All options explained

### summary

- Required: `false`
- Default: `true`
- Description: when set to true this action will create a summary inside your workflow

### dryrun

- Required: `false`
- Default: `false`
- Description: when set to true the requests to the platforms (curseforge/modrinth) will not be executed

### mod-id

- Required: `true`
- Description: the minecraft id of your mod
- Example: `"examplemod"`

### mod-version

- Required: `true`
- Description: the version of the mod, used for publishing to curseforge and modrinth
- Example: `"2.7.4"`

### minecraft-version

- Required: `true`
- Description: the minecraft version of the build, used for publishing to curseforge and modrinth
- Example: `"1.20.4"`

### changelog

- Required: `false`
- Default: `""`
- Description: changelog that is added to the file while publishing to curseforge and modrinth

### version-range

- Required: `true`
- Description: what minecraft versions does this build support, used for curseforge and modrinth
- Example: `">=1.20.4 <1.21"`

### version-type

- Required: `false`
- Default: `"release"`
- Values: only `release`, `beta` or `alpha` allowed

### curseforge-id

- Required: `false`
- Description: the project id for the mod
- Note: When provided the supplied files will be uploaded to `curseforge.com`. If no id is provided the upload will be skipped.

### curseforge-token

- Required: `false`
- Description: the token to authorize against the curseforge api
- Note: Required when `curseforge-id` is set

### curseforge-name

- Required: `false`
- Default: defaults to the provided filename
- Description: user friendly display name of this file
- Example: `ExampleMod 1.20.4`

### changelog-format

- Required: `false`
- Description: the formatting of the changelog
- Values: only `text`, `html` or `markdown` allowed
- Note: only effective on curseforge

### modrinth-id

- Required: `false`
- Description: the project id for the mod
- Note: When provided the supplied files will be uploaded to `modrinth.com`. If no id is provided the upload will be skipped.

### modrinth-token

- Required: `false`
- Description: the token to authorize against the modrinth api
- Note: Required when `modrinth-id` is set

### modrinth-name

- Required: `false`
- Default: defaults to `<loader> - <minecraft-version> - <mod-version>`
- Description: user friendly display name of this file
- Example: `ExampleMod 1.20.4`

### modrinth-version

- Required: `false`
- Default: defaults to `<loader>-<minecraft-version>-<mod-version>`
- Description: the name of this version
- Example: `"1.20.4-2.7.4"`

### featured

- Required: `false`
- Default: `false`
- Description: whether or not the file is marked as featured on modrinth
- Note: no longer used by modrinth

### forge-path

- Required: `false`
- Description: If provided, this single file will be uploaded to the configured platforms.
- Note: If no path is provided the action will look for a file named `./forge/build/libs/<mod-id>-forge-<mc-version>-<mod-version>.jar`

### forge-dependencies

- Required: `false`
- Description: Forge specific dependencies that will be declared on curseforge and modrinth
- Example: `"geckolib@required"`

### fabric-path

- Required: `false`
- Description: If provided, this single file will be uploaded to the configured platforms.
- Note: If no path is provided the action will look for a file named `./fabric/build/libs/<mod-id>-fabric-<mc-version>-<mod-version>.jar`

### fabric-dependencies

- Required: `false`
- Description: Fabric specific dependencies that will be declared on curseforge and modrinth
- Example: `"fabric-api@required;geckolib@required"`

### neoforge-path

- Required: `false`
- Description: If provided, this single file will be uploaded to the configured platforms.
- Note: If no path is provided the action will look for a file named `./neoforge/build/libs/<mod-id>-neoforge-<mc-version>-<mod-version>.jar`

### neoforge-dependencies

- Required: `false`
- Description: NeoForge specific dependencies that will be declared on curseforge and modrinth
- Example: `"geckolib@required"`

## Dependency-Format

```cpp
slug ::= user-friendly identifier of the dependency
type ::= required | optional | incompatible | embedded

dependency ::= <slug>@<type>
dependencies ::= dependency[;dependency]
```

**Examples**:

- `"geckolib@required"`
- `"fabric-api@required;geckolib@required"`
