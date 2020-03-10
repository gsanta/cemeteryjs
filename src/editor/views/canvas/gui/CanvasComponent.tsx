import * as React from 'react';
import styled from 'styled-components';
import { CanvasToolbarComponent } from './CanvasToolbarComponent';
import { PathMarkersComponent } from './PathMarkersComponent';
import { colors } from '../../../gui/styles';
import { CanvasView } from '../CanvasView';
import { AppContext, AppContextType } from '../../../gui/Context';
import { WindowToolbarStyled } from '../../../gui/windows/WindowToolbar';
import { ConceptType, Concept } from '../models/concepts/Concept';


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

export class CanvasComponent extends React.Component<{controller: CanvasView}> {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.getServices().updateService().setCanvasRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const stores = this.context.getStores();

        const hover = (view: Concept) => this.context.getServices().mouseService().hover(view);
        const unhover = (view: Concept) => this.context.getServices().mouseService().unhover(view);

        return (
            <EditorComponentStyled id={this.props.controller.getId()}>
                <WindowToolbarStyled><CanvasToolbarComponent window={this.props.controller as CanvasView}/></WindowToolbarStyled>
                <CanvasComponentStyled
                    tabIndex={0}
                    viewBox={this.props.controller.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.context.getServices().mouseService().onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.context.getServices().mouseService().onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.context.getServices().mouseService().onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.context.getServices().mouseService().onMouseOut(e.nativeEvent)}
                    onKeyDown={e => this.context.getServices().keyboardService().onKeyDown(e.nativeEvent)}
                    onKeyUp={e => this.context.getServices().keyboardService().onKeyUp(e.nativeEvent)}
                    onMouseOver={() => this.props.controller.over()}
                    onMouseOut={() => this.props.controller.out()}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {this.props.controller.exporter.getAllViewExporter().map(exporter => exporter.export(hover, unhover))}
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