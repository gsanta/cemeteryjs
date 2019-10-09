import { CharGraph } from '../CharGraph';
import { range } from '../../utils/Functions';
import { ServiceFacade } from '../../services/ServiceFacade';

export class LinesToGraphConverter {
    private graph: CharGraph;
    private lines: string[];
    private columns: number;
    private rows: number;
    private services: ServiceFacade<any, any, any>;

    constructor(services: ServiceFacade<any, any, any>) {
        this.services = services;
    }

    public parse(lines: string[]): CharGraph {
        this.lines = lines;
        this.columns = this.lines[0].length;
        this.rows = this.lines.length;
        this.graph = new CharGraph(this.columns, this.rows);
        this.initGraph();

        return this.graph;
    }

    private initGraph() {
        const vertices = this.lines[0].length * this.lines.length;
        const findCharacter = (index) => {
            const row = Math.floor(index / this.columns);
            const column = index % this.columns;

            return this.lines[row][column];
        };

        range(0, vertices).forEach(val => {
            const character = findCharacter(val);
            const name = this.services.configService.getMeshDescriptorByChar(character).type;
            this.graph.addVertex(val, character, name);
        });

    }
}
