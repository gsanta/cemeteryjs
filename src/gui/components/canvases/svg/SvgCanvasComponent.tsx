import * as React from 'react';
import { AppContextType, AppContext } from '../../Context';
import styled from 'styled-components';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { colors } from '../../styles';
import { WgDefinitionAttributes } from '../../../../model/readers/svg/WorldMapJson';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';
import { CanvasComponent } from '../CanvasComponent';
import { Rectangle } from '@nightshifts.inc/geometry';
import { PixelTag } from '../../../controllers/canvases/svg/models/GridCanvasStore';

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

    constructor(props: {canvasController: SvgCanvasController}) {
        super(props);

        this.props.canvasController.setCanvasRenderer(() => this.forceUpdate());
    }
    
    render(): JSX.Element {
        const bitmapConfig = this.props.canvasController.configModel;
        const horizontalLines = this.renderLines(this.props.canvasController.configModel.horizontalHelperLines);
        const verticalLines = this.renderLines(this.props.canvasController.configModel.verticalHelperLines);
        const svg = this.props.canvasController.reader.read();

        const canvas = (
            <EditorComponentStyled id={this.props.canvasController.getId()}>
                <CanvasComponentStyled
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

        return <CanvasComponent canvas={canvas}/>
    }

    private renderCanvasItems() {
        return this.props.canvasController.pixelModel.items.map(item => {
            const rectangle = item.polygon as Rectangle;
            const pixelSize = this.props.canvasController.configModel.pixelSize;

            const x = rectangle.topLeft.x * pixelSize;
            const y = rectangle.topLeft.y * pixelSize;
            const width = (rectangle.bottomRight.x - rectangle.topLeft.x) * pixelSize;
            const height = (rectangle.bottomRight.y - rectangle.topLeft.y) * pixelSize;

            const fill = item.tags.includes(PixelTag.SELECTED) ? 'blue' : item.color;

            return (
                <rect 
                    x={`${x}px`}
                    y={`${y}px`}
                    width={`${width}px`}
                    height={`${height}px`}
                    fill={fill}
                    onMouseOver={() => this.props.canvasController.mouseController.hover(item)}
                    onMouseOut={() => this.props.canvasController.mouseController.unhover()}
                />
            )
        });
    }

    private renderLines(lines: Segment[]): JSX.Element[] {
        return lines.map(segment => {
            const p1 = segment.getPoints()[0];
            const p2 = segment.getPoints()[1];
            return <LineComponent x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}/>
        });
    }

    // private renderPixels(context: AppContextType): JSX.Element[] {
    //     const pixelController = this.props.canvasController.pixelModel;
    //     const worldItemDefinitionModel = this.props.canvasController.worldItemDefinitionModel;

    //     return Array.from(pixelController.bitMap).map(([index, pixel]) => {
    //         const pixelSize = this.props.canvasController.configModel.pixelSize;
    //         const pos = pixelController.getPixelPosition(index).mul(pixelSize);
    //         const color = worldItemDefinitionModel.getByTypeName(pixel.type).color;

    //         return (
    //             <rect 
    //                 width="10px" 
    //                 height="10px" 
    //                 x={`${pos.x}px`} 
    //                 y={`${pos.y}px`} 
    //                 fill={color}
    //                 data-wg-x={pos.x}
    //                 data-wg-y={pos.y}
    //                 data-wg-type={pixel.type}
    //             />
    //         )
    //     })
    // }

    private renderSelection(): JSX.Element {
        const selectionModel = this.props.canvasController.selectionModel;

        if (selectionModel.isVisible && selectionModel.topLeftPoint && selectionModel.bottomRightPoint) {
            return (
                <SelectionComponentStyled 
                    x={selectionModel.topLeftPoint.x}
                    y={selectionModel.topLeftPoint.y}
                    width={selectionModel.bottomRightPoint.x - selectionModel.topLeftPoint.x}
                    height={selectionModel.bottomRightPoint.y - selectionModel.topLeftPoint.y}
                />
            );
        } else {
            return null;
        }
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