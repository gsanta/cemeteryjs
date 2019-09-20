import { ScaleModifier } from './model/modifiers/ScaleModifier';
import { AssignBordersToRoomsModifier } from './model/modifiers/AssignBordersToRoomsModifier';
import { SegmentBordersModifier } from './model/modifiers/SegmentBordersModifier';
import { BuildHierarchyModifier } from './model/modifiers/BuildHierarchyModifier';
import { ConvertBorderPolyToLineModifier } from './model/modifiers/ConvertBorderPolyToLineModifier';
import { ChangeBorderWidthModifier } from './model/modifiers/ChangeBorderWidthModifier';
import { ChangeFurnitureSizeModifier } from './model/modifiers/ChangeFurnitureSizeModifier';
import { CreateMeshModifier } from './model/modifiers/CreateMeshModifier';
import { CreateMockMeshModifier } from './model/modifiers/CreateMockMeshModifier';
import { SplitWallsIntoTwoParallelChildWallsModifier } from './model/modifiers/SplitWallsIntoTwoParallelChildWallsModifier';
import { ThickenBordersModifier } from './model/modifiers/ThickenBordersModifier';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { App } from './gui/App';

export {WorldItem} from './WorldItem';
export {BabylonjsDemo} from './integrations/babylonjs/demo/BabylonjsDemo';
export {WorldGenerator} from './WorldGenerator';
export {BabylonWorldGenerator} from './integrations/babylonjs/BabylonWorldGenerator';
export {MockWorldGenerator} from './integrations/mock/MockWorldGenerator';
export {WorldConfig} from './model/services/ImporterService';
export {MeshDescriptor} from './Config';
export {FileDescriptor} from './Config';
export {ParentRoomBasedMaterialDescriptor} from './Config';
export {ShapeDescriptor} from './Config';
export {RoomDescriptor} from './Config';
export {DetailsDescriptor} from './Config';
export {BorderDimensionsDescriptor} from './Config';
export {FurnitureDimensionsDescriptor} from './Config';
export {Converter} from './WorldGenerator';


export const transformators = {
    BuildHierarchyModifier,
    ScaleModifier,
    AssignBordersToRoomsModifier,
    SegmentBordersModifier,
    ConvertBorderPolyToLineModifier,
    ChangeBorderWidthModifier,
    ChangeFurnitureSizeModifier,
    CreateMeshModifier,
    CreateMockMeshModifier,
    SplitWallsIntoTwoParallelChildWallsModifier,
    ThickenBordersModifier
}

export function renderApp(element: HTMLDivElement) {
    ReactDOM.render(
        React.createElement(App, null),
        element
    );
}