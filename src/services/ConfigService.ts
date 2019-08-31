import { MeshDescriptor } from "../integrations/api/Config";

export type Scaling = {
    x: number,
    y: number
}

export class ConfigService {
    borderTypes: string[];
    furnitureTypes: string[];
    meshDescriptorMap: Map<string, MeshDescriptor>;
    scaling: Scaling = { x: 1, y: 1};
}