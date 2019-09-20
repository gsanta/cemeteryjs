import { WorldMapLineListener, WorldMapReader } from "./reader/WorldMapReader";

const DEFINITION_SECTION_LINE_TEST = /^\s*(\S)\s*\=\s*(\S*)\s*$/;

export class DefinitionSectionParser extends WorldMapLineListener {
    private typeToCharMap: Map<string, string>;

    parse(worldMap: string): Map<string, string> {
        this.typeToCharMap = new Map();

        new WorldMapReader(this).read(worldMap);

        return this.typeToCharMap;
    }

    public addDefinitionSectionLine(line: string) {
        const match = line.match(DEFINITION_SECTION_LINE_TEST);

        this.typeToCharMap.set(match[2], match[1]);
    }
}