import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { GameViewerPlugin } from "./GameViewerPlugin";
import { GameViewerComponent } from "./GameViewerComponent";
import * as React from 'react';

export class GameViewerPluginComponentFactory extends AbstractPluginComponentFactory<GameViewerPlugin> {
    renderSidePanelComponent() {
        return null;
    }

    renderMainComponent() {
        return <GameViewerComponent plugin={this.plugin} key={this.plugin.id}/>;
    }
}