import * as convert from 'xml-js';
import { IViewImporter } from '../../views/canvas/tools/IToolImporter';
import { CanvasView } from '../../views/canvas/CanvasView';
import { Point } from '../../../misc/geometry/shapes/Point';
import { Stores } from '../../stores/Stores';
import { MeshViewImporter } from './RectangleImporter';
import { PathImporter } from './PathImporter';
import { Camera } from '../../views/canvas/models/Camera';
import { ServiceLocator } from '../ServiceLocator';
import { CanvasItemType } from '../../views/canvas/models/CanvasItem';

export interface WgDefinition {
    _attributes: WgDefinitionAttributes;
}

export interface WgDefinitionAttributes {
    color: string;
    "roles": string;
    "materials": string;
    model: string;
    scale: string;
    "translate-y": string;
    "type-name": string;
}

export interface RawWorldMapJson {
    svg: {
        metadata: {
            "wg-type": WgDefinition[]
        };

        _attributes: {
            "data-wg-width": string;
            "data-wg-height": string;
            "data-wg-pixel-size": string;
            "data-wg-scale-x": string;
            "data-wg-scale-y": string;
            "data-zoom": string;
            "data-viewbox": string;
        };

        g: ViewGroupJson[];
    }
}

export interface ViewGroupJson<T = any> {
    _attributes: {
        "data-view-type": string
    }
}

export class ImportService {
    serviceName = 'import-service';
    private viewImporters: IViewImporter[];
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        this.getServices = getServices;
        this.getStores = getStores;
        this.viewImporters = [
            new MeshViewImporter(rect => this.getStores().canvasStore.addConcept(rect)),
            new PathImporter(path => this.getStores().canvasStore.addConcept(path))
        ]
    }

    import(file: string): void {
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(file, {compact: true, spaces: 4}));
        const toolGroups: ViewGroupJson[] =  <ViewGroupJson[]> (rawJson.svg.g ? rawJson.svg.g.length ? rawJson.svg.g : [rawJson.svg.g] : []);

        toolGroups
        .forEach(toolGroup => {
            const viewType = <CanvasItemType> toolGroup._attributes["data-view-type"];
            this.findViewImporter(viewType).import(toolGroup)
        });

        this.applyGlobalSettings(rawJson);
        this.getStores().canvasStore.getMeshConcepts().filter(item => item.modelPath).forEach(item => this.getServices().meshDimensionService().setDimensions(item));
    }

    private applyGlobalSettings(rawJson: RawWorldMapJson) {
        this.getStores().viewStore.getViewById(CanvasView.id);
        // const camera = 
        if (rawJson.svg._attributes['data-translate']) {
            const topLeft = Point.fromString(rawJson.svg._attributes['data-translate']);
            const camera = <Camera> this.getStores().viewStore.getViewById(CanvasView.id).getCamera();
            camera.moveTo(topLeft);
        }        
        const zoom = rawJson.svg._attributes['data-zoom'] ? parseFloat(rawJson.svg._attributes['data-zoom']) : 1;
        const camera = <Camera> this.getStores().viewStore.getViewById(CanvasView.id).getCamera();
        camera.zoom(zoom);
    }

    private findViewImporter(viewType: CanvasItemType): IViewImporter {
        return this.viewImporters.find(view => view.type === viewType);
    }
}