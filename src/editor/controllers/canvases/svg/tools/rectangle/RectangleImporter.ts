
import { Point } from '../../../../../../model/geometry/shapes/Point';
import { Rectangle } from '../../../../../../model/geometry/shapes/Rectangle';
import { ToolGroupJson } from '../../../../../../world_generator/importers/svg/WorldMapJson';
import { WorldItemShape, GameObject } from '../../../../../../world_generator/services/GameObject';
import { IToolImporter } from '../IToolImporter';
import { ToolType } from '../Tool';

export interface RectJson {
    _attributes: {
        "data-wg-x": string,
        "data-wg-y": string,
        "data-wg-type": string,
        "data-wg-name": string,
        "data-texture": string
    }
}

export interface RectangleGroupJson extends ToolGroupJson {
    rect: RectJson[];
}

export class RectangleImporter implements IToolImporter {
    type = ToolType.RECTANGLE;
    private addGameObject: (rect: GameObject) => void;

    constructor(addGameObject: (gameObject: GameObject) => void) {
        this.addGameObject = addGameObject;
    }

    import(group: RectangleGroupJson): void {
        const pixelSize = 10;

        const rectJsons =  group.rect.length ? <RectJson[]> group.rect : [<RectJson> <unknown> group.rect];

        rectJsons.forEach(rect => {
            const type = rect._attributes["data-wg-type"];
            const x = parseInt(rect._attributes["data-wg-x"], 10) / pixelSize;
            const y = parseInt(rect._attributes["data-wg-y"], 10) / pixelSize;
            const width = parseInt(rect._attributes["data-wg-width"], 10) / pixelSize;
            const height = parseInt(rect._attributes["data-wg-height"], 10) / pixelSize;
            const model = rect._attributes["data-model"];
            const texture = rect._attributes["data-texture"];
            const rotation = parseInt(rect._attributes["data-rotation"], 10);
            const scale = parseFloat(rect._attributes["data-wg-scale"]);
            const name = rect._attributes["data-wg-name"];

            const rectangle = new Rectangle(new Point(x, y), new Point(x + width, y + height));

            const gameObject: GameObject = new GameObject(null, rectangle, name);
            gameObject.type = type;
            gameObject.rotation = rotation;
            gameObject.modelPath = model;
            gameObject.texturePath = texture;
            gameObject.scale = scale;
            gameObject.color = 'grey';
            gameObject.thumbnailPath = rect._attributes["data-thumbnail"];

            this.addGameObject(gameObject);
        });
    }
}