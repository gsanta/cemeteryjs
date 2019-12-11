import { WorldItemTemplate } from "../../WorldItemTemplate";
import { GlobalConfig } from './text/GlobalSectionParser';

export interface ConfigReader {
    read(worldMap: string): {worldItemTemplates: WorldItemTemplate[], globalConfig: GlobalConfig};
}