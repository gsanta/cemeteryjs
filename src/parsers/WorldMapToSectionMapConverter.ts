import { WorldMapLineListener, WorldMapReader } from './reader/WorldMapReader';

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
export class WorldMapToSectionMapConverter implements WorldMapLineListener {
    private borderCharacters: string[];
    private sectionCharacter: string;
    private emptyCharacter: string;
    private worldMapReader: WorldMapReader;

    private lines: string[] = [];

    constructor(sectionCharacter: string, emptyCharacter: string, borderCharacters: string[]) {
        this.sectionCharacter = sectionCharacter;
        this.emptyCharacter = emptyCharacter;
        this.borderCharacters = borderCharacters;
        this.worldMapReader = new WorldMapReader(this);
    }

    public convert(worldmap: string): string {
        this.worldMapReader.read(worldmap);

        return this.lines.join('\n');
    }

    public addMapSectionLine(line: string) {
        this.borderCharacters.forEach(char => {
            line = line.replace(new RegExp(char, 'g'), this.emptyCharacter);
        });

        line = line.replace(new RegExp(`[^${this.emptyCharacter}\\s]`, 'g'), this.sectionCharacter);

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