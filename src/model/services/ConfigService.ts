import { MeshDescriptor, FurnitureDimensionsDescriptor, BorderDimensionsDescriptor } from "../../Config";

export type Scaling = {
    x: number,
    y: number
}

export class ConfigService {
    borderTypes: string[];
    furnitureTypes: string[];
    emptyType: string;
    meshDescriptorMap: Map<string, MeshDescriptor>;
    scaling: Scaling;

    constructor(borderTypes: string[], furnitureTypes: string[], emptyType: string, meshDescriptorMap: Map<string, MeshDescriptor>, scaling?: Scaling) {
        this.borderTypes = borderTypes;
        this.furnitureTypes = furnitureTypes;
        this.emptyType = emptyType;
        this.meshDescriptorMap = meshDescriptorMap;
        this.scaling = scaling ? scaling : { x: 1, y: 2};
    }

    getFurnitureDimensions(type: string): FurnitureDimensionsDescriptor {
        return <FurnitureDimensionsDescriptor> this.meshDescriptorMap.get(type).realDimensions;
    }

    getRealBorderWidth(type: string): BorderDimensionsDescriptor {
        return  this.meshDescriptorMap.get(type) ? <BorderDimensionsDescriptor> this.meshDescriptorMap.get(type).realDimensions : null;
    }
}