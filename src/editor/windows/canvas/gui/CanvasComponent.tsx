import * as React from 'react';
import styled from 'styled-components';
import { CanvasToolbarComponent } from './CanvasToolbarComponent';
import { PathMarkersComponent } from './PathMarkersComponent';
import { colors } from '../../../gui/styles';
import { CanvasWindow } from '../CanvasWindow';
import { AppContext, AppContextType } from '../../../gui/Context';
import { ToolType } from '../tools/Tool';
import { CameraTool } from '../tools/CameraTool';
import { WindowToolbarStyled } from '../../../gui/windows/WindowToolbar';
import { ViewType } from '../models/views/View';


const EditorComponentStyled = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const CanvasComponentStyled = styled.svg`
    width: 100%;
    height: 100%;
    background: ${colors.panelBackgroundMedium};
`;

const SelectionComponentStyled = styled.rect`
    stroke: red;
    stroke-width: 1px;
    fill: transparent;
`;

export class CanvasComponent extends React.Component<{controller: CanvasWindow}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.getServices().updateService().setCanvasRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const cameraTool = this.props.controller.toolService.getTool(ToolType.CAMERA) as CameraTool;
        const services = this.context.getServices();
        const stores = this.context.getStores();

        return (
            <EditorComponentStyled id={this.props.controller.getId()}>
                <WindowToolbarStyled><CanvasToolbarComponent services={this.context.getServices()} window={this.props.controller as CanvasWindow}/></WindowToolbarStyled>
                <CanvasComponentStyled
                    tabIndex={0}
                    viewBox={stores.cameraStore.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.props.controller.mouseController.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.props.controller.mouseController.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.props.controller.mouseController.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.props.controller.mouseController.onMouseOut(e.nativeEvent)}
                    onKeyDown={e => this.props.controller.keyboardHandler.onKeyDown(e.nativeEvent)}
                    onKeyUp={e => this.props.controller.keyboardHandler.onKeyUp(e.nativeEvent)}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {this.props.controller.exporter.getViewExporter(ViewType.GameObject).export(false)}
                    {this.props.controller.exporter.getViewExporter(ViewType.Path).export(false)}
                    {this.renderFeedbacks()}


                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderFeedbacks(): JSX.Element {
        const feedback = this.props.controller.feedbackStore.rectSelectFeedback;

        if (feedback && feedback.isVisible) {
            const rect = this.props.controller.feedbackStore.rectSelectFeedback.rect;
            return (
                <SelectionComponentStyled 
                    x={rect.topLeft.x}
                    y={rect.topLeft.y}
                    width={rect.getWidth()}
                    height={rect.getHeight()}
                />
            );
        }

        return null;
    }
}