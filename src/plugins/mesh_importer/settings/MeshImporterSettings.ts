import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AbstractSettings } from "../../scene_editor/settings/AbstractSettings";
import { AssetModel } from '../../../core/models/game_objects/AssetModel';
import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { ThumbnailMakerService } from '../services/ThumbnailMakerService';

export enum ImportSettingsProps {

}

export class MeshImporterSettings extends AbstractSettings<ImportSettingsProps> {
    static settingsName = 'mesh-importer-settings';
    getName() { return MeshImporterSettings.settingsName; }
    assetModel: AssetModel;

    private registry: Registry;
    private plugin: AbstractPlugin;

    constructor(plugin: AbstractPlugin, registry: Registry) {
        super();
        this.plugin = plugin;
        this.registry = registry;
    }

    activate(assetModel: AssetModel) {
        this.assetModel = assetModel;
        this.registry.services.dialog.openDialog(MeshImporterSettings.settingsName);
        this.plugin.pluginServices.byName<ThumbnailMakerService>(ThumbnailMakerService.serviceName).loadSelectedMeshView();
    }

    close() {
        this.registry.services.history.createSnapshot();
        this.registry.services.dialog.close();
        this.registry.services.update.runImmediately(RenderTask.RenderFull);
    }

    protected getProp(prop: ImportSettingsProps) {
        switch (prop) {
        }
    }

    protected setProp(val: any, prop: ImportSettingsProps) {
        switch (prop) {
        }
        this.registry.services.update.runImmediately(RenderTask.RenderFocusedView);
    }
}