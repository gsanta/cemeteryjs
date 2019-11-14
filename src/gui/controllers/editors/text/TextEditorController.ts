import { MonacoConfig } from '../../../configs/MonacoConfig';
import { debounce } from '../../../../model/utils/Functions';
import { ControllerFacade } from '../../ControllerFacade';
import { IEditorController } from '../IEditorController';
import { IEditorWriter } from '../IEditorWriter';
import { TextEditorReader } from './TextEditorReader';
import { IEditorReader } from '../IEditorReader';
import { TextEditorWriter } from './TextEditorWriter';
import { FileFormat } from '../../../../WorldGenerator';

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

# = wall BORDER
D = door BORDER
I = window BORDER
- = room
E = bed MOD assets/models/bed.babylon
T = table DIM 2 1 MOD assets/models/table.babylon
= = _subarea
H = chair
C = cupboard DIM 0.5 2 MOD assets/models/cupboard.babylon

\`

`;

export class TextEditorController implements IEditorController {
    static id = 'text-editor';
    fileFormat = FileFormat.TEXT;
    editor: any;
    text: string = initialText;
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
        this.controllers.rendererController.isDirty = true;
        this.controllers.updateUIController.updateUI();
    }

    getId(): string {
        return TextEditorController.id;
    }

    resize() {
        this.editor.layout();
    }

    setRendererDirty() {
        this.controllers.rendererController.isDirty = true;
    }
}