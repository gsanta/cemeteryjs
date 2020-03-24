import { Concept } from "../views/canvas/models/concepts/Concept";
import { Feedback } from "../views/canvas/models/feedbacks/Feedback";
import { Naming } from "./ConceptStore";
import { without } from "../../misc/geometry/utils/Functions";
import { CanvasItemType } from "../views/canvas/models/CanvasItem";
import { MeshConcept } from "../views/canvas/models/concepts/MeshConcept";
import { PathConcept } from "../views/canvas/models/concepts/PathConcept";


export class CanvasStore {
    concepts: Concept[] = [];
    feedbacks: Feedback[] = [];

    private naming: Naming;

    addConcept(concept: Concept) {
        this.concepts.push(concept);
    }

    addFeedback(feedback: Feedback) {
        this.feedbacks.push(feedback);
    }

    removeConcept(concept: Concept) {
        this.concepts = without(this.concepts, concept);
    }

    clear(): void {
        this.concepts = [];
        this.feedbacks = [];
    }

    getAllConcepts(): Concept[] {
        return this.concepts;
    }

    getConceptsByType(type: CanvasItemType): Concept[] {
        return this.concepts.filter(v => v.type === type);
    }

    getMeshConcepts(): MeshConcept[] {
        return <MeshConcept[]> this.concepts.filter(view => view.type === CanvasItemType.MeshConcept);
    }

    getPathConcepts(): PathConcept[] {
        return <PathConcept[]> this.concepts.filter(view => view.type === CanvasItemType.PathConcept);
    }
}