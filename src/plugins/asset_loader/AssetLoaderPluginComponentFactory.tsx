import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { AssetLoaderPlugin } from "./AssetLoaderPlugin";
import * as React from 'react';
import { ViewType } from "../../core/models/views/View";
import { AssetLoaderSidepanelWidget } from './components/AssetLoaderSidepanelWidget';

export class AssetLoaderPluginComponentFactory extends AbstractPluginComponentFactory<AssetLoaderPlugin> {
    renderSidePanelComponent() {
        if (this.registry.stores.selectionStore.hasOne() && this.registry.stores.selectionStore.getOneByType(ViewType.MeshView)) {
            return <AssetLoaderSidepanelWidget plugin={this.plugin}/>;
        }

        return null;
    }
}