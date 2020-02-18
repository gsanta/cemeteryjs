
import { IViewImporter } from '../../editor/controllers/windows/canvas/tools/IToolImporter';
import { Point } from '../../misc/geometry/shapes/Point';
import { Rectangle } from '../../misc/geometry/shapes/Rectangle';
import { ViewType } from '../views/View';
import { MeshView } from '../views/MeshView';
import { ViewGroupJson } from './ViewImporter';

export interface RectJson {
    _attributes: {
        "data-wg-x": string,
        "data-wg-y": string,
        "data-wg-type": string,
        "data-wg-name": string,
        "data-texture": string
        "data-is-manual-control": string;
    }
}

export interface RectangleGroupJson extends ViewGroupJson {
    g: RectJson[];
}

export class MeshViewImporter implements IViewImporter {
    type = ViewType.GameObject;
    private addGameObject: (rect: MeshView) => void;

    constructor(addGameObject: (gameObject: MeshView) => void) {
        this.addGameObject = addGameObject;
    }

    import(group: RectangleGroupJson): void {
        const pixelSize = 10;

        const rectJsons =  group.g.length ? <RectJson[]> group.g : [<RectJson> <unknown> group.g];

        rectJsons.forEach(rect => {
            const type = rect._attributes["data-wg-type"];
            const x = parseInt(rect._attributes["data-wg-x"], 10);
            const y = parseInt(rect._attributes["data-wg-y"], 10);
            const width = parseInt(rect._attributes["data-wg-width"], 10);
            const height = parseInt(rect._attributes["data-wg-height"], 10);
            const model = rect._attributes["data-model"];
            const texture = rect._attributes["data-texture"];
            const rotation = parseInt(rect._attributes["data-rotation"], 10);
            const scale = parseFloat(rect._attributes["data-wg-scale"]);
            const name = rect._attributes["data-wg-name"];
            const isManualControl = rect._attributes['data-is-manual-control'] === 'true' ? true : false;

            const rectangle = new Rectangle(new Point(x, y), new Point(x + width, y + height));

            const gameObject: MeshView = new MeshView(null, rectangle, name);
            gameObject.type = type;
            gameObject.rotation = rotation;
            gameObject.modelPath = model;
            gameObject.texturePath = texture;
            gameObject.scale = scale;
            gameObject.color = 'grey';
            gameObject.thumbnailPath = rect._attributes["data-thumbnail"];
            gameObject.path = rect._attributes["data-path"];
            gameObject.isManualControl = isManualControl;
            gameObject.activeAnimation = rect._attributes["data-animation"];

            this.addGameObject(gameObject);
        });
    }
}