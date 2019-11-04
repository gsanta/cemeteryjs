import { WorldItemType } from "../../WorldItemType";
import { DefinitionSectionParser } from "../readers/text/DefinitionSectionParser";
import { GlobalConfig } from '../readers/text/GlobalSectionParser';

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
    borders: WorldItemType[];
    furnitures: WorldItemType[];
    emptyType: string;
    meshDescriptors: WorldItemType[];
    meshDescriptorMap: Map<string, WorldItemType>;
    meshDescriptorMapByChar: Map<string, WorldItemType>;

    update(worldMap: string): ConfigService {
        this.meshDescriptors = new DefinitionSectionParser().parse(worldMap);
        this.meshDescriptorMap = new Map();
        this.meshDescriptors.forEach(desc => this.meshDescriptorMap.set(desc.typeName, desc));
        this.meshDescriptorMapByChar = new Map();
        this.meshDescriptors.forEach(desc => this.meshDescriptorMapByChar.set(desc.char, desc));
        this.emptyType = 'empty';
        this.borders = this.meshDescriptors.filter(descriptor => descriptor.isBorder);
        this.furnitures = this.meshDescriptors.filter(descriptor => !descriptor.isBorder && !INTERNAL_TYPES.includes(descriptor.typeName));

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