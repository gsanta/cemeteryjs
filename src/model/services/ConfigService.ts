import { MeshDescriptor, FurnitureDimensionsDescriptor, BorderDimensionsDescriptor } from "../../Config";
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
    typeToCharMap: Map<string, string>;

    constructor(worldMap: string, meshDescriptorMap: Map<string, MeshDescriptor>) {
        this.meshDescriptorMap = meshDescriptorMap;
        this.update(worldMap)
    }

    update(worldMap: string) {
        this.typeToCharMap = new DefinitionSectionParser().parse(worldMap);
        const types = Array.from(this.typeToCharMap.keys());
        this.emptyType = 'empty';
        this.borderTypes = DEFAULT_BORDERS;
        this.furnitureTypes = types.filter(type => !this.borderTypes.includes(type) && !INTERNAL_TYPES.includes(type));
    }

    getFurnitureDimensions(type: string): FurnitureDimensionsDescriptor {
        return <FurnitureDimensionsDescriptor> this.meshDescriptorMap.get(type).realDimensions;
    }

    getRealBorderWidth(type: string): BorderDimensionsDescriptor {
        return  this.meshDescriptorMap.get(type) ? <BorderDimensionsDescriptor> this.meshDescriptorMap.get(type).realDimensions : null;
    }
}