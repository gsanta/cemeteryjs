import { MeshDescriptor } from "../../Config";
import { DefinitionSectionParser } from "../parsers/DefinitionSectionParser";
import { GlobalConfig } from '../parsers/GlobalSectionParser';

const DEFAULT_BORDERS = [
    'wall',
    'door',
    'window'
];

const INTERNAL_TYPES = [
    '_subarea',
    'empty'
]

export class ConfigService {
    globalConfig: GlobalConfig;
    borderTypes: string[];
    furnitureTypes: string[];
    emptyType: string;
    meshDescriptorMap: Map<string, MeshDescriptor>;
    meshDescriptorMapByChar: Map<string, MeshDescriptor>;

    update(worldMap: string): ConfigService {
        const meshDescriptors = new DefinitionSectionParser().parse(worldMap);
        this.meshDescriptorMap = new Map();
        meshDescriptors.forEach(desc => this.meshDescriptorMap.set(desc.type, desc));
        meshDescriptors.forEach(desc => this.meshDescriptorMapByChar.set(desc.char, desc));
        const types = Array.from(this.meshDescriptorMap.keys());
        this.emptyType = 'empty';
        this.borderTypes = DEFAULT_BORDERS;
        this.furnitureTypes = types.filter(type => !this.borderTypes.includes(type) && !INTERNAL_TYPES.includes(type));

        return this;
    }

    getMeshDescriptorByChar(char: string) {
        return this.meshDescriptorMapByChar.get(char);
    }

    getRealBorderWidth(type: string): { width: number, height?: number } {
        return  this.meshDescriptorMap.get(type) ? this.meshDescriptorMap.get(type).realDimensions : null;
    }
}