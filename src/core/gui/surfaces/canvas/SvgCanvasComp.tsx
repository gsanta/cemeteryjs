import * as React from 'react';
import styled from 'styled-components';
import { PathViewContainerComponent } from '../../../../plugins/scene_editor/components/PathViewComponent';
import { SceneEditorPlugin, SceneEditorPluginId } from '../../../../plugins/scene_editor/SceneEditorPlugin';
import { AbstractPlugin } from '../../../AbstractPlugin';
import { UI_SvgCanvas } from '../../../gui_builder/elements/UI_SvgCanvas';
import { View } from '../../../models/views/View';
import { PathMarkersComponent } from '../../../services/export/PathMarkersComponent';
import { WheelListener } from '../../../services/WheelListener';
import { AppContext, AppContextType } from '../../Context';
import { colors } from '../../styles';
import { UI_ComponentProps } from '../../UI_ComponentProps';
import { DropLayerComp } from './DropLayerComp';

const EditorComponentStyled = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
`;

const SceneEditorComponentStyled = styled.svg`
    width: 100%;
    height: 100%;
    background: ${colors.panelBackgroundMedium};
`;

const SelectionComponentStyled = styled.rect`
    stroke: red;
    stroke-width: 1px;
    fill: transparent;
`;

export interface SvgCanvasCompProps extends UI_ComponentProps<UI_SvgCanvas> {
    toolbar: JSX.Element;
}

export class SvgCanvasComp extends React.Component<SvgCanvasCompProps> {
    static contextType = AppContext;
    context: AppContextType;
    protected ref: React.RefObject<HTMLDivElement> = React.createRef();
    protected noRegisterKeyEvents = false;
    private wheelListener: WheelListener;

    componentDidMount() {
        this.wheelListener = new WheelListener(
            this.context.registry,
            (e: WheelEvent) => this.props.element.mouseWheel(e),
            () => this.props.element.mouseWheelEnd()
        );

        setTimeout(() => {
            (this.props.element.plugin as AbstractPlugin).mounted(this.ref.current);
            (this.props.element.plugin as AbstractPlugin).resize();
        }, 0);
    }

    

    render(): JSX.Element {
        const hover = (item: View) => this.context.registry.services.mouse.hover(item);
        const unhover = (canvasItem: View) => this.context.registry.services.mouse.unhover(canvasItem);
        
        const plugin = this.context.registry.plugins.getViewById<SceneEditorPlugin>(SceneEditorPluginId);

        return (
            <EditorComponentStyled ref={this.ref} id={plugin.id} style={{cursor: plugin.toolHandler.getActiveTool().getCursor()}}>
                {this.props.toolbar}
                <DropLayerComp
                    isDragging={!!this.context.registry.services.pointer.droppableItem}
                    onDrop={(p, droppedItemType) => this.context.registry.services.mouse.mouseUp({x: p.x, y: p.y, which: 1} as MouseEvent, droppedItemType)}
                    onMouseMove={(e) => this.context.registry.services.mouse.mouseMove(e)}
                    onMouseOver={() => plugin.over()}
                    onMouseOut={() => plugin.out()}
                    registry={this.context.registry}
                />
                <SceneEditorComponentStyled
                    tabIndex={0}
                    viewBox={plugin.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.props.element.mouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.props.element.mouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.props.element.mouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.props.element.mouseLeave(e.nativeEvent)}
                    onMouseEnter={(e) => this.props.element.mouseEnter(e.nativeEvent)}
                    onKeyDown={e => this.props.element.keyDown(e.nativeEvent)}
                    onKeyUp={e => this.props.element.keyUp(e.nativeEvent)}
                    onMouseOver={(e) => this.props.element.mouseOver(e.nativeEvent)}
                    onMouseOut={(e) => this.props.element.mouseOut(e.nativeEvent)}
                    onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {this.props.children}
                    {/* <MeshViewContainerComponent hover={hover} unhover={unhover} registry={this.context.registry} renderWithSettings={false}/> */}
                    <PathViewContainerComponent hover={hover} unhover={unhover} registry={this.context.registry} renderWithSettings={false}/>
                    {this.renderFeedbacks()}
                </SceneEditorComponentStyled>
            </EditorComponentStyled>
        );
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