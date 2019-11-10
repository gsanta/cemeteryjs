import { WorldItemDefinition } from "../../WorldItemDefinition";
import { GlobalConfig } from './text/GlobalSectionParser';

export interface ConfigReader {
    read(worldMap: string): {worldItemTypes: WorldItemDefinition[], globalConfig: GlobalConfig};
}