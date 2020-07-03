import { LayoutType } from "../Plugins";
import { Registry } from "../../core/Registry";
import { AbstractPlugin } from "../../core/AbstractPlugin";
import { ICamera } from "../common/camera/ICamera";
import { Tool } from "../common/tools/Tool";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Tools } from "../Tools";

export const initCode = `
    const gameRegistry = cemetery.init(document.getElementById('canvas'));
`;

export class CodeEditorPlugin extends AbstractPlugin {
    static id = 'code-editor-plugin';
    visible = true;
    editors: monaco.editor.IStandaloneCodeEditor[] = [];

    constructor(registry: Registry) {
        super(registry);

        this.tools = new Tools([]);
    }

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

    getId(): string {
        return CodeEditorPlugin.id;
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