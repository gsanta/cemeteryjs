import { Registry } from "../../core/Registry";
import { AbstractSettings } from "../scene_editor/settings/AbstractSettings";
import { AssetManagerPlugin } from "./AssetManagerPlugin";
import { RenderTask } from "../../core/services/RenderServices";

export enum ImportSettingsProps {
    CreateThumbnailFromModel = 'CreateThumbnailFromModel',
    Thumbnail = 'Thumbnail',
    Model = 'Model',
}

export class AssetManagerDialogController extends AbstractSettings<ImportSettingsProps> {
    static settingsName = 'asset-manager-dialog-controller';
    getName() { return AssetManagerDialogController.settingsName; }

    private registry: Registry;
    private plugin: AssetManagerPlugin;

    constructor(plugin: AssetManagerPlugin, registry: Registry) {
        super();
        this.plugin = plugin;
        this.registry = registry;
    }

    open() {
        this.registry.services.dialog.openDialog(this);
    }

    close() {
        this.registry.services.dialog.close();
        this.registry.services.update.runImmediately(RenderTask.RenderFull);
    }

    protected getProp(prop: ImportSettingsProps) {
        switch (prop) {

        }
    }

    protected async setProp(val: any, prop: ImportSettingsProps) {

    }

    private update() {
        this.registry.services.history.createSnapshot();
        this.registry.services.update.runImmediately(RenderTask.RenderFull);
    }
}