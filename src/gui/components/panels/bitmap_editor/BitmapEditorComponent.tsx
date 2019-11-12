import * as React from 'react';
import { AppContextType, AppContext } from '../../Context';
import styled from 'styled-components';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { colors } from '../../styles';
import { WgDefinitionAttributes } from '../../../../model/readers/svg/WorldMapJson';

const EditorComponent = styled.div`
    height: calc(100% - 35px);
    overflow: auto;
`;

const CanvasComponent = styled.svg`
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

export class BitmapEditorComponent extends React.Component<any> {
    static contextType = AppContext;
    context: AppContextType;
    
    render(): JSX.Element {
        return (
            <AppContext.Consumer>
                { value => this.renderContent(value) }
            </AppContext.Consumer>

        );
    }

    private renderContent(context: AppContextType): JSX.Element {
        const bitmapConfig = context.controllers.bitmapEditorController.model.config;
        const horizontalLines = this.renderLines(context.controllers.bitmapEditorController.model.config.horizontalHelperLines);
        const verticalLines = this.renderLines(context.controllers.bitmapEditorController.model.config.verticalHelperLines);
        
        return (
            <EditorComponent id={context.controllers.bitmapEditorController.getId()}>
                <CanvasComponent
                    w={bitmapConfig.canvasDimensions.x}
                    h={bitmapConfig.canvasDimensions.y}
                    onMouseDown={(e) => context.controllers.bitmapEditorController.mouseController.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => context.controllers.bitmapEditorController.mouseController.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => context.controllers.bitmapEditorController.mouseController.onMouseUp(e.nativeEvent)}
                    onMouseLeave={(e) => context.controllers.bitmapEditorController.mouseController.onMouseOut(e.nativeEvent)}
                    data-wg-pixel-size={bitmapConfig.pixelSize}
                    data-wg-width={bitmapConfig.canvasDimensions.x}
                    data-wg-height={bitmapConfig.canvasDimensions.y}
                >
                    {horizontalLines}
                    {verticalLines}
                    <g className="bitmap-layer">
                        {this.renderMetaData()}
                        {this.renderPixels(context)}
                    </g>
                    {this.renderSelection()}
                </CanvasComponent>
            </EditorComponent>
        )
    }

    private renderLines(lines: Segment[]): JSX.Element[] {
        return lines.map(segment => {
            const p1 = segment.getPoints()[0];
            const p2 = segment.getPoints()[1];
            return <LineComponent x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}/>
        });
    }

    private renderPixels(context: AppContextType): JSX.Element[] {
        const pixelController = context.controllers.bitmapEditorController.model.pixels;
        const worldItemTypeModel = context.controllers.worldItemDefinitionModel;

        return Array.from(pixelController.bitMap).map(([index, pixel]) => {
            const pixelSize = context.controllers.bitmapEditorController.model.config.pixelSize;
            const pos = pixelController.getPixelPosition(index).mul(pixelSize);
            const color = worldItemTypeModel.getByTypeName(pixel.type).color;

            return (
                <rect 
                    width="10px" 
                    height="10px" 
                    x={`${pos.x}px`} 
                    y={`${pos.y}px`} 
                    fill={color}
                    data-wg-x={pos.x}
                    data-wg-y={pos.y}
                    data-wg-type={pixel.type}
                />
            )
        })
    }

    private renderSelection(): JSX.Element {
        const selectionModel = this.context.controllers.bitmapEditorController.selectionModel;

        if (selectionModel.isVisible && selectionModel.topLeftPoint && selectionModel.bottomRightPoint) {
            console.log('selection')
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
        const wgTypeComponents = this.context.controllers.worldItemDefinitionModel.types.map(type => {
            const props: Partial<WgDefinitionAttributes> = {
                color: type.color,
                'is-border': type.isBorder ? 'true' : 'false',
                scale: type.scale ? type.scale + '' : '1',
                'translate-y': type.translateY ? type.translateY + '' : '0',
                'type-name': type.typeName
            };

            if (props.model) {
                props.model = type.model;
            }

            if (props.materials) {
                props.materials = type.materials.join(', ');
            }

            return React.createElement('wg-type', props);
        });

        return <metadata>{wgTypeComponents}</metadata>
    }
}