import { MonacoConfig } from '../../../configs/MonacoConfig';
import { debounce } from '../../../../model/utils/Functions';
import { ControllerFacade } from '../../ControllerFacade';
import { IEditorController } from '../IEditorController';
import { IEditorWriter } from '../IEditorWriter';
import { TextEditorReader } from './TextEditorReader';
import { IEditorReader } from '../IEditorReader';
import { TextEditorWriter } from './TextEditorWriter';
import { FileFormat } from '../../../../WorldGenerator';
import { IReadableEditor } from '../IReadableEditor';
import { IWritableEditor } from '../IWritableEditor';
import { IReadableWriteableEditor } from '../IReadableWriteableEditor';
import { Events } from '../../events/Events';

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

W = wall BORDER
D = door BORDER
I = window BORDER
- = room
E = bed MOD assets/models/bed.babylon
T = table DIM 2 1 MOD assets/models/table.babylon
= = _subarea
H = chair

\`

`;

export class TextEditorController implements IReadableWriteableEditor {
    static id = 'text-editor';
    fileFormats = [FileFormat.TEXT];
    editor: any;
    text: string = null;
    writer: IEditorWriter;
    reader: IEditorReader;
    
    private controllers: ControllerFacade;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.writer = new TextEditorWriter(this, controllers.worldItemDefinitionModel);
        this.reader = new TextEditorReader(this);
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
        this.controllers.webglEditorController.isDirty = true;
        this.controllers.updateUIController.updateUI();
        this.controllers.eventDispatcher.dispatchEvent(Events.CONTENT_CHANGED);
    }

    getId(): string {
        return TextEditorController.id;
    }

    resize() {
        this.editor.layout();
    }

    setRendererDirty() {
        this.controllers.webglEditorController.isDirty = true;
    }

    setRenderer(renderFunc: () => void) {}
    render() {}
    activate(): void {
        if (!this.text) {
            this.writer.write(initialText, FileFormat.TEXT);
        }
    }
}