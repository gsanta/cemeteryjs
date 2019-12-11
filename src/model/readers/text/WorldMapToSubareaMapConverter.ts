import { WorldItemStore } from '../../services/WorldItemStore';
import { InputConverter } from '../InputConverter';
import { TextWorldMapParser, WorldMapLineListener } from './TextWorldMapParser';
import { WorldItem } from '../../../WorldItem';
import { WorldItemTemplate } from '../../../WorldItemTemplate';

export class WorldMapToSubareaMapConverter extends WorldMapLineListener implements InputConverter {
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
        const emptyChar =  WorldItemTemplate.getByTypeName('room', this.worldItemTemplates).char
        const borderChars = WorldItemTemplate.borders(this.worldItemTemplates).map(border => border.char);

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