import { ScaleModifier } from './model/modifiers/ScaleModifier';
import { AssignBordersToRoomsModifier } from './model/modifiers/AssignBordersToRoomsModifier';
import { SegmentBordersModifier } from './model/modifiers/SegmentBordersModifier';
import { BuildHierarchyModifier } from './model/modifiers/BuildHierarchyModifier';
import { ChangeBorderWidthModifier } from './model/modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from './model/modifiers/ChangeFurnitureSizeModifier';
import { FakeCreateMeshModifier } from '../test/fakes/FakeCreateMeshModifier';
import { SplitWallsIntoTwoParallelChildWallsModifier } from './model/modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { ThickenBordersModifier } from './model/modifiers/ThickenBordersModifier';

export {GameObject as WorldItem} from './model/types/GameObject';
export {WorldGenerator} from './WorldGenerator';
export {Converter} from './WorldGenerator';


export const transformators = {
    BuildHierarchyModifier,
    ScaleModifier,
    AssignBordersToRoomsModifier,
    SegmentBordersModifier,
    ChangeBorderWidthModifier,
    ChangeFurnitureSizeModifier,
    FakeCreateMeshModifier,
    SplitWallsIntoTwoParallelChildWallsModifier,
    ThickenBordersModifier
}