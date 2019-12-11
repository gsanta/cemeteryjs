import { WorldItemTemplate } from '../../WorldItemTemplate';


export interface InputConverter {
    convert(worldmap: string, worldItemTemplates: WorldItemTemplate[]): string;
}

export class NullConverter implements InputConverter {
    convert(worldMap: string): string {
        return worldMap;
    }
}