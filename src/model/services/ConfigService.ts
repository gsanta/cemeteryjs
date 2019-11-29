import { WorldItemDefinition, WorldItemRole } from '../../WorldItemDefinition';
import { TextConfigReader } from "../readers/text/TextConfigReader";
import { GlobalConfig } from '../readers/text/GlobalSectionParser';
import { ConfigReader } from '../readers/ConfigReader';

const DEFAULT_BORDERS = [
    'wall',
    'door',
    'window'
];

const INTERNAL_TYPES = [
    '_subarea',
    'empty',
    'room',
    'outdoors'
]

export class ConfigService {
    globalConfig: GlobalConfig;
    borders: WorldItemDefinition[];
    furnitures: WorldItemDefinition[];
    emptyType: string;
    meshDescriptors: WorldItemDefinition[];
    meshDescriptorMap: Map<string, WorldItemDefinition>;
    meshDescriptorMapByChar: Map<string, WorldItemDefinition>;

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
        this.meshDescriptorMapByChar = new Map();
        this.meshDescriptors.forEach(desc => this.meshDescriptorMapByChar.set(desc.char, desc));
        this.emptyType = 'empty';
        this.borders = this.meshDescriptors.filter(descriptor => descriptor.roles.includes(WorldItemRole.BORDER));
        this.furnitures = this.meshDescriptors.filter(descriptor => {
            return !descriptor.roles.includes(WorldItemRole.CONTAINER) && !descriptor.roles.includes(WorldItemRole.BORDER)
        });

        return this;
    }

    getMeshDescriptorByChar(char: string) {
        return this.meshDescriptorMapByChar.get(char);
    }

    getMeshDescriptorByType(type: string) {
        return this.meshDescriptorMap.get(type);
    }

    getRealBorderWidth(type: string): { width: number, height?: number } {
        return  this.meshDescriptorMap.get(type) ? this.meshDescriptorMap.get(type).realDimensions : null;
    }
}