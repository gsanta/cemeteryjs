import { LinesToGraphConverter } from './LinesToGraphConverter';
import { WorldMapGraph } from '../../parsers/WorldMapGraph';
import { DetailsLineToObjectConverter, DetailsLineDataTypes } from './DetailsLineToObjectConverter';
import { WorldMapLineListener, WorldMapReader } from './WorldMapReader';
import { ConfigService } from '../../services/ConfigService';


export class WorldMapToMatrixGraphConverter extends WorldMapLineListener {
    private linesToGraphConverter: LinesToGraphConverter;
    private worldMapReader: WorldMapReader;

    private worldMapLines: string[];
    private detailsLines: string[] = [];
    private vertexAdditinalData: {[key: number]: any} = {};
    private detailsLineToObjectConverter: DetailsLineToObjectConverter;
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        super();
        this.configService = configService;
        this.worldMapReader = new WorldMapReader(this);
    }

    public convert(worldmap: string): WorldMapGraph {
        this.worldMapLines = [];

        this.linesToGraphConverter = new LinesToGraphConverter(this.configService);
        this.detailsLineToObjectConverter = new DetailsLineToObjectConverter({
            pos: DetailsLineDataTypes.COORDINATE,
            axis: DetailsLineDataTypes.COORDINATE,
            axis1: DetailsLineDataTypes.COORDINATE,
            axis2: DetailsLineDataTypes.COORDINATE,
            angle: DetailsLineDataTypes.NUMBER
        });
        return this.stringToGraph(worldmap);
    }

    private stringToGraph(worldmap: string): WorldMapGraph {
        this.worldMapReader.read(worldmap);

        const attributes = this.detailsLines.map(line => this.convertDetailsLineToAdditionalData(line));

        attributes.forEach(attribute => {
            const vertex = this.worldMapLines[0].length * attribute.pos.y + attribute.pos.x;
            this.vertexAdditinalData[vertex] = attribute
        });

        return this.linesToGraphConverter.parse(this.worldMapLines);
    }

    private convertDetailsLineToAdditionalData(line: string): any {
        return this.detailsLineToObjectConverter.convert(line);
    }

    public addMapSectionLine(line: string) {
        this.worldMapLines.push(line.trim())
    }

    public addDetailsSectionLine(line: string) {
        this.detailsLines.push(line);
    }

    public addSeparator() {}
}