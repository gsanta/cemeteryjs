

export interface InputConverter {
    convert(worldmap: string): string;
}

export class NullConverter implements InputConverter {
    convert(worldMap: string): string {
        return worldMap;
    }
}