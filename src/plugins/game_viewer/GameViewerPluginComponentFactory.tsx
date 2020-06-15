import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { GameViewerPlugin } from "./GameViewerPlugin";

export class GameViewerPluginComponentFactory extends AbstractPluginComponentFactory<GameViewerPlugin> {
    renderSidePanelSettings() {
        return null;
    }
}