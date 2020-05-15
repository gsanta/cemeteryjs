
import { Registry } from '../../Registry';
import { Point } from '../../geometry/shapes/Point';
import { Rectangle } from '../../geometry/shapes/Rectangle';
import { MeshView } from '../../models/views/MeshView';
import { IConceptImporter } from './IConceptImporter';
import { ConceptGroupJson } from './ImportService';
import { ConceptType } from '../../models/views/View';

export interface RectJson {
    _attributes: {
        "data-wg-x": string,
        "data-wg-y": string,
        "data-y-pos": string;
        "data-wg-type": string,
        "data-wg-name": string,
        "data-model-id": string;
        "data-is-manual-control": string;
        'data-animation-id': string;
    }
}

export interface RectangleGroupJson extends ConceptGroupJson {
    g: RectJson[];
}

export class MeshConceptImporter implements IConceptImporter {
    type = ConceptType.MeshConcept;
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: RectangleGroupJson): void {
        const rectJsons =  group.g.length ? <RectJson[]> group.g : [<RectJson> <unknown> group.g];

        rectJsons.forEach(rect => {
            const type = rect._attributes["data-wg-type"];
            const x = parseInt(rect._attributes["data-wg-x"], 10);
            const y = parseInt(rect._attributes["data-wg-y"], 10);
            const modelId = rect._attributes["data-model-id"];
            const width = parseInt(rect._attributes["data-wg-width"], 10);
            const height = parseInt(rect._attributes["data-wg-height"], 10);
            const rotation = parseFloat(rect._attributes["data-rotation"]);
            const scale = parseFloat(rect._attributes["data-wg-scale"]);
            const name = rect._attributes["data-wg-name"];
            const isManualControl = rect._attributes['data-is-manual-control'] === 'true' ? true : false;

            const rectangle = new Rectangle(new Point(x, y), new Point(x + width, y + height));

            const meshConcept: MeshView = new MeshView(rectangle, name);
            meshConcept.type = <ConceptType> type;
            meshConcept.rotation = rotation;
            meshConcept.modelId = modelId;
            meshConcept.scale = scale;
            meshConcept.yPos = parseFloat(rect._attributes["data-y-pos"]); 
            meshConcept.color = 'grey';
            meshConcept.thumbnailPath = rect._attributes["data-thumbnail"];
            meshConcept.path = rect._attributes["data-path"];
            meshConcept.isManualControl = isManualControl;
            meshConcept.animationId = rect._attributes['data-animation-id'];

            this.registry.stores.canvasStore.addConcept(meshConcept);
        });
    }
}