import { WorldItemType } from "../../WorldItemType";
import { GlobalConfig } from './text/GlobalSectionParser';

export interface ConfigReader {
    read(worldMap: string): {worldItemTypes: WorldItemType[], globalConfig: GlobalConfig};
}