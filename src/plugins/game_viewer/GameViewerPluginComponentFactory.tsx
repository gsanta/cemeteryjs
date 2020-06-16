import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { GameViewerPlugin } from "./GameViewerPlugin";

export class GameViewerPluginComponentFactory extends AbstractPluginComponentFactory<GameViewerPlugin> {
    renderSidePanelSettingsWhenPluginActive() {
        return null;
    }

    renderSidePanelSettingsWhenPluginNotActive() {
        return null;
    }
}