import { GameFacade } from "../../GameFacade";
import { IViewConverter } from "../objects/IViewConverter";
import { ImportService } from "../../../editor/services/import/ImportService";
import { MeshViewImporter } from "../../../editor/services/import/RectangleImporter";
import { PathImporter } from "../../../editor/services/import/PathImporter";
import { View } from "../../../editor/windows/canvas/models/views/View";
import { ViewStore } from "../../../editor/stores/ViewStore";
import { Stores } from "../../../editor/stores/Stores";

export class GameStoreBuilder {
    private gameFacade: GameFacade;
    private viewImporter: ImportService;
    private getStores: () => Stores;

    constructor(gameFacade: GameFacade, getStores: () => Stores) {
        this.gameFacade = gameFacade;
        this.getStores = getStores;

        this.viewImporter = new ImportService(getStores);
    }

    build(file: string): void {
        this.viewImporter.import(file);

        this.getStores().viewStore.getViews().forEach(view => this.getViewConverter(view)?.convert(view));
    }

    private getViewConverter(view: View): IViewConverter {
        return this.gameFacade.viewConverters.find(converter => converter.viewType === view.viewType);
    }
}