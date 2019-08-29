import { Scene, MeshBuilder } from 'babylonjs';
import * as sinon from 'sinon';
import { MaterialBuilder } from '../../src/integrations/babylonjs/MaterialFactory';
import { WorldItem } from '../../src/WorldItemInfo';
import { Shape } from '@nightshifts.inc/geometry';
import { TreeIteratorGenerator } from '../../src/utils/TreeIteratorGenerator';
import { ScaleModifier } from '../../src/modifiers/ScaleModifier';
import { SegmentBordersModifier } from '../../src/modifiers/SegmentBordersModifier';
import { BuildHierarchyModifier } from '../../src/modifiers/BuildHierarchyModifier';
import { AssignBordersToRoomsModifier } from '../../src/modifiers/AssignBordersToRoomsModifier';
import { ConvertBorderPolyToLineModifier } from '../../src/modifiers/ConvertBorderPolyToLineModifier';
import { ChangeBorderWidthModifier } from '../../src/modifiers/ChangeBorderWidthModifier';
import { WorldItemFactory } from '../../src/WorldItemInfoFactory';
import { ModifierFacade } from '../../src/modifiers/ModifierFacade';

type ModifierId = 'scale' | 'segmentBorders' | 'buildHierarchy' | 'assignBordersToRooms' | 'convertBorderPolyToLine' | 'thickenBorder';


export function setup(map: string) {
    const worldItemFactory = new WorldItemFactory();

    const modifiers = [
        new ScaleModifier(),
        new SegmentBordersModifier(worldItemFactory, ['wall', 'door']),
        new BuildHierarchyModifier(),
        new AssignBordersToRoomsModifier(['wall', 'door']),
        new ConvertBorderPolyToLineModifier(),
        new ChangeBorderWidthModifier([{name: 'door', width: 2}])
    ];

    const modifierFacade = new ModifierFacade(modifiers);

    
}

export function createScene(): Scene {
    return <Scene> {

    };
}

export abstract class MeshBuilderStubs {
    static CreateDisc: sinon.SinonStub;
}

export function createMeshBuilder(): [typeof MeshBuilder, typeof MeshBuilderStubs] {
    const CreateDisc = sinon.stub();

    CreateDisc.returns({
        name: 'Disc',
        translate: sinon.stub()
    });
    return [
        <typeof MeshBuilder> {
            CreateDisc: (<any> CreateDisc)
        },
        <typeof MeshBuilderStubs> {
            CreateDisc
        }
    ];
}

export abstract class MaterialBuilderStubs {
    static CreateMaterial: sinon.SinonStub;
    static CreateTexture: sinon.SinonStub;
}

export function createMaterialBuilder(): [typeof MaterialBuilder, typeof MaterialBuilderStubs] {
    const CreateMaterial = sinon.stub();

    CreateMaterial.callsFake((name: string) => {
        return {
            name
        }
    });

    const CreateTexture = sinon.stub();

    CreateTexture.callsFake((url: string) => {
        return {
            url
        }
    });

    return [
        <typeof MaterialBuilder> {
            CreateMaterial: (<any> CreateMaterial),
            CreateTexture: (<any> CreateTexture)
        },
        <typeof MaterialBuilderStubs> {
            CreateMaterial,
            CreateTexture
        }
    ]
}

export function findWorldItemWithDimensions(worldItems: WorldItem[], dimensions: Shape): WorldItem {

    for (let i = 0; i < worldItems.length; i++) {
        for (const item of TreeIteratorGenerator<WorldItem>(worldItems[i])) {
            if (item.dimensions.equalTo(dimensions)) {
                return item;
            }
        }
    }
}
