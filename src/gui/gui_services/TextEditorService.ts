import { MonacoConfig } from '../gui_models/editor/MonacoConfig';
import * as monaco from 'monaco-editor';

export class TextEditorService {
    private monacoConfig: typeof MonacoConfig

    constructor(monacoConfig: typeof MonacoConfig) {
        this.monacoConfig = monacoConfig;

        monaco.languages.register({ id: 'nightshiftsLanguage' });

        monaco.languages.setMonarchTokensProvider('nightshiftsLanguage', {
            tokenizer: <any> {
                root: monacoConfig.languageTokens
            }
        });

        monaco.editor.defineTheme('nightshiftsTheme', <any> {
            base: 'vs',
            inherit: false,
            rules: monacoConfig.colorRules
        });
    }

    getEditor() {
        const editor = monaco.editor.create(document.getElementById('editor'), {
            value: this.state.map,
            theme: 'nightshiftsTheme',
            language: 'nightshiftsLanguage'
          });

        editor.onDidChangeModelContent(() => {
            this.handleChange(editor.getValue());
        })
    }
}