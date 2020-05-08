import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../../editor/gui/styles';
import { AppContext, AppContextType } from '../../../editor/gui/Context';
import { WheelListener } from '../../../core/services/WheelListener';
import { ActionEditorView } from '../ActionEditorView';
import { Concept } from '../../../editor/models/concepts/Concept';
import { Feedback } from '../../../editor/models/feedbacks/Feedback';
import { useDrop } from 'react-dnd';
import { ActionType } from '../../../core/stores/ActionStore';

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

const DropLayerStyled = styled.div`
    width: 100%;
    height: 100%;
    background: transparent;
    pointer-events: ${(props: {isOver: boolean}) => props.isOver ? 'none' : 'auto'};
    position: absolute;
    top: 0;
    left: 0;
`;

export class ActionEditorComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;
    private wheelListener: WheelListener;

    componentDidMount() {
        this.wheelListener = new WheelListener(this.context.registry);
        this.context.registry.services.update.setCanvasRepainter(() => this.forceUpdate());
        this.context.registry.services.view.getViewById(ActionEditorView.id).repainter = () => {this.forceUpdate()};

        setTimeout(() => {
            this.context.registry.services.view.getViewById<ActionEditorView>(ActionEditorView.id).resize();
        }, 0);
    }

    render(): JSX.Element {
        const hover = (item: Concept | Feedback) => this.context.registry.services.mouse.hover(item);
        const unhover = (canvasItem: Concept | Feedback) => this.context.registry.services.mouse.unhover(canvasItem);
        
        const view = this.context.registry.services.view.getViewById<ActionEditorView>(ActionEditorView.id);

        const dropLayer = this.context.registry.services.tools.dragAndDrop ? <DropLayer/> : null;

        return (
            <EditorComponentStyled id={view.getId()} style={{cursor: view.getActiveTool().cursor}}>
                {dropLayer}
                <CanvasComponentStyled
                    tabIndex={0}
                    viewBox={view.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    // onMouseDown={(e) => this.context.registry.services.mouse.onMouseDown(e.nativeEvent)}
                    // onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e.nativeEvent)}
                    // onMouseUp={(e) => this.context.registry.services.mouse.onMouseUp(e.nativeEvent)}
                    // onMouseLeave={(e) => this.context.registry.services.mouse.onMouseOut(e.nativeEvent)}
                    // onKeyDown={e => this.context.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                    // onKeyUp={e => this.context.registry.services.keyboard.onKeyUp(e.nativeEvent)}
                    // onMouseOver={() => view.over()}
                    // onMouseOut={() => view.out()}
                    // onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                    onMouseUp={() => alert('onclick')}
                >
                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }
}

const DropLayer = () => {
	const [{ isOver }, drop] = useDrop({
		accept: [ActionType.Add],
		drop: () => alert('dropped'),
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
	})

    return  <DropLayerStyled ref={drop} className='drop-layer' isOver={isOver}/>
}