import { GameObjectTemplate } from '../services/GameObjectTemplate';


export interface IInputConverter {
    convert(worldmap: string, gameObjectTemplates: GameObjectTemplate[]): string;
}

export class NullConverter implements IInputConverter {
    convert(worldMap: string): string {
        return worldMap;
    }
}