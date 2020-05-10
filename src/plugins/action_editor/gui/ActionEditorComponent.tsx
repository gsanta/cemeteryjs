import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../../../core/gui/styles';
import { WindowToolbarStyled } from '../../../editor/gui/windows/WindowToolbar';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { WheelListener } from '../../../core/services/WheelListener';
import { ActionEditorView } from '../ActionEditorView';
import { Concept } from '../../../editor/models/concepts/Concept';
import { Feedback } from '../../../editor/models/feedbacks/Feedback';
import { useDrop } from 'react-dnd';
import { ActionType } from '../../../core/stores/ActionStore';
import { Point } from '../../../misc/geometry/shapes/Point';
import { ActionEditorToolbarComponent } from './ActionEditorToolbarComponent';

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
    pointer-events: ${(props: {isDragging: boolean}) => props.isDragging ? 'auto' : 'none'};
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
        console.log('action editor render: ' + this.context.registry.services.tools.dragAndDrop.isDragging)
        const hover = (item: Concept | Feedback) => this.context.registry.services.mouse.hover(item);
        const unhover = (canvasItem: Concept | Feedback) => this.context.registry.services.mouse.unhover(canvasItem);
        
        const view = this.context.registry.services.view.getViewById<ActionEditorView>(ActionEditorView.id);

        // const dropLayer = ?  : null;

        return (
            <EditorComponentStyled id={view.getId()} style={{cursor: view.getActiveTool().cursor}}>
                <WindowToolbarStyled><ActionEditorToolbarComponent view={view}/></WindowToolbarStyled>
                <DropLayer 
                    isDragging={this.context.registry.services.tools.dragAndDrop.isDragging}
                    onDrop={p => this.context.registry.services.mouse.onMouseUp({x: p.x, y: p.y, which: 1} as MouseEvent)}
                    onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e)}
                    onMouseOver={() => view.over()}
                    onMouseOut={() => view.out()}
                />
                <CanvasComponentStyled
                    tabIndex={0}
                    viewBox={view.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.context.registry.services.mouse.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.context.registry.services.mouse.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.context.registry.services.mouse.onMouseOut(e.nativeEvent)}
                    onKeyDown={e => this.context.registry.services.keyboard.onKeyDown(e.nativeEvent)}
                    onKeyUp={e => this.context.registry.services.keyboard.onKeyUp(e.nativeEvent)}
                    onMouseOver={() => view.over()}
                    onMouseOut={() => view.out()}
                    onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                >
                    {this.context.registry.services.export.actionConceptExporter.export(hover, unhover)}
                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }
}

interface DropLayerProps {
    onMouseOver: () => void;
    onMouseOut: () => void;
    onMouseMove: (e: MouseEvent) => void;
    onDrop: (point: Point) => void;
    isDragging: boolean;
}

const DropLayer = (props: DropLayerProps) => {
	const [{ isOver }, drop] = useDrop({
        accept: [ActionType.Add],
        drop: (item, monitor) => props.onDrop(new Point(monitor.getClientOffset().x, monitor.getClientOffset().y)), 
		collect: monitor => ({
			isOver: !!monitor.isOver(),
		}),
	})

    return  (
        <DropLayerStyled
            onMouseMove={(e) => props.onMouseMove(e.nativeEvent)}
            onMouseOver={() => props.onMouseOver()}
            onMouseOut={() => props.onMouseOut()}
            ref={drop}
            className='drop-layer'
            isDragging={props.isDragging}
        />
    );
}