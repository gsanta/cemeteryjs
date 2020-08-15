import * as React from 'react';
import styled from 'styled-components';
import { Camera2D } from '../../../../../plugins/common/camera/Camera2D';
import { PathViewContainerComponent } from '../../../../../plugins/scene_editor/components/PathViewComponent';
import { AbstractCanvasPlugin } from '../../../../plugins/AbstractCanvasPlugin';
import { UI_ElementType } from '../../../elements/UI_ElementType';
import { UI_SvgCanvas } from '../../../elements/UI_SvgCanvas';
import { View } from '../../../../stores/views/View';
import { PathMarkersComponent } from '../../../../services/export/PathMarkersComponent';
import { WheelListener } from '../../../../services/WheelListener';
import { AppContext, AppContextType } from '../../Context';
import { colors } from '../../styles';
import { UI_ComponentProps } from '../../UI_ComponentProps';
import { DropLayerComp } from './DropLayerComp';
import { UI_HtmlCanvas } from '../../../elements/UI_HtmlCanvas';

const EditorComponentStyled = styled.div`
    position: relative;
`;


const SelectionComponentStyled = styled.rect`
    stroke: red;
    stroke-width: 1px;
    fill: transparent;
`;

export interface CanvasCompProps extends UI_ComponentProps<UI_SvgCanvas | UI_HtmlCanvas> {
    toolbar: JSX.Element;
    dropLayer: JSX.Element;
}

export class CanvasComp extends React.Component<CanvasCompProps> {
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
            (this.props.element.plugin as AbstractCanvasPlugin).mounted(this.ref.current);
            (this.props.element.plugin as AbstractCanvasPlugin).resize();
        }, 0);
    }

    render(): JSX.Element {
        const plugin = this.props.element.plugin as AbstractCanvasPlugin;
        
        return (
            <EditorComponentStyled 
                ref={this.ref} id={plugin.id}
                style={{
                    cursor: plugin.toolHandler.getActiveTool().getCursor(),
                    width: this.props.element.width ? this.props.element.width :'100%',
                    height: this.props.element.height ? this.props.element.height :'100%'
                }}
            >
                {this.props.toolbar}
                {this.props.dropLayer ? this.props.dropLayer : null}
                {this.props.element.elementType === UI_ElementType.SvgCanvas ? this.renderSvgCanvas() : this.renderHtmlCanvas()}

            </EditorComponentStyled>
        );
    }

    private renderSvgCanvas() {
        const hover = (item: View) => this.context.registry.services.mouse.hover(item);
        const unhover = (canvasItem: View) => this.context.registry.services.mouse.unhover(canvasItem);

        return (
            <svg
                style={{
                    width: this.props.element.width ? this.props.element.width :'100%',
                    height: this.props.element.height ? this.props.element.height :'100%',
                    background: colors.panelBackgroundMedium
                }}
                tabIndex={0}
                viewBox={((this.props.element.plugin as AbstractCanvasPlugin).getCamera() as Camera2D).getViewBoxAsString()}
                id={this.context.controllers.svgCanvasId}
                onMouseDown={(e) => this.props.element.mouseDown(e.nativeEvent)}
                onMouseMove={(e) => {
                    console.log('mouse move')
                    this.props.element.mouseMove(e.nativeEvent)
                }}                onMouseUp={(e) => this.props.element.mouseUp(e.nativeEvent)}
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
            </svg>
        );
    }

    private renderHtmlCanvas() {
        return (
            <React.Fragment>
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: this.props.element.width ? this.props.element.width :'100%',
                        height: this.props.element.height ? this.props.element.height :'100%',    
                        backgroundColor: 'transparent'
                    }}
                    tabIndex={0}
                    onMouseDown={(e) => this.props.element.mouseDown(e.nativeEvent)}
                    onMouseMove={(e) => {
                        console.log('mouse move')
                        this.props.element.mouseMove(e.nativeEvent)
                    }}
                    onMouseUp={(e) => this.props.element.mouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.props.element.mouseLeave(e.nativeEvent)}
                    onMouseEnter={(e) => this.props.element.mouseEnter(e.nativeEvent)}
                    onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                    onKeyDown={e => this.props.element.keyDown(e.nativeEvent)}
                    onKeyUp={e => this.props.element.keyUp(e.nativeEvent)}
                />
                <canvas
                    style={{
                        width: this.props.element.width ? this.props.element.width :'100%',
                        height: this.props.element.height ? this.props.element.height :'100%',
    
                    }}
                />
            </React.Fragment>
        );
    }

    private renderFeedbacks(): JSX.Element {
        const activeTool = (this.props.element.plugin as AbstractCanvasPlugin).toolHandler.getActiveTool();
        if (activeTool.rectangleSelection) {
            return (
                <SelectionComponentStyled 
                    x={activeTool.rectangleSelection.topLeft.x}
                    y={activeTool.rectangleSelection.topLeft.y}
                    width={activeTool.rectangleSelection.getWidth()}
                    height={activeTool.rectangleSelection.getHeight()}
                />
            );
        }

        return null;
    }
}