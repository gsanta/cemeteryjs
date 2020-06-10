import { Registry } from '../../../core/Registry';
import { RenderTask } from '../../../core/services/RenderServices';
import { AssetModel } from '../../../core/stores/AssetStore';
import { AbstractSettings } from "./AbstractSettings";

export enum ImportSettingsProps {

}

export class ImportSettings extends AbstractSettings<ImportSettingsProps> {
    static settingsName = 'import-settings';
    getName() { return ImportSettings.settingsName; }
    assetModel: AssetModel;

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
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