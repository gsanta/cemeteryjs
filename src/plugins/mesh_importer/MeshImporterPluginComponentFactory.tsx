import { AbstractPluginComponentFactory } from "../common/AbstractPluginComponentFactory";
import { MeshImporterPlugin } from "./MeshImporterPlugin";
import { MeshImporterSidepanelComponent } from './MeshImporterSidepanelComponent';
import * as React from 'react';
import { ViewType } from "../../core/models/views/View";

export class MeshImporterPluginComponentFactory extends AbstractPluginComponentFactory<MeshImporterPlugin> {
    renderSidePanelComponent() {
        if (this.registry.stores.selectionStore.hasOne() && this.registry.stores.selectionStore.getOneByType(ViewType.MeshView)) {
            return <MeshImporterSidepanelComponent plugin={this.plugin}/>;
        }

        return null;
    }
}