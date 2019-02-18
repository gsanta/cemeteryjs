import * as _ from 'lodash';
import { MatrixGraph } from './MatrixGraph';
import { LinesToGraphConverter } from './LinesToGraphConverter';
import { DetailsLineToObjectConverter, DetailsLineDataTypes } from './DetailsLineToObjectConverter';

export const defaultMap = `
map {

##########
#WWWIIWWW#
#W######W#
#WWWWWWWW#
##########

}

definitions {

W = wall
# = empty
I = window

}

details {
    attributes: [
        {
            pos: {
                x: 4,
                y: 1
            },
            axis: {
                x: 4,
                y: 1
            },
            angle: 90
        }
    ]
}
`;

enum ParseSections {
    MAP,
    DEFINITION,
    DETAILS,
    DETAILS2
}

interface DetailsJsonSchema {
    attributes: {
        pos: {
            x: number;
            y: number;
        }
    }[];
}

export class GameMapReader {
    private linesToGraphConverter: LinesToGraphConverter;
    private section: ParseSections = null;

    private static MAP_SECTION_START_TEST = /\s*map\s*`\s*/;
    private static DEFINITIONS_SECTION_START_TEST = /\s*definitions\s*`\s*/;
    private static SECTION_CLOSING_TEST = /^\s*\`\s*$/;
    private static DEFINITION_SECTION_LINE_TEST = /^\s*(\S)\s*\=\s*(\S*)\s*$/;
    private static DETAILS_SECTION_START_TEST =  /\s*details\s*`\s*/;
    private static DETAILS2_SECTION_START_TEST =  /\s*details2\s*`\s*/;

    private worldMapLines: string[];
    private detailsLines: string[] = [];
    private charachterToNameMap: {[key: string]: string};
    private detailsSectionStr: string = '';
    private vertexAdditinalData: {[key: number]: any} = {};
    private detailsLineToObjectConverter: DetailsLineToObjectConverter;

    public read(worldmap: string): MatrixGraph {
        this.worldMapLines = [];
        this.charachterToNameMap = {};

        this.linesToGraphConverter = new LinesToGraphConverter();
        this.detailsLineToObjectConverter = new DetailsLineToObjectConverter({
            pos: DetailsLineDataTypes.COORDINATE,
            axis: DetailsLineDataTypes.COORDINATE,
            axis1: DetailsLineDataTypes.COORDINATE,
            axis2: DetailsLineDataTypes.COORDINATE,
            angle: DetailsLineDataTypes.NUMBER
        });
        return this.stringToGraph(worldmap);
    }

    private stringToGraph(worldmap: string): MatrixGraph {
        const lines = worldmap.split(/\r?\n/);

        this.categorizeLines(lines);
        return this.linesToGraphConverter.parse(this.worldMapLines, this.charachterToNameMap, this.vertexAdditinalData);
    }

    private categorizeLines(lines: string[]) {
        lines
        .filter(line => line.trim() !== '')
        .forEach(line => {
            const prevSection = this.section;
            this.checkParseState(line);

            if (this.section === prevSection) {
                if (this.section === ParseSections.MAP) {
                    this.worldMapLines.push(line.trim())
                } else if (this.section === ParseSections.DEFINITION) {
                    const match = line.match(GameMapReader.DEFINITION_SECTION_LINE_TEST);
                    this.charachterToNameMap[match[1]] = match[2];
                } else if (this.section === ParseSections.DETAILS) {
                    this.detailsSectionStr += line;
                } else if (this.section === ParseSections.DETAILS2) {
                    if (line.trim() !== '') {
                        this.detailsLines.push(line.trim());
                    }
                }
            }
        });


        let attributes = (<DetailsJsonSchema> JSON.parse(`{${this.detailsSectionStr}}`)).attributes || [];

        const newAttributes = this.detailsLines.map(line => this.convertDetailsLineToAdditionalData(line));

        attributes = [...attributes, ...newAttributes ]

        attributes.forEach(attribute => {
            const vertex = this.worldMapLines[0].length * attribute.pos.y + attribute.pos.x;
            this.vertexAdditinalData[vertex] = attribute
        });
    }

    private convertDetailsLineToAdditionalData(line: string): any {
        return this.detailsLineToObjectConverter.convert(line);
    }

    private checkParseState(line: string) {
        if (GameMapReader.MAP_SECTION_START_TEST.test(line)) {
            this.section = ParseSections.MAP;
        } else if (GameMapReader.DEFINITIONS_SECTION_START_TEST.test(line)) {
            this.section = ParseSections.DEFINITION;
        } else if (GameMapReader.DETAILS_SECTION_START_TEST.test(line)) {
            this.section = ParseSections.DETAILS;
        } else if (GameMapReader.DETAILS2_SECTION_START_TEST.test(line)) {
            this.section = ParseSections.DETAILS2;
        } else if (GameMapReader.SECTION_CLOSING_TEST.test(line)) {
            this.section = null;
        }
    }
}
