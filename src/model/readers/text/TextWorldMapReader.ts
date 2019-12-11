import { LinesToGraphConverter } from './LinesToGraphConverter';
import { WorldMapGraph } from '../../../WorldMapGraph';
import { DetailsLineToObjectConverter, DetailsLineDataTypes } from './DetailsLineToObjectConverter';
import { WorldMapLineListener, TextWorldMapParser } from './TextWorldMapParser';
import { WorldMapReader } from '../WorldMapReader';
import { ServiceFacade } from '../../services/ServiceFacade';

export class TextWorldMapReader extends WorldMapLineListener implements WorldMapReader {
    private linesToGraphConverter: LinesToGraphConverter;
    private worldMapReader: TextWorldMapParser;

    private worldMapLines: string[];
    private detailsLines: string[] = [];
    private vertexAdditinalData: {[key: number]: any} = {};
    private detailsLineToObjectConverter: DetailsLineToObjectConverter;
    private services: ServiceFacade;

    constructor(services: ServiceFacade) {
        super();
        this.services = services;
        this.worldMapReader = new TextWorldMapParser(this);
    }

    public read(worldmap: string): WorldMapGraph {
        this.worldMapLines = [];

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

    private stringToGraph(worldmap: string): WorldMapGraph {
        this.worldMapReader.read(worldmap);

        const attributes = this.detailsLines.map(line => this.convertDetailsLineToAdditionalData(line));

        attributes.forEach(attribute => {
            const vertex = this.worldMapLines[0].length * attribute.pos.y + attribute.pos.x;
            this.vertexAdditinalData[vertex] = attribute
        });

        return this.linesToGraphConverter.parse(this.worldMapLines, this.services.worldItemStore.worldItemTemplates);
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