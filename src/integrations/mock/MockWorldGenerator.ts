import { WorldGenerator, Converter, FileFormat } from '../../WorldGenerator';
import { WorldItemDefinition, WorldItemRole } from '../../WorldItemDefinition';
import { MeshFactoryService } from '../../model/services/MeshFactoryService';
import { WorldItem } from '../../WorldItem';
import { MeshTemplate } from '../../MeshTemplate';
import { MeshTemplateService } from '../../model/services/MeshTemplateService';
import { Point } from '@nightshifts.inc/geometry';
import { setup } from '../../../test/model/testUtils';

export class MockMeshFactoryService implements MeshFactoryService<any, any> {
    getInstance(worldItemInfo: WorldItem, meshDescriptor: WorldItemDefinition, meshTemplate: MeshTemplate<any, any>): any {
        return null
    }
}

export class MockMeshTemplateService implements MeshTemplateService<any, any> {
    private templateMap: Map<string, WorldItemDefinition>;

    constructor(templateMap: Map<string, WorldItemDefinition>) {
        this.templateMap = templateMap;
    }

    hasTemplate(type: string): boolean {
        return this.templateMap.has(type) && !!this.templateMap.get(type).model;
    }

    getTemplate(type: string): MeshTemplate<any, any> {
        return null;
    }

    getTemplateDimensions(type: string): Point {
        const worldItemDefinition = this.templateMap.get(type);

        if (worldItemDefinition.realDimensions) {
            if (worldItemDefinition.roles.includes(WorldItemRole.BORDER)) {
                return new Point(worldItemDefinition.realDimensions.width, 0);
            } else {
                return new Point(worldItemDefinition.realDimensions.width, worldItemDefinition.realDimensions.height);
            }
        } else {
            return null;
        }
    }

    loadAll(meshDescriptors: WorldItemDefinition[]): Promise<unknown> {
        return Promise.resolve();
    }
}


export class MockWorldGenerator<T> implements WorldGenerator<T> {
    generate(worldMap: string, fileFormat: FileFormat, converter: Converter<T>) {
        const serviceFacade = setup(worldMap, FileFormat.TEXT);

        const worldItems = serviceFacade.importerService.import(worldMap);

        serviceFacade.converterService.convert(worldItems, converter);
    }
}