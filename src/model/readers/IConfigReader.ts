import { GameObjectTemplate } from "../types/GameObjectTemplate";
import { GlobalConfig } from './text/GlobalSectionParser';

export interface IConfigReader {
    read(worldMap: string): {gameObjectTemplates: GameObjectTemplate[], globalConfig: GlobalConfig};
}