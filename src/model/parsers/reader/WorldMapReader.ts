enum ParseSections {
    MAP,
    DEFINITION,
    GLOBALS
}

export abstract class WorldMapLineListener {
    addMapSectionLine(line: string) {}
    addDefinitionSectionLine(line: string) {}
    addGlobalsSectionLine(line: string) {}
    addSeparator(line: string) {}
}

export class WorldMapReader {
    private listener: WorldMapLineListener;
    private section: ParseSections = null;

    private static MAP_SECTION_START_TEST = /\s*map\s*`\s*/;
    private static DEFINITIONS_SECTION_START_TEST = /\s*definitions\s*`\s*/;
    private static GLOBALS_SECTION_START_TEST = /\s*globals\s*`\s*/;
    private static SECTION_CLOSING_TEST = /^\s*\`\s*$/;

    constructor(listener: WorldMapLineListener) {
        this.listener = listener;
    }

    public read(worldMap: string): void {
        const lines = worldMap.split(/\r?\n/);

        this.categorizeLines(lines);
    }

    private categorizeLines(lines: string[]) {
        lines
        .forEach(line => {
            const prevSection = this.section;
            this.checkParseState(line);

            if (this.section === prevSection) {
                if (line.trim() === '') {
                    this.listener.addSeparator(line);
                } else if (this.section === ParseSections.MAP) {
                    this.listener.addMapSectionLine(line);
                } else if (this.section === ParseSections.DEFINITION) {
                    this.listener.addDefinitionSectionLine(line);
                } else if (this.section === ParseSections.GLOBALS) {
                    this.listener.addGlobalsSectionLine(line);
                }
            } else {
                this.listener.addSeparator(line);
            }
        });
    }

    private checkParseState(line: string) {
        if (WorldMapReader.MAP_SECTION_START_TEST.test(line)) {
            this.section = ParseSections.MAP;
        } else if (WorldMapReader.DEFINITIONS_SECTION_START_TEST.test(line)) {
            this.section = ParseSections.DEFINITION;
        } else if (WorldMapReader.GLOBALS_SECTION_START_TEST.test(line)) {
            this.section = ParseSections.GLOBALS;
        } else if (WorldMapReader.SECTION_CLOSING_TEST.test(line)) {
            this.section = null;
        }
    }
}
