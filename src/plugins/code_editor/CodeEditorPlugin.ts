import { LayoutType } from "../../core/services/PluginService";
import { Registry } from "../../core/Registry";
import { AbstractPlugin } from "../../core/AbstractPlugin";
import { ICamera } from "../common/camera/ICamera";
import { Tool } from "../common/tools/Tool";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

export const initCode = `
    const gameRegistry = cemetery.init(document.getElementById('canvas'));
`;

export class CodeEditorPlugin extends AbstractPlugin {
    static id = 'code-editor-plugin';
    visible = true;
    allowedLayouts = new Set([LayoutType.Single, LayoutType.Double]);

    editors: monaco.editor.IStandaloneCodeEditor[] = [];

    private renderCanvasFunc: () => void;

    constructor(registry: Registry) {
        super(registry);

        this.selectedTool = this.registry.tools.pan;

        this.update = this.update.bind(this);
    }

    getStore() {
        return null;
    }

    getCamera(): ICamera {
        return null;
    }

    update() {
        this.renderCanvasFunc();
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
    }

    setCanvasRenderer(renderFunc: () => void) {
        this.renderCanvasFunc = renderFunc;
    }

    isVisible(): boolean {
        return this.visible;
    }

    setVisible(visible: boolean) {
        this.visible = visible;
    }    
}