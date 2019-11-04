import { WorldMapLineListener, TextWorldMapParser } from './TextWorldMapParser';
import { ConfigService } from '../../services/ConfigService';

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
    private worldMapReader: TextWorldMapParser;

    private lines: string[] = [];
    private configService: ConfigService;

    constructor(configService: ConfigService) {
        super();
        this.configService = configService;
        this.worldMapReader = new TextWorldMapParser(this);
    }

    public convert(worldmap: string): string {
        this.worldMapReader.read(worldmap);

        return this.lines.join('\n');
    }

    public addMapSectionLine(line: string) {
        const wallChar = this.configService.meshDescriptorMap.get('wall').char;
        const roomChar = this.configService.meshDescriptorMap.get('room').char;
        const outdoorsChar = this.configService.meshDescriptorMap.get('outdoors') ? this.configService.meshDescriptorMap.get('outdoors').char : '';

        this.configService.borders.forEach(descriptor => {
                line = line.replace(new RegExp(descriptor.char, 'g'), wallChar);
            });

        line = line.replace(new RegExp(`[^${wallChar}${outdoorsChar}\\s]`, 'g'), roomChar);

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