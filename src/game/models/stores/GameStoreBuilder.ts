import { GameFacade } from "../../GameFacade";
import { IViewConverter } from "../objects/IViewConverter";
import { ImportService } from "../../../editor/services/import/ImportService";
import { Concept } from "../../../editor/views/canvas/models/concepts/Concept";
import { Stores } from "../../../editor/stores/Stores";
import { ServiceLocator } from "../../../editor/services/ServiceLocator";

export class GameStoreBuilder {
    private gameFacade: GameFacade;
    private viewImporter: ImportService;
    private getStores: () => Stores;
    private getServices: () => ServiceLocator;

    constructor(gameFacade: GameFacade, getServices: () => ServiceLocator, getStores: () => Stores) {
        this.gameFacade = gameFacade;
        this.getStores = getStores;
        this.getServices = getServices;

        this.viewImporter = new ImportService(getServices, getStores);
    }

    build(file: string): void {
        this.viewImporter.import(file);

        this.getStores().canvasStore.getAllConcepts().forEach(view => this.getViewConverter(view)?.convert(view));
    }

    private getViewConverter(view: Concept): IViewConverter {
        return this.gameFacade.viewConverters.find(converter => converter.viewType === view.type);
    }
}