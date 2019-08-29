import { Scene, MeshBuilder } from 'babylonjs';
import * as sinon from 'sinon';
import { MaterialBuilder } from '../../src/integrations/babylonjs/MaterialFactory';
import { WorldItem } from '../../src/WorldItemInfo';
import { Shape } from '@nightshifts.inc/geometry';
import { TreeIteratorGenerator } from '../../src/utils/TreeIteratorGenerator';

type ModifierId = 'scale' | 'segmentBorders' | 'buildHierarchy' | 'assignBordersToRooms' | 'convertBorderPolyToLine' | 'thickenBorder';


export function setup(map: string, modifiers: []) {

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
