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
    'empty',
    'room'
]

export class ConfigService {
    globalConfig: GlobalConfig;
    borders: MeshDescriptor[];
    furnitures: MeshDescriptor[];
    emptyType: string;
    meshDescriptors: MeshDescriptor[];
    meshDescriptorMap: Map<string, MeshDescriptor>;
    meshDescriptorMapByChar: Map<string, MeshDescriptor>;

    update(worldMap: string): ConfigService {
        this.meshDescriptors = new DefinitionSectionParser().parse(worldMap);
        this.meshDescriptorMap = new Map();
        this.meshDescriptors.forEach(desc => this.meshDescriptorMap.set(desc.type, desc));
        this.meshDescriptorMapByChar = new Map();
        this.meshDescriptors.forEach(desc => this.meshDescriptorMapByChar.set(desc.char, desc));
        this.emptyType = 'empty';
        this.borders = this.meshDescriptors.filter(descriptor => descriptor.isBorder);
        this.furnitures = this.meshDescriptors.filter(descriptor => !descriptor.isBorder && !INTERNAL_TYPES.includes(descriptor.type));

        return this;
    }

    getMeshDescriptorByChar(char: string) {
        return this.meshDescriptorMapByChar.get(char);
    }

    getRealBorderWidth(type: string): { width: number, height?: number } {
        return  this.meshDescriptorMap.get(type) ? this.meshDescriptorMap.get(type).realDimensions : null;
    }
}