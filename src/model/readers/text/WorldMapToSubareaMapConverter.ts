import { ConfigService } from '../../services/ConfigService';
import { InputConverter } from '../InputConverter';
import { TextWorldMapParser, WorldMapLineListener } from './TextWorldMapParser';
import { WorldItem } from '../../../WorldItem';
import { WorldItemDefinition } from '../../../WorldItemDefinition';

export class WorldMapToSubareaMapConverter extends WorldMapLineListener implements InputConverter {
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
        const emptyChar = this.configService.meshDescriptorMap.get('room').char
        const borderChars = WorldItemDefinition.borders(this.configService.meshDescriptors).map(border => border.char);

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