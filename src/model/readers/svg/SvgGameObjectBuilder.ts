import { IGameObjectBuilder } from "../IGameObjectBuilder";
import { GameObject, WorldItemShape } from '../../types/GameObject';
import { SvgPreprocessor } from "./SvgPreprocessor";
import { Rect, ProcessedWorldMapJson } from './WorldMapJson';
import { Point, Rectangle } from "@nightshifts.inc/geometry";
import { WorldGeneratorServices } from '../../services/WorldGeneratorServices';
import { minBy, maxBy } from "../../utils/Functions";
import { GameObjectTemplate } from "../../types/GameObjectTemplate";

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

        this.removeFrame(processedJson);

        const root = this.createRoot(processedJson);
        const worldItems = processedJson.rects.map(rect => this.createRect(rect, processedJson));

        return [root, ...worldItems];
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
                roles: []
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

    private removeFrame(processedJson: ProcessedWorldMapJson) {
        const topLeftPoint = this.getTopLeftPoint(processedJson);
        const bottomRightPoint = this.getBottomRightPoint(processedJson);

        processedJson.width = bottomRightPoint.x - topLeftPoint.x;
        processedJson.height = bottomRightPoint.y - topLeftPoint.y;

        processedJson.rects.forEach(rect => {
            rect.x -= topLeftPoint.x;
            rect.y -= topLeftPoint.y;
        });
    }

    private getTopLeftPoint(processedJson: ProcessedWorldMapJson) {
        const minX = minBy<Rect>(processedJson.rects, (rect1, rect2) => rect1.x - rect2.x).x;
        const minY = minBy<Rect>(processedJson.rects, (rect1, rect2) => rect1.y - rect2.y).y;

        return new Point(minX, minY);
    }

    private getBottomRightPoint(processedJson: ProcessedWorldMapJson) {
        const maxX = maxBy<Rect>(processedJson.rects, (rect1, rect2) => (rect1.x + rect1.width) - (rect2.x + rect2.width));
        const maxY = maxBy<Rect>(processedJson.rects, (rect1, rect2) => (rect1.y + rect1.height) - (rect2.y + rect2.height));

        return new Point(maxX.x + maxX.width, maxY.y + maxY.height);
    }
}