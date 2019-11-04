import { WorldMapGraph } from '../../../WorldMapGraph';
import { range } from '../../utils/Functions';
import { ConfigService } from '../../services/ConfigService';

export class LinesToGraphConverter {
    private graph: WorldMapGraph;
    private lines: string[];
    private columns: number;
    private rows: number;
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        this.configService = configService;
    }

    public parse(lines: string[]): WorldMapGraph {
        this.lines = lines;
        this.columns = this.lines[0].length;
        this.rows = this.lines.length;
        this.graph = new WorldMapGraph(this.columns, this.rows);
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
            const type = this.configService.getMeshDescriptorByChar(character).typeName;
            this.graph.addVertex(val, type);
        });

    }
}
