import * as React from 'react';
import styled from 'styled-components';
import { DialogComponent } from '../../../core/gui/dialogs/DialogComponent';
import { MeshView } from '../../../core/models/views/MeshView';
import { AbstractPluginComponent } from '../../common/AbstractPluginComponent';
import { ThumbnailMakerComponent } from '../../scene_editor/components/ThumbnailMakerComponent';
import { ThumbnailMakerService } from '../services/ThumbnailMakerService';
import { ButtonComponent } from '../../../core/gui/inputs/ButtonComponent';
import { MeshLoaderService } from '../../../core/services/MeshLoaderService';

const CanvasStyled = styled.canvas`
    width: 300px;
    height: 150px;
`

export class ImportDialogComponent extends AbstractPluginComponent {
    private canvasRef: React.RefObject<HTMLCanvasElement>;

    componentDidMount() {
        super.componentDidMount();
        this.props.plugin.componentMounted(this.ref.current);
        // TODO remove logic
        const selectedView = this.context.registry.stores.selectionStore.getConcept();
        const assetModel = (this.context.registry.stores.assetStore.getAssetById((selectedView as MeshView).modelId));
        this.props.plugin.pluginServices.byName<MeshLoaderService>(MeshLoaderService.serviceName).load(assetModel, '123');
     }
    
    render() {
        const footer = <ButtonComponent text="Done" type="info" onClick={() => this.createThumbnail()}/>
        return (
            <DialogComponent title={'Import model'} closeDialog={() => null} footer={footer}>
                <ThumbnailMakerComponent plugin={this.props.plugin} setRef={refObject => this.ref = (refObject as any)}/>
            </DialogComponent>
        );
    }

    private createThumbnail() {
        const selectedView = this.context.registry.stores.selectionStore.getConcept();
        const assetModel = (this.context.registry.stores.assetStore.getAssetById((selectedView as MeshView).modelId));
        this.props.plugin.pluginServices.byName<ThumbnailMakerService>(ThumbnailMakerService.serviceName).createThumbnail(assetModel)
    }
}