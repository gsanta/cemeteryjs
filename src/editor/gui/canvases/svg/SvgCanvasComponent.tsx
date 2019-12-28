import * as React from 'react';
import { AppContextType, AppContext } from '../../Context';
import styled from 'styled-components';
import { colors } from '../../styles';
import { WgDefinitionAttributes } from '../../../../world_generator/importers/svg/WorldMapJson';
import { SvgCanvasController } from '../../../controllers/formats/svg/SvgCanvasController';
import { Rectangle } from '../../../../model/geometry/shapes/Rectangle';
import { Segment } from '../../../../model/geometry/shapes/Segment';
import { AbstractSelectionTool } from '../../../controllers/formats/svg/tools/AbstractSelectionTool';
import { CanvasItemTag } from '../../../controllers/formats/svg/models/CanvasItem';
import { sort } from '../../../../model/geometry/utils/Functions';

const EditorComponentStyled = styled.div`
    height: 100%;
    overflow: auto;
`;

const CanvasComponentStyled = styled.svg`
    width: ${({w}: {w: number, h: number}) => `${w}px`};
    height: ${({h}: {w: number, h: number}) => `${h}px`};
`;

const LineComponent = styled.line`
    stroke: ${colors.grey3};
    stroke-width: 1px;
    opacity: 0.5;
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
        const horizontalLines = this.renderLines(this.props.canvasController.configModel.horizontalHelperLines);
        const verticalLines = this.renderLines(this.props.canvasController.configModel.verticalHelperLines);

        return (
            <EditorComponentStyled id={this.props.canvasController.getId()}>
                <CanvasComponentStyled
                    // transform="scale(0.5)"
                    w={bitmapConfig.canvasDimensions.x}
                    h={bitmapConfig.canvasDimensions.y}
                    onMouseDown={(e) => this.props.canvasController.mouseController.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.props.canvasController.mouseController.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.props.canvasController.mouseController.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => this.props.canvasController.mouseController.onMouseOut(e.nativeEvent)}
                    data-wg-pixel-size={bitmapConfig.pixelSize}
                    data-wg-width={bitmapConfig.canvasDimensions.x}
                    data-wg-height={bitmapConfig.canvasDimensions.y}
                >
                    {horizontalLines}
                    {verticalLines}
                    {this.renderCanvasItems()}
                    {this.renderSelection()}
                </CanvasComponentStyled>
            </EditorComponentStyled>
        );
    }

    private renderCanvasItems() {
        let items = [...this.props.canvasController.pixelModel.items];
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

    private renderLines(lines: Segment[]): JSX.Element[] {
        return [];
        // return lines.map((segment, i) => {
        //     const p1 = segment.getPoints()[0];
        //     const p2 = segment.getPoints()[1];
        //     return <LineComponent key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}/>
        // });
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

            if (props.roles) {
                props.materials = type.roles.join(' ');
            }

            return React.createElement('wg-type', props);
        });

        return <metadata>{wgTypeComponents}</metadata>
    }
}