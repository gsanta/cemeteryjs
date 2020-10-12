import * as React from 'react';
import styled from 'styled-components';
import { UI_ElementType } from '../../../elements/UI_ElementType';
import { UI_SvgCanvas } from '../../../elements/UI_SvgCanvas';
import { PathMarkersComponent } from '../../../../services/export/PathMarkersComponent';
import { WheelListener } from '../../../../services/WheelListener';
import { AppContext, AppContextType } from '../../Context';
import { colors } from '../../styles';
import { UI_ComponentProps } from '../../UI_ComponentProps';
import { UI_HtmlCanvas } from '../../../elements/UI_HtmlCanvas';
import { Camera2D } from '../../../../models/misc/camera/Camera2D';
import { AbstractCanvasPlugin } from '../../../../plugin/AbstractCanvasPlugin';

const SelectionComponentStyled = styled.rect`
    stroke: red;
    stroke-width: 1px;
    fill: transparent;
`;

export interface CanvasCompProps extends UI_ComponentProps<UI_SvgCanvas | UI_HtmlCanvas> {
    toolbar: JSX.Element;
    dropLayer: JSX.Element;
    gizmoLayer?: JSX.Element;
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
            (e: WheelEvent) => this.props.element.mouseWheel(this.props.registry, e),
            () => this.props.element.mouseWheelEnd(this.props.registry)
        );

        // setTimeout(() => {
            (this.props.registry.plugins.getById(this.props.element.pluginId) as AbstractCanvasPlugin).mounted(this.ref.current);
            (this.props.registry.plugins.getById(this.props.element.pluginId) as AbstractCanvasPlugin).resize();
        // }, 0);
    }

    render(): JSX.Element {
        const plugin = this.props.registry.plugins.getById(this.props.element.pluginId) as AbstractCanvasPlugin;

        return (
            <div 
                ref={this.ref} id={plugin.id}
                style={{
                    cursor: this.props.registry.plugins.getToolController(plugin.id).getActiveTool().getCursor(),
                    width: this.props.element.width ? this.props.element.width :'100%',
                    height: this.props.element.height ? this.props.element.height :'100%',
                    position: 'relative'
                }}
            >
                {this.props.toolbar}
                {this.props.dropLayer}
                {this.props.gizmoLayer}
                {this.props.element.elementType === UI_ElementType.SvgCanvas ? this.renderSvgCanvas() : this.renderHtmlCanvas()}

            </div>
        );
    }

    private renderSvgCanvas() {
        return (
            <svg
                style={{
                    width: this.props.element.width ? this.props.element.width :'100%',
                    height: this.props.element.height ? this.props.element.height :'100%',
                    background: colors.panelBackgroundMedium
                }}
                tabIndex={0}
                viewBox={((this.props.registry.plugins.getById(this.props.element.pluginId) as AbstractCanvasPlugin).getCamera() as Camera2D).getViewBoxAsString()}
                id={this.context.controllers.svgCanvasId}
                onMouseDown={(e) => this.props.element.mouseDown(this.props.registry, e.nativeEvent)}
                onMouseMove={(e) => this.props.element.mouseMove(this.props.registry, e.nativeEvent)}                
                onMouseUp={(e) => this.props.element.mouseUp(this.props.registry, e.nativeEvent)}
                onMouseLeave={(e) => this.props.element.mouseLeave(this.props.registry, e.nativeEvent)}
                onMouseEnter={(e) => this.props.element.mouseEnter(this.props.registry, e.nativeEvent)}
                onKeyDown={e => this.props.element.keyDown(this.props.registry, e.nativeEvent)}
                onKeyUp={e => this.props.element.keyUp(this.props.registry, e.nativeEvent)}
                onMouseOver={(e) => this.props.element.mouseOver(this.props.registry, e.nativeEvent)}
                onMouseOut={(e) => this.props.element.mouseOut(this.props.registry, e.nativeEvent)}
                onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
            >
                <defs>
                    <PathMarkersComponent/>
                </defs>
                {this.props.children}
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
                    onMouseDown={(e) => this.props.element.mouseDown(this.props.registry, e.nativeEvent)}
                    onMouseMove={(e) => this.props.element.mouseMove(this.props.registry, e.nativeEvent)}
                    onMouseUp={(e) => this.props.element.mouseUp(this.props.registry, e.nativeEvent)}
                    onMouseLeave={(e) => this.props.element.mouseLeave(this.props.registry, e.nativeEvent)}
                    onMouseEnter={(e) => this.props.element.mouseEnter(this.props.registry, e.nativeEvent)}
                    onWheel={(e) => this.wheelListener.onWheel(e.nativeEvent)}
                    onKeyDown={e => this.props.element.keyDown(this.props.registry, e.nativeEvent)}
                    onKeyUp={e => this.props.element.keyUp(this.props.registry, e.nativeEvent)}
                    onMouseOver={(e) => this.props.element.mouseOver(this.props.registry, e.nativeEvent)}
                    onMouseOut={(e) => this.props.element.mouseOut(this.props.registry, e.nativeEvent)}
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
        const activeTool = this.props.registry.plugins.getToolController(this.props.element.pluginId).getActiveTool();
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