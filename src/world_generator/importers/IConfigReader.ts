import { GameObjectTemplate } from "../services/GameObjectTemplate";
import { GlobalConfig } from './svg/GlobalSectionParser';

export interface IConfigReader {
    read(worldMap: string): {gameObjectTemplates: GameObjectTemplate[], globalConfig: GlobalConfig};
}