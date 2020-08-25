import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { AbstractCanvasPlugin } from "../../../core/plugins/AbstractCanvasPlugin";
import { UI_Region } from "../../../core/plugins/UI_Plugin";
import { ICamera } from "../../../core/models/misc/camera/ICamera";
import { Tool } from "../../../core/plugins/tools/Tool";

export const initCode = `
    const gameRegistry = cemetery.init(document.getElementById('canvas'));
`;

export const CodeEditorPluginId = 'code-editor-plugin'; 

export class CodeEditorPlugin extends AbstractCanvasPlugin {
    id = 'code-editor-plugin';
    region = UI_Region.Canvas1;
    visible = true;
    editors: monaco.editor.IStandaloneCodeEditor[] = [];

    componentMounted() {
        const snapshot = this.registry.services.export.export();
        
        const json = JSON.stringify(JSON.parse(snapshot), null, 3);
        const code = `
const input = ${json}
        `;

        this.editors[0].setValue(code);
    }

    getStore() {
        return null;
    }

    getCamera(): ICamera {
        return null;
    }

    getSelectedTool(): Tool {
        return null;
    }

    resize() {
        if (this.editors.length > 0) {
            setTimeout(() => {
                this.editors.forEach(editor => editor.layout());
            }, 100);
        }

        this.renderFunc && this.renderFunc();
    } 
}