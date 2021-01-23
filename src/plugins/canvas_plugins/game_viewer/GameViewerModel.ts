import { Registry } from "../../../core/Registry";


export class GameViewerModel {
    showBoundingBoxes: boolean = false;

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
}