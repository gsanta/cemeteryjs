import { WorldMapLineListener, TextWorldMapParser } from './TextWorldMapParser';
import { GameAssetStore } from '../../services/GameAssetStore';
import { IInputConverter } from '../IInputConverter';
import { GameObject } from '../../types/GameObject';
import { GameObjectTemplate } from '../../types/GameObjectTemplate';

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
export class WorldMapToRoomMapConverter extends WorldMapLineListener implements IInputConverter {
    private worldMapReader: TextWorldMapParser;
    private gameObjectTemplates: GameObjectTemplate[];

    private lines: string[] = [];

    constructor() {
        super();
        this.worldMapReader = new TextWorldMapParser(this);
    }

    public convert(worldmap: string, gameObjectTemplates: GameObjectTemplate[]): string {
        this.gameObjectTemplates = gameObjectTemplates;
        this.worldMapReader.read(worldmap);

        return this.lines.join('\n');
    }

    public addMapSectionLine(line: string) {
        const wallChar = GameObjectTemplate.getByTypeName('wall', this.gameObjectTemplates).char;
        const roomChar = GameObjectTemplate.getByTypeName('room', this.gameObjectTemplates).char;
        
        const outdoors = GameObjectTemplate.getByTypeName('outdoors', this.gameObjectTemplates);
        const outdoorsChar = outdoors ? outdoors.char : '';

        GameObjectTemplate.borders(this.gameObjectTemplates).forEach(descriptor => {
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