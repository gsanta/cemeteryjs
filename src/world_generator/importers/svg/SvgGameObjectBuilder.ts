import { IGameObjectBuilder } from "../IGameObjectBuilder";
import { GameObject, WorldItemShape } from '../../services/GameObject';
import { Rect, ProcessedWorldMapJson, RawWorldMapJson } from './WorldMapJson';
import { WorldGeneratorFacade } from '../../WorldGeneratorFacade';
import { Rectangle } from "../../../model/geometry/shapes/Rectangle";
import { Point } from "../../../model/geometry/shapes/Point";
import { toRadian } from "../../../model/geometry/utils/Measurements";
import { Mesh } from "babylonjs";
import { RectangleImporter } from "../../../editor/controllers/canvases/svg/tools/rectangle/RectangleImporter";
import * as convert from 'xml-js';
import { ToolType } from "../../../editor/controllers/canvases/svg/tools/Tool";
import { getImporterByType } from "../../../editor/controllers/canvases/svg/tools/IToolImporter";
import { CanvasRect } from "../../../editor/controllers/canvases/svg/models/CanvasItem";

export class SvgGameObjectBuilder<T> implements IGameObjectBuilder {
    private services: WorldGeneratorFacade;

    constructor(services: WorldGeneratorFacade) {
        this.services = services;
    }

    build(worldMap: string): GameObject[] {
        this.services.canvasStore.clear();
        
        const rawJson: RawWorldMapJson = JSON.parse(convert.xml2json(worldMap, {compact: true, spaces: 4}));

        if (!rawJson.svg.g) {
            return [];
        }

        const toolGroups = rawJson.svg.g.length ? rawJson.svg.g : [rawJson.svg.g];

        toolGroups.forEach(toolGroup => {
            const toolType: ToolType = <ToolType> toolGroup._attributes["data-tool-type"];
            getImporterByType(toolType, this.services.importers).import(toolGroup)

        });

        if (this.services.canvasStore.items.length === 0) { return []; }

        const root = this.createRoot();

        const gameObjects = this.services.canvasStore.items.map(rect => this.createRect(rect));

        return [root, ...gameObjects];
    }

    private createRect(rect: CanvasRect): GameObject {
        return this.services.gameObjectFactory.create(
            {
                dimensions: rect.dimensions,
                name: rect.name,
                color: rect.color,
                shape: <WorldItemShape> rect.shape,
                modelPath: rect.model,
                rotation: toRadian(rect.rotation ? rect.rotation : 0),
                scale: rect.scale,
            }
        );
    }

    private createRoot() {
        const dim = new Rectangle(new Point(0, 0), new Point(3000, 3000));
        return this.services.gameObjectFactory.create(
            {
                dimensions: dim,
                name: 'root'
            }
        );
    }
}