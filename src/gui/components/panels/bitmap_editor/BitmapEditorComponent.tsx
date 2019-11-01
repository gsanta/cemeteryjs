import * as React from 'react';
import { AppContextType, AppContext } from '../../Context';
import styled from 'styled-components';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { colors } from '../../colors';
import { Pixel } from '../../../controllers/bitmap_editor/PixelController';

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
        const bitmapConfig = context.controllers.bitmapEditor.config;
        const horizontalLines = this.renderLines(context.controllers.bitmapEditor.config.horizontalHelperLines);
        const verticalLines = this.renderLines(context.controllers.bitmapEditor.config.verticalHelperLines);
        
        return (
            <EditorComponent id={context.controllers.bitmapEditor.id}>
                <CanvasComponent
                    w={bitmapConfig.canvasDimensions.x}
                    h={bitmapConfig.canvasDimensions.y}
                    onMouseDown={(e) => context.controllers.bitmapEditor.mouseController.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => context.controllers.bitmapEditor.mouseController.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => context.controllers.bitmapEditor.mouseController.onMouseUp(e.nativeEvent)}    
                >
                    {horizontalLines}
                    {verticalLines}
                    {this.renderPixels(context)}
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
        const pixelController = context.controllers.bitmapEditor.pixelController;

        return Array.from(pixelController.bitMap).map(([index, pixel]) => {
            const pos = pixelController.getPixelPosition(index);
            return (
                <rect width="10px" height="10px" x={`${pos.x}px`} y={`${pos.y}px`} fill={pixel.color}></rect>
            )
        })
    }
}