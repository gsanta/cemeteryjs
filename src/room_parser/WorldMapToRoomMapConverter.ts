import { WorldMapLineListener, WorldMapReader } from '../matrix_graph/WorldMapReader';

export class WorldMapToRoomMapConverter implements WorldMapLineListener {
    private roomSeparatorCharacters: string[];
    private wallChar: string;
    private worldMapReader: WorldMapReader;

    private lines: string[] = [];

    constructor(wallChar: string, roomSeparatorCharacters: string[]) {
        this.wallChar = wallChar;
        this.roomSeparatorCharacters = roomSeparatorCharacters;
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