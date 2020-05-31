import * as React from 'react';
import * as ReactDom from 'react-dom';
import styled from 'styled-components';
import { WindowToolbarStyled } from '../../core/WindowToolbar';
import { CanvasComponent } from '../common/CanvasComponent';
import { ToolbarComponent } from '../common/toolbar/ToolbarComponent';
import { ToolType } from '../common/tools/Tool';
import { CodeEditorPlugin } from './CodeEditorPlugin';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const CodeEditorStyled = styled.div`
    background: #33334C;
    height: 100%;
    color: white;
    position: relative;
    overflow: hidden;
`;

const EditorStyled = styled.div`
    margin-top: 40px;
    width: 100%;
    height: calc(100% - 40px);
`;

export class CodeEditorComponent extends CanvasComponent {
    
    constructor(props: {}) {
        super(props);
        this.noRegisterKeyEvents = true;
    }

    componentDidMount() {
        super.componentDidMount();
        this.context.registry.services.plugin.getViewById<CodeEditorPlugin>(CodeEditorPlugin.id).setCanvasRenderer(() => this.forceUpdate());
        this.context.registry.services.plugin.getViewById(CodeEditorPlugin.id).repainter = () => {this.forceUpdate()};
        
        const view = this.context.registry.services.plugin.getViewById<CodeEditorPlugin>(CodeEditorPlugin.id);

        setTimeout(() => {
            const editorElement: HTMLElement = document.querySelector(`#${view.getId()} .editor`);
            const editor = monaco.editor.create(editorElement, {
                language: 'javascript',
                automaticLayout: true,
                readOnly: false,
                theme: "vs-dark",
            });

            view.editor = editor;
        }, 0)
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
                    <ToolbarComponent
                        tools={[ToolType.Zoom, ToolType.Pan]}
                        view={view}
                        renderFullScreenIcon={true}
                        backgroundColor="black"
                    />
                    <EditorStyled className="editor"/>
                </CodeEditorStyled>
        );
    }
}