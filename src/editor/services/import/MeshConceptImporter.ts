
import { IConceptImporter } from './IConceptImporter';
import { Point } from '../../../misc/geometry/shapes/Point';
import { Rectangle } from '../../../misc/geometry/shapes/Rectangle';
import { ConceptGroupJson } from './ImportService';
import { MeshConcept } from '../../views/canvas/models/concepts/MeshConcept';
import { ConceptType } from '../../views/canvas/models/concepts/Concept';

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

export interface RectangleGroupJson extends ConceptGroupJson {
    g: RectJson[];
}

export class MeshConceptImporter implements IConceptImporter {
    type = ConceptType.MeshConcept;
    private addGameObject: (rect: MeshConcept) => void;

    constructor(addGameObject: (gameObject: MeshConcept) => void) {
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

            const meshConcept: MeshConcept = new MeshConcept(null, rectangle, name);
            meshConcept.type = <ConceptType> type;
            meshConcept.rotation = rotation;
            meshConcept.modelPath = model;
            meshConcept.texturePath = texture;
            meshConcept.scale = scale;
            meshConcept.color = 'grey';
            meshConcept.thumbnailPath = rect._attributes["data-thumbnail"];
            meshConcept.path = rect._attributes["data-path"];
            meshConcept.isManualControl = isManualControl;
            meshConcept.activeAnimation = rect._attributes["data-animation"];

            this.addGameObject(meshConcept);
        });
    }
}