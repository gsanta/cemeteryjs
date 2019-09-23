import { MonacoConfig } from '../gui_models/editor/MonacoConfig';
import * as monaco from 'monaco-editor';
import { debounce } from '../../model/utils/Functions';

const THEME = 'nightshiftsTheme';
const LANGUAGE = 'nightshiftsLanguage';

export class TextEditorService {

    constructor(monacoConfig: typeof MonacoConfig) {
        monacoConfig;

        monaco.languages.register({ id: LANGUAGE });

        monaco.languages.setMonarchTokensProvider(LANGUAGE, {
            tokenizer: <any> {
                root: monacoConfig.languageTokens
            }
        });

        monaco.editor.defineTheme(THEME, <any> {
            base: 'vs',
            inherit: false,
            rules: monacoConfig.colorRules
        });
    }

    getEditor(element: HTMLDivElement, content: string) {
        const editor = monaco.editor.create(element, {
            value: content,
            theme: THEME,
            language: LANGUAGE,
            minimap: {
                enabled: false
            }
        });

        return {
            onChange: (callback: (newContent: string) => void) => {
                const debounced = debounce(callback, 1000);
                editor.onDidChangeModelContent(() => {
                    debounced(editor.getValue());
                });
            }
        }

    }
}