import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as React from 'react';
import styled from 'styled-components';
import { AbstractPluginComponent, PluginProps } from '../common/AbstractPluginComponent';
import { Cursor } from '../common/tools/Tool';
import { CodeEditorPlugin, CodeEditorPluginId, initCode } from './CodeEditorPlugin';

const CodeEditorStyled = styled.div`
    background: black;
    height: 100%;
    color: white;
    position: relative;
    overflow: hidden;
`;

const EditorStyled = styled.div`
    width: 100%;
    height: ${(props: {height: string}) => props.height};
`;

const EditorsStyled = styled.div`
    margin-top: 40px;
    height: calc(100% - 40px);

    .editor1 {
        margin-bottom: 20px;
    }
`;

export class CodeEditorComponent extends AbstractPluginComponent {
    
    constructor(props: PluginProps) {
        super(props);
        this.noRegisterKeyEvents = true;
    }

    componentDidMount() {
        super.componentDidMount();
        this.context.registry.plugins.codeEditor.setRenderer(() => this.forceUpdate());
        
        const view = this.context.registry.plugins.getViewById<CodeEditorPlugin>(CodeEditorPluginId);

        setTimeout(() => {
            view.editors = [];

            const editor1Element: HTMLElement = document.querySelector(`#${view.id} .editor1`);
            const editor1 = monaco.editor.create(editor1Element, {
                value: initCode,
                language: 'javascript',
                automaticLayout: true,
                readOnly: true,
                theme: "vs-dark",
            });

            view.editors.push(editor1);

            const editor2Element: HTMLElement = document.querySelector(`#${view.id} .editor2`);
            const editor2 = monaco.editor.create(editor2Element, {
                value: initCode,
                language: 'javascript',
                automaticLayout: true,
                readOnly: false,
                theme: "vs-dark",
            });

            view.editors.push(editor2);
            this.props.plugin.componentMounted(this.ref.current);
        }, 0)
    }

    componentWillUnmount() {
        this.context.registry.plugins.getViewById(CodeEditorPluginId).destroy();
    }

    componentDidUpdate() {
        // this.context.controllers.getWindowControllerByName('renderer').resize();
    }

    render() {
        const view = this.context.registry.plugins.getViewById<CodeEditorPlugin>(CodeEditorPluginId);

        return (
                <CodeEditorStyled ref={this.ref} id={view.id} style={{cursor: view.getActiveTool() ? view.getActiveTool().getCursor() : Cursor.Default}}>
                    <EditorsStyled>
                        <EditorStyled className="editor1" height="30%"/>
                        <EditorStyled className="editor2" height="calc(70% - 120px)"/>
                    </EditorsStyled>
                </CodeEditorStyled>
        );
    }
}