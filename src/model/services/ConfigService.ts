import { WorldItemDefinition, WorldItemRole } from '../../WorldItemDefinition';
import { GlobalConfig } from '../readers/text/GlobalSectionParser';
import { ConfigReader } from '../readers/ConfigReader';
import { WorldItem } from '../../WorldItem';

export class ConfigService {
    globalConfig: GlobalConfig;
    furnitures: WorldItemDefinition[];
    meshDescriptors: WorldItemDefinition[];
    meshDescriptorMap: Map<string, WorldItemDefinition>;

    worldItemHierarchy: WorldItem[];

    private configReader: ConfigReader;

    constructor(configReader: ConfigReader) {
        this.configReader = configReader;
    }

    update(worldMap: string): ConfigService {
        const {worldItemTypes, globalConfig} = this.configReader.read(worldMap);
        this.meshDescriptors = worldItemTypes;
        this.meshDescriptors.push({
            id: WorldItemDefinition.generateId(this.meshDescriptors),
            typeName: 'root',
            shape: 'rectangle',
            roles: [WorldItemRole.CONTAINER],
        });
        this.globalConfig = globalConfig;
        this.meshDescriptorMap = new Map();
        this.meshDescriptors.forEach(desc => this.meshDescriptorMap.set(desc.typeName, desc));
        this.furnitures = this.meshDescriptors.filter(descriptor => {
            return !descriptor.roles.includes(WorldItemRole.CONTAINER) && !descriptor.roles.includes(WorldItemRole.BORDER)
        });

        return this;
    }

    getMeshDescriptorByType(type: string) {
        return this.meshDescriptorMap.get(type);
    }

    getRealBorderWidth(type: string): { width: number, height?: number } {
        return  this.meshDescriptorMap.get(type) ? this.meshDescriptorMap.get(type).realDimensions : null;
    }
}