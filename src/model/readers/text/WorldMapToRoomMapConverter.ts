import { WorldMapLineListener, TextWorldMapParser } from './TextWorldMapParser';
import { WorldItemStore } from '../../services/WorldItemStore';
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
    private worldItemTemplates: WorldItemTemplate[];

    private lines: string[] = [];

    constructor() {
        super();
        this.worldMapReader = new TextWorldMapParser(this);
    }

    public convert(worldmap: string, worldItemTemplates: WorldItemTemplate[]): string {
        this.worldItemTemplates = worldItemTemplates;
        this.worldMapReader.read(worldmap);

        return this.lines.join('\n');
    }

    public addMapSectionLine(line: string) {
        const wallChar = WorldItemTemplate.getByTypeName('wall', this.worldItemTemplates).char;
        const roomChar = WorldItemTemplate.getByTypeName('room', this.worldItemTemplates).char;
        
        const outdoors = WorldItemTemplate.getByTypeName('outdoors', this.worldItemTemplates);
        const outdoorsChar = outdoors ? outdoors.char : '';

        WorldItemTemplate.borders(this.worldItemTemplates).forEach(descriptor => {
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