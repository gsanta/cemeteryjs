import { ViewStore } from "../../../editor/controllers/canvases/svg/models/ViewStore";
import { GameStore } from "./GameStore";
import { GameFacade } from "../../GameFacade";
import { IViewConverter } from "../objects/IViewConverter";
import { View } from "../../../model/View";

export class GameStoreBuilder {
    private gameFacade: GameFacade;

    constructor(gameFacade: GameFacade) {
        this.gameFacade = gameFacade;
    }

    build(viewStore: ViewStore): GameStore {
        const gameStore = new GameStore();

        viewStore.getViews().forEach(view => {
            const gameOject = this.getViewConverter(view)?.convert(view);
            gameOject && gameStore.add(gameOject);
        });

        return null;
    }

    private getViewConverter(view: View): IViewConverter {
        return this.gameFacade.viewConverters.find(converter => converter.viewType === view.viewType);
    }
}