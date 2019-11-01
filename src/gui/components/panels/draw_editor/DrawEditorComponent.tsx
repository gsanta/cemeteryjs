import * as React from 'react';
import { AppContextType, AppContext } from '../../Context';
import styled from 'styled-components';
import { Segment } from '@nightshifts.inc/geometry/build/shapes/Segment';
import { colors } from '../../colors';

const DrawEditor = styled.div`
    height: calc(100% - 35px);
    overflow: auto;
`;

const DrawCanvas = styled.svg`
    width: 1000px;
    height: 1000px;
`;

const Line = styled.line`
    stroke: ${colors.grey3};
    stroke-width: 1px;
    opacity: 0.5;
`;

export class DrawEditorComponent extends React.Component<any> {
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
        const horizontalLines = this.renderLines(context.controllers.drawEditorController.config.horizontalHelperLines);
        const verticalLines = this.renderLines(context.controllers.drawEditorController.config.verticalHelperLines);
        
        return (
            <DrawEditor>
                <DrawCanvas
                    onMouseDown={(e) => this.props.services.mouseHandler.onMouseDown(e.nativeEvent)}
                    onMouseMove={(e) => this.onMouseMove(e.nativeEvent)}
                    onMouseUp={(e) => this.props.services.mouseHandler.onMouseUp(e.nativeEvent)}    
                >
                    {horizontalLines}
                    {verticalLines}
                </DrawCanvas>
            </DrawEditor>
        )
    }

    private renderLines(lines: Segment[]): JSX.Element[] {
        return lines.map(segment => {
            const p1 = segment.getPoints()[0];
            const p2 = segment.getPoints()[1];
            return <Line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}/>
        });
    }
}