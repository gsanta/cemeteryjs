import { MonacoConfig } from '../../../configs/MonacoConfig';
import { debounce } from '../../../../model/utils/Functions';
import { ControllerFacade } from '../../ControllerFacade';
import { IEditorController } from '../IEditorController';
import { IEditorWriter } from '../IEditorWriter';
import { TextEditorWriter } from './TextEditorWriter';
import { IEditorReader } from '../IEditorReader';
import { TextEditorReader } from './TextEditorReader';

const THEME = 'nightshiftsTheme';
const LANGUAGE = 'nightshiftsLanguage';

const initialText = 
`*****************************************************************************************************************************************
*WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW*
*W-------------------------------WRR-------------------------------------------------------------------------------------------------RRW*
*W-------------------------------WRR-------------------------------------------------------------------------------------------------RRW*
*W-------------------------------W-----------------------------------------------------------------------------------------------------W*
*W-------------------------------W-----------------------------------------------------------------------------------------------------W*
*W-------------------------------W-----------------------------------------------------------------------------------------------------W*
*W-------------------------------WWWWWWWWWWWWWWWWWWWWWWWWWWWWWDDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWDDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWDDDDWW*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------W-------------------W-------------W---------------------------------W---------------------------------W*
*W-------------------------------WWWWWWWWWWWWWWWWWWWWW-------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*W-------------------------------W---------------------------------W---------------------------------W---------------------------------W*
*WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWIIIIWWWWWWWWWWWWWIIIWWWWWWWWWWWWWWIIIIWWWWWWWWWWWWWIIIWWWWWWWWWWWWWWIIIIWWWWWWWWWWWWWIIIWWWWWWWWWWW*
*****************************************************************************************************************************************`;

export class TextEditorController implements IEditorController {
    static id = 'text-editor';
    editor: any;
    text: string = initialText;
    writer: IEditorWriter;
    reader: IEditorReader;
    
    private controllers: ControllerFacade;

    constructor(controllers: ControllerFacade) {
        this.controllers = controllers;
        this.writer = new TextEditorWriter(this);
        this.reader = new TextEditorReader(this, controllers.worldItemDefinitionModel);
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