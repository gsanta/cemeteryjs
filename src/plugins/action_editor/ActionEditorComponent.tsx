import * as React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import { Point } from '../../core/geometry/shapes/Point';
import { colors } from '../../core/gui/styles';
import { Hoverable } from '../../core/models/Hoverable';
import { Registry } from '../../core/Registry';
import { WheelListener } from '../../core/services/WheelListener';
import { WindowToolbarStyled } from '../../core/WindowToolbar';
import { ToolbarComponent } from '../common/toolbar/ToolbarComponent';
import { ToolType } from '../common/tools/Tool';
import { ActionEditorPlugin } from './ActionEditorPlugin';
import { CanvasComponent } from '../common/CanvasComponent';
import { VisualConcept } from '../../core/models/concepts/VisualConcept';

const EditorComponentStyled = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    user-select: none;
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

export class ActionEditorComponent extends CanvasComponent {
    private wheelListener: WheelListener;

    componentDidMount() {
        super.componentDidMount();
        this.wheelListener = new WheelListener(this.context.registry);
        this.context.registry.services.update.setCanvasRepainter(() => this.forceUpdate());
        this.context.registry.services.layout.getViewById(ActionEditorPlugin.id).repainter = () => {this.forceUpdate()};

        setTimeout(() => {
            this.context.registry.services.layout.getViewById<ActionEditorPlugin>(ActionEditorPlugin.id).resize();
        }, 0);
    }

    render(): JSX.Element {
        const hover = (item: VisualConcept) => this.context.registry.services.mouse.hover(item);
        const unhover = (canvasItem: VisualConcept) => this.context.registry.services.mouse.unhover(canvasItem);
        
        const view = this.context.registry.services.layout.getViewById<ActionEditorPlugin>(ActionEditorPlugin.id);
        return (
            <EditorComponentStyled ref={this.ref} id={view.getId()} style={{cursor: view.getActiveTool().getCursor()}}>
                <WindowToolbarStyled>
                    <ToolbarComponent
                            tools={[ToolType.Select, ToolType.Delete, ToolType.Pan, ToolType.Zoom]}
                            view={view}
                    />
                </WindowToolbarStyled>
                <DropLayer 
                    isDragging={this.context.registry.tools.dragAndDrop.isDragging}
                    onDrop={(p, droppedItemType) => this.context.registry.services.mouse.onMouseUp({x: p.x, y: p.y, which: 1} as MouseEvent, droppedItemType)}
                    onMouseMove={(e) => this.context.registry.services.mouse.onMouseMove(e)}
                    onMouseOver={() => view.over()}
                    onMouseOut={() => view.out()}
                    registry={this.context.registry}
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
                    {this.renderFeedback()}
                    {this.renderFeedbacks()}
                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderFeedback(): JSX.Element {
        const joinTool = this.context.registry.tools.join;
        if (joinTool.start && joinTool.end) {
            return (
                <line 
                    x1={joinTool.start.x}
                    y1={joinTool.start.y}
                    x2={joinTool.end.x}
                    y2={joinTool.end.y}
                    stroke={colors.panelBackground}
                    strokeWidth="3"
                    strokeDasharray="12 3"
                    style={{pointerEvents: 'none'}}
                />
            );
        }
    }

    private renderFeedbacks(): JSX.Element {
        const feedback = this.context.registry.stores.feedback.rectSelectFeedback;

        if (feedback && feedback.isVisible) {
            const rect = this.context.registry.stores.feedback.rectSelectFeedback.rect;
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

interface DropLayerProps {
    onMouseOver: () => void;
    onMouseOut: () => void;
    onMouseMove: (e: MouseEvent) => void;
    onDrop: (point: Point, droppedItemType: string) => void;
    isDragging: boolean;
    registry: Registry;
}

const DropLayer = (props: DropLayerProps) => {
    const actionTypes = props.registry.stores.actionStore.actionTypes;
	const [{ isOver }, drop] = useDrop({
        accept: actionTypes,
        drop: (item, monitor) => props.onDrop(new Point(monitor.getClientOffset().x, monitor.getClientOffset().y), monitor.getItem().type), 
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