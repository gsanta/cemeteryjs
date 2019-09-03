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
export class WorldMapToRoomMapConverter implements WorldMapLineListener {
    private roomSeparatorCharacters: string[];
    private wallChar: string;
    private roomChar: string;
    private worldMapReader: WorldMapReader;

    private lines: string[] = [];

    constructor(wallChar: string, roomChar: string, borderCharacters: string[]) {
        this.wallChar = wallChar;
        this.roomChar = roomChar;
        this.roomSeparatorCharacters = borderCharacters;
        this.worldMapReader = new WorldMapReader(this);
    }

    public convert(worldmap: string): string {
        this.worldMapReader.read(worldmap);

        return this.lines.join('\n');
    }

    public addMapSectionLine(line: string) {
        this.roomSeparatorCharacters.forEach(char => {
            line = line.replace(new RegExp(char, 'g'), this.wallChar);
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