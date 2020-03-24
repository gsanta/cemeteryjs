import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../gui/Context';
import { colors } from '../../../gui/styles';
import { WindowToolbarStyled } from '../../../gui/windows/WindowToolbar';
import { PathMarkersComponent } from '../../../services/export/PathMarkersComponent';
import { CanvasView } from '../CanvasView';
import { Concept, Subconcept } from '../models/concepts/Concept';
import { CanvasToolbarComponent } from './CanvasToolbarComponent';
import { CanvasItem } from '../models/CanvasItem';


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

    componentDidMount() {
        this.context.getServices().updateService().setCanvasRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const hover = (canvasItem: CanvasItem) => this.context.getServices().mouseService().hover(canvasItem);
        const unhover = (canvasItem: CanvasItem) => this.context.getServices().mouseService().unhover(canvasItem);

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
                    onKeyUp={e => this.context.getServices().keyboardService().onKeyUp(e.nativeEvent)}
                    onMouseOver={() => view.over()}
                    onMouseOut={() => view.out()}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {view.exporter.getAllViewExporter().map(exporter => exporter.export(hover, unhover))}
                    {this.renderFeedbacks()}
                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderFeedbacks(): JSX.Element {
        const view = this.context.getStores().viewStore.getViewById<CanvasView>(CanvasView.id);

        const feedback = view.feedbackStore.rectSelectFeedback;

        if (feedback && feedback.isVisible) {
            const rect = view.feedbackStore.rectSelectFeedback.rect;
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