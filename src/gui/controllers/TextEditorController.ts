import { MonacoConfig } from '../views/MonacoConfig';
import { debounce } from '../../model/utils/Functions';

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

export class TextEditorController {
    editor: any;
    text: string = initialText;

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

    resize() {
        this.editor.layout();
    }

    setText(text: string) {
        this.text = text;
    }
}