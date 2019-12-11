import { WorldItemTemplate, WorldItemRole } from '../../WorldItemTemplate';
import { GlobalConfig } from '../readers/text/GlobalSectionParser';
import { ConfigReader } from '../readers/ConfigReader';
import { WorldItem } from '../../WorldItem';

export class ConfigService {
    globalConfig: GlobalConfig;
    furnitures: WorldItemTemplate[];
    
    worldItemTemplates: WorldItemTemplate[];
    worldItemHierarchy: WorldItem[];

    private configReader: ConfigReader;

    constructor(configReader: ConfigReader) {
        this.configReader = configReader;
    }

    update(worldMap: string): ConfigService {
        const {worldItemTypes, globalConfig} = this.configReader.read(worldMap);
        this.worldItemTemplates = worldItemTypes;
        this.worldItemTemplates.push({
            id: WorldItemTemplate.generateId(this.worldItemTemplates),
            typeName: 'root',
            shape: 'rectangle',
            roles: [WorldItemRole.CONTAINER],
        });
        this.globalConfig = globalConfig;
        this.furnitures = this.worldItemTemplates.filter(descriptor => {
            return !descriptor.roles.includes(WorldItemRole.CONTAINER) && !descriptor.roles.includes(WorldItemRole.BORDER)
        });

        return this;
    }
}