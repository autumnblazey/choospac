# the readme for the reader

because yes, readmes and documentation are magic uwu

## terms

i try to keep my doc comments consistent with these terms

- `data directory`: the root of the directory, where everything lives inside
- `version directory`: one level inside the data directory, named like `pack_v<n>` where &lt;n&gt; is the pack version for the resources
- `texture directory` or `texture group directory`: one more level in from the version directory, contains the groupings of the textures (ex like stone is a group, it contains options for stone textures)
- `options directory`: one more level in from the texture group directory, contains the invidivual choices for that specific texture/group. everything inside the directory is included inside the resulting resource pack.
- `manifest`: the file containing any metadata about that specific texture or grouping, named `manifest.choospac`, written in [json5](https://json5.org/), and put in the root of the directory that it associates with.
