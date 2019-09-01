import { MeshDescriptor, FurnitureDimensionsDescriptor, BorderDimensionsDescriptor } from "../integrations/api/Config";

export type Scaling = {
    x: number,
    y: number
}

export class ConfigService {
    borderTypes: string[];
    furnitureTypes: string[];
    meshDescriptorMap: Map<string, MeshDescriptor>;
    scaling: Scaling;

    constructor(borderTypes: string[], furnitureTypes: string[], meshDescriptorMap: Map<string, MeshDescriptor>, scaling?: Scaling) {
        this.borderTypes = borderTypes;
        this.furnitureTypes = furnitureTypes;
        this.meshDescriptorMap = meshDescriptorMap;
        this.scaling = scaling ? scaling : { x: 1, y: 2};
    }

    getFurnitureDimensions(type: string): FurnitureDimensionsDescriptor {
        return <FurnitureDimensionsDescriptor> this.meshDescriptorMap.get(type).realDimensions;
    }
}