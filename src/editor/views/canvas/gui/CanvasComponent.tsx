import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../gui/Context';
import { colors } from '../../../gui/styles';
import { WindowToolbarStyled } from '../../../gui/windows/WindowToolbar';
import { PathMarkersComponent } from '../../../services/export/PathMarkersComponent';
import { CanvasView } from '../CanvasView';
import { CanvasToolbarComponent } from './CanvasToolbarComponent';
import { WheelListener } from '../../../services/WheelListener';
import { Concept } from '../models/concepts/Concept';
import { Feedback } from '../models/feedbacks/Feedback';


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

export class CanvasComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;
    private wheelListener: WheelListener;

    componentDidMount() {
        this.wheelListener = new WheelListener(() => this.context.getServices());
        this.context.getServices().updateService().setCanvasRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const hover = (item: Concept | Feedback) => this.context.getServices().mouseService().hover(item);
        const unhover = (canvasItem: Concept | Feedback) => this.context.getServices().mouseService().unhover(canvasItem);

        const view = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id);

        return (
            <EditorComponentStyled id={view.getId()}>
                <WindowToolbarStyled><CanvasToolbarComponent/></WindowToolbarStyled>
                <CanvasComponentStyled
                    tabIndex={0}
                    viewBox={view.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.context.getServices().mouseService().onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.context.getServices().mouseService().onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.context.getServices().mouseService().onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.context.getServices().mouseService().onMouseOut(e.nativeEvent)}
                    onKeyDown={e => this.context.getServices().keyboardService().onKeyDown(e.nativeEvent)}
                    onMouseOver={() => view.over()}
                    onMouseOut={() => view.out()}
                    onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {this.context.getServices().exportService().conceptExporters.map(exporter => exporter.export(hover, unhover))}
                    {this.renderFeedbacks()}
                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderFeedbacks(): JSX.Element {
        const feedback = this.context.getStores().feedback.rectSelectFeedback;

        if (feedback && feedback.isVisible) {
            const rect = this.context.getStores().feedback.rectSelectFeedback.rect;
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