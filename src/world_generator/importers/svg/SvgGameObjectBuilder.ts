import { IGameObjectBuilder } from "../IGameObjectBuilder";
import { GameObject, WorldItemShape } from '../../services/GameObject';
import { SvgPreprocessor } from "./SvgPreprocessor";
import { Rect, ProcessedWorldMapJson } from './WorldMapJson';
import { WorldGeneratorServices } from '../../services/WorldGeneratorServices';
import { minBy, maxBy } from "../../utils/Functions";
import { GameObjectTemplate } from "../../services/GameObjectTemplate";
import { Rectangle } from "../../../model/geometry/shapes/Rectangle";
import { Point } from "../../../model/geometry/shapes/Point";
import { toRadian } from "../../../model/geometry/utils/Measurements";

export class SvgGameObjectBuilder implements IGameObjectBuilder {
    private svgPreprocessor: SvgPreprocessor;
    private services: WorldGeneratorServices;

    constructor(services: WorldGeneratorServices) {
        this.svgPreprocessor = new SvgPreprocessor();
        this.services = services;
    }

    build(worldMap: string): GameObject[] {
        const processedJson = this.svgPreprocessor.process(worldMap);

        if (processedJson.rects.length === 0) { return []; }

        const root = this.createRoot(processedJson);
        const gameObjects = processedJson.rects.map(rect => this.createRect(rect, processedJson));

        return [root, ...gameObjects];
    }

    private createRect(rect: Rect, processedJson: ProcessedWorldMapJson): GameObject {
        return this.services.gameObjectFactory.create(
            {
                type: null,
                dimensions: new Rectangle(new Point(rect.x, rect.y), new Point(rect.x + rect.width, rect.y + rect.height)),
                name: rect.type,
                isBorder: false,
                color: rect.color,
                shape: <WorldItemShape> rect.shape,
                modelPath: rect.model,
                roles: [],
                rotation: toRadian(rect.rotation ? rect.rotation : 0)
            },
            null
        );
    }

    private createRoot(processedJson: ProcessedWorldMapJson) {
        const dim = new Rectangle(new Point(0, 0), new Point(processedJson.width, processedJson.height));
        return this.services.gameObjectFactory.create(
            {
                type: GameObjectTemplate.getByTypeName('root', this.services.gameAssetStore.gameObjectTemplates).char,
                dimensions: dim,
                name: 'root',
                isBorder: false
            },
            GameObjectTemplate.getByTypeName('root', this.services.gameAssetStore.gameObjectTemplates)
        );
    }
}