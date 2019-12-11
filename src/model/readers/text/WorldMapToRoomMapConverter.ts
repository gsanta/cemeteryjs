import { WorldMapLineListener, TextWorldMapParser } from './TextWorldMapParser';
import { ConfigService } from '../../services/ConfigService';
import { InputConverter } from '../InputConverter';
import { WorldItem } from '../../../WorldItem';
import { WorldItemTemplate } from '../../../WorldItemTemplate';

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
export class WorldMapToRoomMapConverter extends WorldMapLineListener implements InputConverter {
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
        const wallChar = WorldItemTemplate.getByTypeName('wall', this.configService.worldItemTemplates).char;
        const roomChar = WorldItemTemplate.getByTypeName('room', this.configService.worldItemTemplates).char;
        
        const outdoors = WorldItemTemplate.getByTypeName('outdoors', this.configService.worldItemTemplates);
        const outdoorsChar = outdoors ? outdoors.char : '';

        WorldItemTemplate.borders(this.configService.worldItemTemplates).forEach(descriptor => {
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