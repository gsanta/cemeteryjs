import { WorldMapLineListener, WorldMapReader } from './reader/WorldMapReader';
import { ServiceFacade } from '../services/ServiceFacade';
import { ConfigService } from '../services/ConfigService';

/*
 * Takes a world map (gwm string) and converts the characters inside the map to contain only
 * two characters which represent the walls and the rooms.
 *
 * e.g
 *
 * input:
 *
 * WIIIW
 * W###W
 * WDDWW
 *
 * output:
 *
 * -----
 * -###-
 * -----
 */
export class WorldMapToRoomMapConverter extends WorldMapLineListener {
    private wallChar: string;
    private roomChar: string;
    private worldMapReader: WorldMapReader;

    private lines: string[] = [];
    private configService: ConfigService;

    constructor(configService: ConfigService, wallChar: string, roomChar: string) {
        super();
        this.configService = configService;
        this.wallChar = wallChar;
        this.roomChar = roomChar;
        this.worldMapReader = new WorldMapReader(this);
    }

    public convert(worldmap: string): string {
        this.worldMapReader.read(worldmap);

        return this.lines.join('\n');
    }

    public addMapSectionLine(line: string) {
        this.configService.borders.forEach(descriptor => {
                line = line.replace(new RegExp(descriptor.char, 'g'), this.wallChar);
            });

        line = line.replace(new RegExp(`[^${this.wallChar}\\s]`, 'g'), this.roomChar);

        this.lines.push(line);
    }

    public addDefinitionSectionLine(line: string) {
        this.lines.push(line);
    }

    public addDetailsSectionLine(line: string) {
        this.lines.push(line);
    }

    public addSeparator(line: string) {
        this.lines.push(line);
    }
}