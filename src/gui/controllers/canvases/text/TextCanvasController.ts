import { debounce } from '../../../../model/utils/Functions';
import { FileFormat } from '../../../../WorldGenerator';
import { defaultWorldItemDefinitions } from '../../../configs/defaultWorldItemDefinitions';
import { MonacoConfig } from '../../../configs/MonacoConfig';
import { ControllerFacade } from '../../ControllerFacade';
import { Events } from '../../events/Events';
import { ICanvasReader } from '../ICanvasReader';
import { ICanvasWriter } from '../ICanvasWriter';
import { IEditableCanvas } from '../IEditableCanvas';
import { TextCanvasReader } from './TextCanvasReader';
import { TextCanvasWriter } from './TextCanvasWriter';
import { GameObjectTemplate } from '../../../../model/types/GameObjectTemplate';

const THEME = 'nightshiftsTheme';
const LANGUAGE = 'nightshiftsLanguage';

export const initialText = 
`
map \`

WWWWWWWW
w------W
w------W
w------W
WWWWWWWW

\`


definitions \`

W = wall ROLES [BORDER]
D = door ROLES [BORDER]
I = window ROLES [BORDER]
- = room ROLES [CONTAINER]
E = bed MOD assets/models/bed.babylon
T = table DIM 2 1 MOD assets/models/table.babylon
= = _subarea ROLES [CONTAINER]
H = chair

\`

`;

export class TextCanvasController implements IEditableCanvas {
    static id = 'text-canvas-controller';
    fileFormats = [FileFormat.TEXT];
    editor: any;
    text: string = null;
    writer: ICanvasWriter;
    reader: ICanvasReader;
    worldItemDefinitions: GameObjectTemplate[];
    
    private controllers: ControllerFacade;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.writer = new TextCanvasWriter(this);
        this.reader = new TextCanvasReader(this);
        this.worldItemDefinitions = [...defaultWorldItemDefinitions];
    }

    createEditor(monacoModule: any, monacoConfig: typeof MonacoConfig, element: HTMLDivElement, content: string) {
        monacoModule.languages.register({ id: LANGUAGE });

        monacoModule.languages.setMonarchTokensProvider(LANGUAGE, {
            tokenizer: <any> {
                root: monacoConfig.languageTokens
            }
        });

        monacoModule.editor.defineTheme(THEME, <any> {
            base: 'vs-dark',
            inherit: true,
            rules: monacoConfig.colorRules,
            colors: {
                'editor.foreground': '#000000'
            }
        });

        const editor = monacoModule.editor.create(element, {
            value: content,
            theme: THEME,
            language: LANGUAGE,
            minimap: {
                enabled: false
            }
        });

        this.editor = editor;

        return {
            onChange: (callback: (newContent: string) => void) => {
                const debounced = debounce(callback, 1000);
                editor.onDidChangeModelContent(() => {
                    debounced(editor.getValue());
                });
            }
        }
    }

    setText(text: string) {
        this.text = text;
        this.controllers.webglCanvasController.isDirty = true;
        this.controllers.updateUIController.updateUI();
        this.controllers.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }

    getId(): string {
        return TextCanvasController.id;
    }

    resize() {
        this.editor.layout();
    }

    setRendererDirty() {
        this.controllers.webglCanvasController.isDirty = true;
    }

    renderCanvas() {}

    renderToolbar() {}

    setCanvasRenderer(renderFunc: () => void) {}

    setToolbarRenderer(renderFunc: () => void) {}

    activate(): void {
        if (!this.text) {
            this.writer.write(initialText, FileFormat.TEXT);
        }
    }
}