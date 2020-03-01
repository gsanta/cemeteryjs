import { GameFacade } from "../../GameFacade";
import { IViewConverter } from "../objects/IViewConverter";
import { CanvasImporter } from "../../../editor/windows/canvas/io/import/CanvasImporter";
import { MeshViewImporter } from "../../../editor/windows/canvas/io/import/RectangleImporter";
import { PathImporter } from "../../../editor/windows/canvas/io/import/PathImporter";
import { View } from "../../../editor/windows/canvas/models/views/View";
import { ViewStore } from "../../../editor/windows/canvas/models/ViewStore";

export class GameStoreBuilder {
    private gameFacade: GameFacade;
    private viewStore: ViewStore;
    private viewImporter: CanvasImporter;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;

        this.viewImporter = new CanvasImporter(
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