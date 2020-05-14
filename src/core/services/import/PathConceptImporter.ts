import { Registry } from "../../Registry";
import { PathConcept } from "../../models/concepts/PathConcept";
import { IConceptImporter } from "./IConceptImporter";
import { ConceptGroupJson } from "./ImportService";
import { ConceptType } from "../../models/concepts/Concept";
import { EditPoint } from "../../models/feedbacks/EditPoint";

export interface PathJson {
    circle: {
        _attributes: {
            cx: number;
            cy: number;
            r: number;
        }
    }[];

    path: {
        _attributes: {
            'data-name': string;
            'data-points': string;
            'data-parent-relations': string;
        }
    }
}

export interface PathGroupJson extends ConceptGroupJson {
    g: PathJson[] | PathJson;
}

export class PathConceptImporter implements IConceptImporter {
    type = ConceptType.PathConcept;
    private registry: Registry

    constructor(registry: Registry) {
        this.registry = registry;
    }

    import(group: PathGroupJson): void {
        const pathJsons =  (<PathJson[]> group.g).length ? <PathJson[]> group.g : [<PathJson> group.g];
        
        pathJsons.forEach(json => {
            const path = new PathConcept();
            path.id = json.path._attributes['data-name'];
            this.createEditPoints(json.path._attributes['data-points'], json.path._attributes['data-point-relations']);

            this.registry.stores.canvasStore.addConcept(path);
        });
    }

    private createEditPoints(path: PathConcept, pathJson: PathJson) {
        const editPointhis.deserializePoints(points);
        this.deserializeParentRelations(relations);
    }


    private deserializePoints(points: string): EditPoint {
        this.editPoints = points.split(' ')
            .map(p => {
                const [x, y] = p.split(':');
                const point = new EditPoint(new Point(parseFloat(x), parseFloat(y)), this);
                this.childMap.set(point, []);
                return point;
            });
        this.rootPoint = this.editPoints[0];
    }

    private deserializeParentRelations(relations: string) {
        relations.split(' ').forEach(relation => {
            const [index, parentIndex] = relation.split(':');
            parentIndex !== '-1' && this.childMap.get(this.editPoints[parentIndex]).push(this.editPoints[index]);
            this.parentMap.set(this.editPoints[index], this.editPoints[parentIndex]);
        })
    }
}