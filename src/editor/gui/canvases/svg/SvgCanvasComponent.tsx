import * as React from 'react';
import { AppContextType, AppContext } from '../../Context';
import styled from 'styled-components';
import { colors } from '../../styles';
import { WgDefinitionAttributes } from '../../../../world_generator/importers/svg/WorldMapJson';
import { Rectangle } from '../../../../model/geometry/shapes/Rectangle';
import { sort } from '../../../../model/geometry/utils/Functions';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';
import { CanvasItemTag } from '../../../controllers/canvases/svg/models/CanvasItem';
import { AbstractSelectionTool } from '../../../controllers/canvases/svg/tools/AbstractSelectionTool';
import { ToolType } from '../../../controllers/canvases/svg/tools/Tool';
import { CameraTool } from '../../../controllers/canvases/svg/tools/CameraTool';
import { PathComponent } from './PathComponent';
import { PathMarkersComponent } from './PathMarkersComponent';

const EditorComponentStyled = styled.div`
    width: 100%;
    height: 100%;
`;

const CanvasComponentStyled = styled.svg`
    width: 100%;
    height: 100%;
    background: ${colors.panelBackgroundLight};
`;

const SelectionComponentStyled = styled.rect`
    stroke: red;
    stroke-width: 1px;
    fill: transparent;
`;

export class SvgCanvasComponent extends React.Component<{canvasController: SvgCanvasController}> {
    static contextType = AppContext;
    context: AppContextType;
    private webglModelSizeTestingElement: HTMLCanvasElement;

    constructor(props: {canvasController: SvgCanvasController}) {
        super(props);

        this.props.canvasController.setCanvasRenderer(() => this.forceUpdate());
    }

    render(): JSX.Element {
        const bitmapConfig = this.props.canvasController.configModel;
        const controller = this.context.controllers.svgCanvasController;
        const cameraTool = controller.findToolByType(ToolType.CAMERA) as CameraTool;

        return (
            <EditorComponentStyled id={this.props.canvasController.getId()}>
                <CanvasComponentStyled
                    viewBox={cameraTool.getCamera().getViewBoxAsString()}
                    id={this.context.controllers.svgCanvasId}
                    onMouseDown={(e) => this.props.canvasController.mouseController.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.props.canvasController.mouseController.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.props.canvasController.mouseController.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.props.canvasController.mouseController.onMouseOut(e.nativeEvent)}
                    data-wg-pixel-size={bitmapConfig.pixelSize}
                    data-wg-width={bitmapConfig.canvasDimensions.x}
                    data-wg-height={bitmapConfig.canvasDimensions.y}
                >
                    <defs>
                        <PathMarkersComponent/>
                    </defs>
                    {this.props.canvasController.toolService.getToolExporter(ToolType.RECTANGLE).export()}
                    {this.props.canvasController.toolService.getToolExporter(ToolType.PATH).export()}
                    {this.renderSelection()}


                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderCanvasItems() {
        let items = [...this.props.canvasController.canvasStore.items];
        items = sort(items, (a, b) => a.layer - b.layer);
        return items.map((item, i) => {
            const rectangle = item.dimensions as Rectangle;
            const pixelSize = this.props.canvasController.configModel.pixelSize;

            const x = rectangle.topLeft.x * pixelSize;
            const y = rectangle.topLeft.y * pixelSize;
            const width = (rectangle.bottomRight.x - rectangle.topLeft.x) * pixelSize;
            const height = (rectangle.bottomRight.y - rectangle.topLeft.y) * pixelSize;

            const fill = item.tags.has(CanvasItemTag.SELECTED) ? 'blue' : item.color;

            return (
                <rect
                    key={i}
                    x={`${x}px`}
                    y={`${y}px`}
                    width={`${width}px`}
                    height={`${height}px`}
                    fill={fill}
                    stroke='black'
                    onMouseOver={() => this.props.canvasController.mouseController.hover(item)}
                    onMouseOut={() => this.props.canvasController.mouseController.unhover()}
                />
            )
        });
    }

    private renderArrows() {
        return this.props.canvasController.canvasStore.pathes.map(arrow => <PathComponent item={arrow}/>);
    }

    private renderSelection(): JSX.Element {
        const tool = this.props.canvasController.getActiveTool();

        if (tool.supportsRectSelection()) {
            const selectionTool = tool as AbstractSelectionTool;
            if (!selectionTool.displaySelectionRect()) { return null; }
            return (
                <SelectionComponentStyled 
                    x={selectionTool.getSelectionRect().topLeft.x}
                    y={selectionTool.getSelectionRect().topLeft.y}
                    width={selectionTool.getSelectionRect().bottomRight.x - selectionTool.getSelectionRect().topLeft.x}
                    height={selectionTool.getSelectionRect().bottomRight.y - selectionTool.getSelectionRect().topLeft.y}
                />
            );
        }

        return null;
    }

    renderMetaData(): JSX.Element {
        const wgTypeComponents = this.props.canvasController.worldItemDefinitions.map(type => {
            const props: Partial<WgDefinitionAttributes> = {
                color: type.color,
                scale: type.scale ? type.scale + '' : '1',
                'translate-y': type.translateY ? type.translateY + '' : '0',
                'type-name': type.typeName
            };

            if (props.model) {
                props.model = type.model;
            }

            if (props.materials) {
                props.materials = type.materials.join(' ');
            }

            return React.createElement('wg-type', props);
        });

        return <metadata>{wgTypeComponents}</metadata>
    }
}