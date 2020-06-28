import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import * as React from 'react';
import { ViewType } from "../../core/models/views/View";
import { AssetManagerPlugin } from './AssetManagerPlugin';
import { AssetLoaderSidepanelGui } from "./gui/AssetManagerSidepanelGui";
import { AssetManagerDialogGui } from "./gui/AssetManagerDialogGui";

export class AssetManagerPluginGuiFactory extends AbstractPluginComponentFactory<AssetManagerPlugin> {

    renderDialogComponent() {
        return <AssetManagerDialogGui/>
    }

    renderSidePanelComponent() {
        if (this.registry.stores.selectionStore.hasOne() && this.registry.stores.selectionStore.getOneByType(ViewType.MeshView)) {
            return <AssetLoaderSidepanelGui plugin={this.plugin}/>;
        }

        return null;
    }
}