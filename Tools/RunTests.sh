

clear


deno test                                               \
    --parallel                                          \
    --importmap="StandardLibrary/Tests/Imports.json"    \
    StandardLibrary/Tests/