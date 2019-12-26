import { ScaleModifier } from './world_generator/modifiers/ScaleModifier';
import { BuildHierarchyModifier } from './world_generator/modifiers/BuildHierarchyModifier';
import { FakeCreateMeshModifier } from '../test/fakes/FakeCreateMeshModifier';

export {GameObject as WorldItem} from './world_generator/services/GameObject';
export {Converter} from './WorldGenerator';


export const transformators = {
    BuildHierarchyModifier,
    ScaleModifier,
    FakeCreateMeshModifier,
}