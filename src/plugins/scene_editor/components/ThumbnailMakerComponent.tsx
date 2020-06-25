import * as React from 'react';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { AssetLoaderDialogController, ImportSettingsProps } from '../../asset_loader/controllers/AssetLoaderDialogController';
import styled from 'styled-components';
import { WheelListener } from '../../../core/services/WheelListener';
import { AbstractPlugin } from '../../../core/AbstractPlugin';
import { AssetModel } from '../../../core/models/game_objects/AssetModel';
import { CloseIconComponent } from '../../common/toolbar/icons/CloseIconComponent';

const CustomThumbnailImageStyled = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: ${(props: {assetModel: AssetModel}) => `url(${props.assetModel.data}) no-repeat center center`};
    background-size: contain;
    background-color: white;

    .icon-close {
        position: absolute;
        right: 10px;
        top: 10px;
        background: white;

    }
`;

const CanvasStyled = styled.canvas`
    width: 300px;
    height: 300px;
`;

const OverlayStyled = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
`;

const ThumbnailMakerStyled = styled.div`
    position: relative;
`

export interface ThumbnailMakerProps {
    controller: AssetLoaderDialogController;
    setRef(ref: React.RefObject<HTMLDivElement>): void;
    plugin: AbstractPlugin;
}

export class ThumbnailMakerComponent extends React.Component<ThumbnailMakerProps> {
    static contextType = AppContext;
    context: AppContextType;
    private ref: React.RefObject<HTMLDivElement>;
    private wheelListener: WheelListener;

    constructor(props: ThumbnailMakerProps) {
        super(props);

        this.ref = React.createRef();
        this.props.setRef(this.ref);
    }
    
    componentDidMount() {
        this.wheelListener = new WheelListener(this.context.registry);
        this.ref.current && this.context.registry.services.hotkey.registerInput(this.ref.current);
        this.ref.current.focus();
    }

    render() {
        if (this.context.registry.services.dialog.activeDialog !== AssetLoaderDialogController.settingsName) { return null; }

        const controller = this.props.plugin.pluginSettings.byName<AssetLoaderDialogController>(AssetLoaderDialogController.settingsName);
        const thumbnailModel: AssetModel = controller.getVal(ImportSettingsProps.Thumbnail);

        let customThumbnailImg: JSX.Element = null;
        if (thumbnailModel && thumbnailModel.path) {
            customThumbnailImg = this.renderCustomImgIfDefined(thumbnailModel);
        }

        return (
            <ThumbnailMakerStyled
                id="thumbnail-maker"
            >
                <CanvasStyled ref={this.ref as any}/>
                <OverlayStyled
                    onMouseDown={(e) => this.context.registry.services.mouse.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.context.registry.services.mouse.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.context.registry.services.mouse.onMouseOut(e.nativeEvent)}
                    onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                    onKeyDown={e => this.context.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                    onKeyUp={e => this.context.registry.services.keyboard.onKeyUp(e.nativeEvent)}
                    onMouseOver={() => this.props.plugin.over()}
                    onMouseOut={() => this.props.plugin.out()}
                />
                {customThumbnailImg}
            </ThumbnailMakerStyled>
        );
    }

    
    private renderCustomImgIfDefined(thumbnailModel: AssetModel) {
        return (
            <CustomThumbnailImageStyled assetModel={thumbnailModel}>
                <CloseIconComponent onClick={() => this.props.controller.updateProp(undefined, ImportSettingsProps.Thumbnail)} />
            </CustomThumbnailImageStyled>
        );
    }
}