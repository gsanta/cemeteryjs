import { MonacoConfig } from '../gui_models/MonacoConfig';
import * as monaco from 'monaco-editor';
import { debounce } from '../../model/utils/Functions';

const THEME = 'nightshiftsTheme';
const LANGUAGE = 'nightshiftsLanguage';

export class TextEditorService {
    editor: any;

    constructor(monacoConfig: typeof MonacoConfig) {
        monacoConfig;

        monaco.languages.register({ id: LANGUAGE });

        monaco.languages.setMonarchTokensProvider(LANGUAGE, {
            tokenizer: <any> {
                root: monacoConfig.languageTokens
            }
        });

        monaco.editor.defineTheme(THEME, <any> {
            base: 'vs-dark',
            inherit: true,
            rules: monacoConfig.colorRules,
            colors: {
                'editor.foreground': '#000000',
                // 'editor.background': '#EDF9FA',
                // 'editorCursor.foreground': '#8B0000',
                // 'editor.lineHighlightBackground': '#0000FF20',
                // 'editorLineNumber.foreground': '#008800',
                // 'editor.selectionBackground': '#88000030',
                // 'editor.inactiveSelectionBackground': '#88000015'
            }
        });
    }

    createEditor(element: HTMLDivElement, content: string) {
        const editor = monaco.editor.create(element, {
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
}