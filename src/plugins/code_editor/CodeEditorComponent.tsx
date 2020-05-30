import * as React from 'react';
import styled from 'styled-components';
import { WheelListener } from '../../core/services/WheelListener';
import { WindowToolbarStyled } from '../../core/WindowToolbar';
import { CanvasComponent } from '../common/CanvasComponent';
import { ToolbarComponent } from '../common/toolbar/ToolbarComponent';
import { ToolType } from '../common/tools/Tool';
import { CodeEditorPlugin } from './CodeEditorPlugin';

const CodeEditorStyled = styled.div`
    background: #33334C;
    height: 100%;
    color: white;
    position: relative;
`;

export class CodeEditorComponent extends CanvasComponent {
    componentDidMount() {
        super.componentDidMount();
        this.context.registry.services.plugin.getViewById<CodeEditorPlugin>(CodeEditorPlugin.id).setCanvasRenderer(() => this.forceUpdate());
        this.context.registry.services.plugin.getViewById(CodeEditorPlugin.id).repainter = () => {this.forceUpdate()};
        
    }

    componentWillUnmount() {
        this.context.registry.services.plugin.getViewById(CodeEditorPlugin.id).destroy();
    }

    componentDidUpdate() {
        // this.context.controllers.getWindowControllerByName('renderer').resize();
    }

    render() {
        const view = this.context.registry.services.plugin.getViewById<CodeEditorPlugin>(CodeEditorPlugin.id);

        return (
                <CodeEditorStyled ref={this.ref} id={view.getId()} style={{cursor: view.getActiveTool().getCursor()}}>
                    <WindowToolbarStyled>
                        <ToolbarComponent
                            tools={[ToolType.Zoom, ToolType.Pan]}
                            view={view}
                            renderFullScreenIcon={true}
                        />
                    </WindowToolbarStyled>
                </CodeEditorStyled>
        );
    }

}