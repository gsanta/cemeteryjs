import { WorldItemTemplate } from "../../WorldItemTemplate";
import { GlobalConfig } from './text/GlobalSectionParser';

export interface ConfigReader {
    read(worldMap: string): {worldItemTypes: WorldItemTemplate[], globalConfig: GlobalConfig};
}