import { ViewStore } from "../../../editor/canvas/models/ViewStore";
import { GameFacade } from "../../GameFacade";
import { IViewConverter } from "../objects/IViewConverter";
import { View } from "../../../editor/canvas/models/views/View";
import { ViewImporter } from "../../../editor/canvas/io/import/ViewImporter";
import { MeshViewImporter } from "../../../editor/canvas/io/import/RectangleImporter";
import { PathImporter } from "../../../editor/canvas/io/import/PathImporter";

export class GameStoreBuilder {
    private gameFacade: GameFacade;
    private viewStore: ViewStore;
    private viewImporter: ViewImporter;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;

        this.viewImporter = new ViewImporter(
            [
                new MeshViewImporter(rect => this.viewStore.addRect(rect)),
                new PathImporter(path => this.viewStore.addPath(path))
            ]
        );
    }

    build(file: string): void {
        this.viewStore = new ViewStore();

        this.viewImporter.import(file);

        this.viewStore.getViews().forEach(view => this.getViewConverter(view)?.convert(view));
    }

    private getViewConverter(view: View): IViewConverter {
        return this.gameFacade.viewConverters.find(converter => converter.viewType === view.viewType);
    }
}