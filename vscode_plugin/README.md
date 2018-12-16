# game-worldmap-colorizer

This extension makes it more easy to visualize world maps for games, by adding unique colors to the different characters.
It can be used as a visual aid for designing world maps for games.

The extension can interpret the .gwm file format for the [game-worldmap-generator](https://github.com/gsanta/game-worldmap-generator) npm module.

![Worldmap image](https://github.com/gsanta/game-worldmap-generator/raw/master/vscode_plugin/img/worldmap.png)

## About the file format

The main map definition is surrounded by `map {}`.
The definition section is surroudned by `definition {}`.

The definition section is used by the [game-worldmap-generator](https://github.com/gsanta/game-worldmap-generator) module to give names
to the different type of objects it generates based on the map.

The file extension should be `.gwm`.