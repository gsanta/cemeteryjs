import { Registry } from '../../core/Registry';
import { AbstractController } from '../scene_editor/settings/AbstractController';


export enum LayoutSettingsProps {
    AllLayouts = 'AllLayouts',
    SelectedLayout = 'SelectedLayout'
}

export class LayoutSettingsController extends AbstractController<LayoutSettingsProps> {
    constructor(registry: Registry) {
        super(registry);
    }
}