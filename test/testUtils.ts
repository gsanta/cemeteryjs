import { Scene, MeshBuilder } from 'babylonjs';
import * as sinon from 'sinon';
import { MaterialFactory } from '../src/integrations/babylonjs/MaterialFactory';
import { WorldItemInfo } from '../src/WorldItemInfo';
import { Shape } from '@nightshifts.inc/geometry';
import { TreeIteratorGenerator } from '../src/utils/TreeIteratorGenerator';

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
}

export function createMaterialBuilder(): [typeof MaterialFactory, typeof MaterialBuilderStubs] {
    const CreateMaterial = sinon.stub();

    CreateMaterial.returns({
        name: 'material'
    });
    return [
        <typeof MaterialFactory> {
            CreateMaterial: (<any> CreateMaterial)
        },
        <typeof MaterialBuilderStubs> {
            CreateMaterial
        }
    ]
}

export function findWorldItemWithDimensions(worldItems: WorldItemInfo[], dimensions: Shape): WorldItemInfo {

    for (let i = 0; i < worldItems.length; i++) {
        for (const item of TreeIteratorGenerator<WorldItemInfo>(worldItems[i])) {
            if (item.dimensions.equalTo(dimensions)) {
                return item;
            }
        }
    }
}