import * as React from 'react';
import './Editor.css';
import * as monaco from 'monaco-editor';

interface EditorState {
    map: string;
}

function debounce(func, wait) {
	let timeout;
	return function() {
		const context = this, args = arguments;
		const later = function() {
			timeout = null;
			func.apply(context, args);
        };

		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};

export interface EditorProps {
    onModelChanged(content: string): void;
    initialModel: string;
}

export class Editor extends React.Component<EditorProps, EditorState> {
    private contentEditable: React.RefObject<HTMLDivElement>;

    constructor(props: EditorProps) {
        super(props);
        this.contentEditable = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleChange = debounce(this.handleChange, 500)

        this.state = {
            map: this.props.initialModel
        }
    }

    componentDidMount() {
        monaco.languages.register({ id: 'nightshiftsLanguage' });

        monaco.languages.setMonarchTokensProvider('nightshiftsLanguage', {
            tokenizer: {
                root: [
                    [/W/, "character-W"],
                    [/-/, "character--"],
                    [/I/, "character-I"],
                    [/D/, "character-D"],
                    [/E/, "character-E"],
                ]
            }
        });

        monaco.editor.defineTheme('nightshiftsTheme', {
            base: 'vs',
            inherit: false,
            rules: [
                { token: 'character-W', foreground: '000000' },
                { token: 'character--', foreground: 'dbd9d5' },
                { token: 'character-I', foreground: '3e70f7' },
                { token: 'character-D', foreground: 'fc7a00' },
                { token: 'character-E', foreground: 'e6b000' },
            ]
        });


        const editor = monaco.editor.create(document.getElementById('editor'), {
            value: this.state.map,
            theme: 'nightshiftsTheme',
            language: 'nightshiftsLanguage'
          });

        editor.onDidChangeModelContent(() => {
            this.handleChange(editor.getValue());
        })
    }

    render(): JSX.Element {
        return (
            <div className="editor" id="editor"></div>
        );
    }


    handleChange(model: string) {
        this.props.onModelChanged(model);
    };
}