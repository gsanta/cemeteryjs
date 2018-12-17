import {createInterface, ReadLine} from 'readline';
import * as _ from 'lodash';
import { MatrixGraph } from './MatrixGraph';
import { LinesToGraphConverter } from './LinesToGraphConverter';

export const defaultMap = `
map {

##########
#WWWIIWWW#
#W######W#
#WWWWWWWW#
##########/^\s*}\s*$/

}

definitions {

W = wall
# = empty
I = window

}
`;

enum ParseSections {
    MAP,
    DEFINITION
}

export class GameMapReader {
    private readline: ReadLine;
    private linesToGraphConverter: LinesToGraphConverter;
    private section: ParseSections = null;

    private static MAP_SECTION_START_TEST = /\s*map\s*{\s*/;
    private static DEFINITIONS_SECTION_START_TEST = /\s*definitions\s*{\s*/;
    private static SECTION_CLOSING_TEST = /^\s*}\s*$/;
    private static DEFINITION_SECTION_LINE_TEST = /^\s*(\S)\s*\=\s*(\S*)\s*$/;

    private worldMapLines: string[];
    private charachterToNameMap: {[key: string]: string};

    public read(readable: ReadableStream): Promise<MatrixGraph> {
        this.worldMapLines = [];
        this.charachterToNameMap = {};
        this.readline = createInterface({
            input: <any> readable,
            crlfDelay: Infinity
        });
        this.linesToGraphConverter = new LinesToGraphConverter();
        return this.stringToGraph();
    }

    private stringToGraph(): Promise<MatrixGraph> {
        return new Promise((resolve, reject) => {
            const lines: string[] = [];

            this.readline.on('line', (line: string) => {
                lines.push(line.trim());
            });

            this.readline.on('close', () => {
                resolve(lines);
            });

            this.readline.on('error', (e) => {
                reject(e);
            });
        })
        .then((lines: string[]) => {
            this.categorizeLines(lines);
            debugger;
            return this.linesToGraphConverter.parse(this.worldMapLines, this.charachterToNameMap)
        });
    }

    private categorizeLines(lines: string[]) {
        lines
        .filter(line => line.trim() !== '')
        .forEach(line => {
            const prevSection = this.section;
            this.checkParseState(line);

            if (this.section === prevSection) {
                if (this.section === ParseSections.MAP) {
                    this.worldMapLines.push(line)
                } else if (this.section === ParseSections.DEFINITION) {
                    const match = line.match(GameMapReader.DEFINITION_SECTION_LINE_TEST);
                    this.charachterToNameMap[match[1]] = match[2];
                }
            }
        });
    }

    private checkParseState(line: string) {

        if (GameMapReader.MAP_SECTION_START_TEST.test(line)) {
            this.section = ParseSections.MAP;
        } else if (GameMapReader.DEFINITIONS_SECTION_START_TEST.test(line)) {
            this.section = ParseSections.DEFINITION;
        } else if (GameMapReader.SECTION_CLOSING_TEST.test(line)) {
            this.section = null;
        }
    }
}
