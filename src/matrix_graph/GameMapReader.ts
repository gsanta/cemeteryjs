import {createInterface, ReadLine} from 'readline';
import * as _ from 'lodash';
import { MatrixGraph } from './MatrixGraph';
import { LinesToGraphConverter } from './LinesToGraphConverter';

export const defaultMap = `
##################################################################
#WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#W#############################################################W##
#WWWWWWWWWWWWWWWWWWWW##WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW##
##################################################################
`;

export class GameMapReader {
    private readline: ReadLine;
    private linesToGraphConverter: LinesToGraphConverter;

    public read(readable: ReadableStream): Promise<MatrixGraph> {
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
        .then((lines: string[]) => this.linesToGraphConverter.parse(lines));
    }
}
