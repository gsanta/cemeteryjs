import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import * as React from 'react';
import styled from 'styled-components';
import { AbstractPluginComponent, PluginProps } from '../common/AbstractPluginComponent';
import { ToolbarComponent } from '../common/toolbar/ToolbarComponent';
import { PlayIconComponent } from '../common/toolbar/icons/PlayIconComponent';
import { CodeEditorPlugin, initCode } from './CodeEditorPlugin';
import { Cursor } from '../common/tools/Tool';

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
        this.context.registry.services.plugin.codeEditor.setRenderer(() => this.forceUpdate());
        
        const view = this.context.registry.services.plugin.getViewById<CodeEditorPlugin>(CodeEditorPlugin.id);

        setTimeout(() => {
            view.editors = [];

            const editor1Element: HTMLElement = document.querySelector(`#${view.getId()} .editor1`);
            const editor1 = monaco.editor.create(editor1Element, {
                value: initCode,
                language: 'javascript',
                automaticLayout: true,
                readOnly: true,
                theme: "vs-dark",
            });

            view.editors.push(editor1);

            const editor2Element: HTMLElement = document.querySelector(`#${view.getId()} .editor2`);
            const editor2 = monaco.editor.create(editor2Element, {
                value: initCode,
                language: 'javascript',
                automaticLayout: true,
                readOnly: false,
                theme: "vs-dark",
            });

            view.editors.push(editor2);;
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
                <CodeEditorStyled ref={this.ref} id={view.getId()} style={{cursor: view.getActiveTool() ? view.getActiveTool().getCursor() : Cursor.Default}}>
                    <ToolbarComponent
                        tools={[]}
                        view={view}
                        renderFullScreenIcon={true}
                        backgroundColor="black"
                        centerIcons={
                            [
                                <PlayIconComponent
                                    state={'default'}
                                    onClick={() => null} 
                                />
                            ]
                        }
                    />
                    <EditorsStyled>
                        <EditorStyled className="editor1" height="100px"/>
                        <EditorStyled className="editor2" height="calc(100% - 120px)"/>
                    </EditorsStyled>
                </CodeEditorStyled>
        );
    }
}