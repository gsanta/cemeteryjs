import { IGameObjectBuilder } from "../IGameObjectBuilder";
import { GameObject, WorldItemShape } from '../../services/GameObject';
import { SvgPreprocessor } from "./SvgPreprocessor";
import { Rect, ProcessedWorldMapJson } from './WorldMapJson';
import { WorldGeneratorFacade } from '../../WorldGeneratorFacade';
import { Rectangle } from "../../../model/geometry/shapes/Rectangle";
import { Point } from "../../../model/geometry/shapes/Point";
import { toRadian } from "../../../model/geometry/utils/Measurements";
import { Mesh } from "babylonjs";

export class SvgGameObjectBuilder<T> implements IGameObjectBuilder {
    private svgPreprocessor: SvgPreprocessor;
    private services: WorldGeneratorFacade;

    constructor(services: WorldGeneratorFacade) {
        this.svgPreprocessor = new SvgPreprocessor();
        this.services = services;
    }

    build(worldMap: string): GameObject[] {
        const processedJson = this.svgPreprocessor.process(worldMap);

        if (processedJson.rects.length === 0) { return []; }

        const root = this.createRoot(processedJson);
        const gameObjects = processedJson.rects.map(rect => this.createRect(rect));

        return [root, ...gameObjects];
    }

    private createRect(rect: Rect): GameObject {
        return this.services.gameObjectFactory.create(
            {
                dimensions: new Rectangle(new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y + rect.height)),
                name: rect.type,
                color: rect.color,
                shape: <WorldItemShape> rect.shape,
                modelPath: rect.model,
                rotation: toRadian(rect.rotation ? rect.rotation : 0)
            }
        );
    }

    private createRoot(processedJson: ProcessedWorldMapJson) {
        const dim = new Rectangle(new Point(0, 0), new Point(processedJson.width, processedJson.height));
        return this.services.gameObjectFactory.create(
            {
                dimensions: dim,
                name: 'root'
            }
        );
    }
}