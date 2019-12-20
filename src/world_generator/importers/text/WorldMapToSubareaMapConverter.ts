import { GameAssetStore } from '../../services/GameAssetStore';
import { IInputConverter } from '../IInputConverter';
import { TextWorldMapParser, WorldMapLineListener } from './TextWorldMapParser';
import { GameObject } from '../../services/GameObject';
import { GameObjectTemplate } from '../../services/GameObjectTemplate';

export class WorldMapToSubareaMapConverter extends WorldMapLineListener implements IInputConverter {
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
        const emptyChar =  GameObjectTemplate.getByTypeName('room', this.gameObjectTemplates).char
        const borderChars = GameObjectTemplate.borders(this.gameObjectTemplates).map(border => border.char);

        borderChars.forEach(char => {
            line = line.replace(new RegExp(char, 'g'), emptyChar);
        });

        // line = line.replace(new RegExp(`[^${this.emptyCharacter}\\s]`, 'g'), this.sectionCharacter);

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