import { AbstractController } from '../../core/controllers/AbstractController';
import { UI_Plugin } from '../../core/UI_Plugin';
import { Registry } from '../../core/Registry';

export enum ThumbnailMakerControllerProps {
    ThumbnailFromModel = 'ThumbnailFromModel',
    ThumbnailFromFile = 'ThumbnailFromFile'
}

export const ThumbnailMakerControllerId = 'thumbnail_maker_controller_id';

export class ThumbnailMakerController extends AbstractController<ThumbnailMakerControllerProps> {
    id = ThumbnailMakerControllerId;

    constructor(plugin: UI_Plugin, registry: Registry) {
        super(plugin, registry);

        this.createPropHandler(ThumbnailMakerControllerProps.ThumbnailFromModel)
            .onClick(() => {

            });
    }
}