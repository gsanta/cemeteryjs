import { WorldMapLineListener, WorldMapReader } from "../../parsers/reader/WorldMapReader";

const DEFINITION_SECTION_LINE_TEST = /^\s*(\S)\s*\=\s*(\S*)\s*$/;

export class DefinitionSectionParser extends WorldMapLineListener {
    private charachterToNameMap: Map<string, string>;

    parse(worldMap: string): Map<string, string> {
        this.charachterToNameMap = new Map();

        new WorldMapReader(this).read(worldMap);

        return this.charachterToNameMap;
    }

    public addDefinitionSectionLine(line: string) {
        const match = line.match(DEFINITION_SECTION_LINE_TEST);

        this.charachterToNameMap.set(match[1], match[2]);
    }
}