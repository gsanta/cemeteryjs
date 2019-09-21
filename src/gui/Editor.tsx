import * as React from 'react';
import './Editor.css';
import ContentEditable from 'react-contenteditable';
import * as monaco from 'monaco-editor';

interface EditorState {
    map: string;
}

const map = `
WWWWWWWWWIIWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W-----------------==H=H==-------W-------------------W
W-----------------=TTTTT=-------W-------------------W
W-----------------=TTTTT=-------W-------------------W
W-----------------==H=H==-------W-------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
W---------------------------------------------------W
W---------------------------------------------------W
WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
WEEEEE-----OOOOO-------------TTTTTW-----------------W
WEEEEE-----OOOOO-------------TTTTTW-----------------W
W--------XX----TTT---------------OD-----------------I
W--------XX----TTT------OOOOO----OD-----------------I
WOOO--------------------OOOOO----OW-----------------W
WWWWIIIIWWWWWWWWWWWWWDDDWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
`;

export class Editor extends React.Component<{}, EditorState> {
    private contentEditable: React.RefObject<HTMLDivElement>;

    constructor(props: {}) {
        super(props);
        this.contentEditable = React.createRef();


        this.state = {
            map//: Array(15000).join('-')
        }
    }

    componentDidMount() {
        // Register a new language
        monaco.languages.register({ id: 'mySpecialLanguage' });

        // Register a tokens provider for the language
        monaco.languages.setMonarchTokensProvider('mySpecialLanguage', {
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

        // Define a new theme that contains only rules that match this language
        monaco.editor.defineTheme('myCoolTheme', {
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


        monaco.editor.create(document.getElementById('editor'), {
            value: this.state.map,
            theme: 'myCoolTheme',
            language: 'mySpecialLanguage'
          });
    }

    render(): JSX.Element {
        return (
            <div className="editor" id="editor"></div>
        )
        // return (
        //     <ContentEditable
        //         innerRef={this.contentEditable}
        //         html={this.state.map} // innerHTML of the editable div
        //         disabled={false}       // use true to disable editing
        //         onChange={this.handleChange} // handle innerHTML change
        //         tagName='article' // Use a custom HTML tag (uses a div by default)
        //         className="editor"
        //     />
        // )
    }


    handleChange(evt) {
        this.setState({map: evt.target.value});
    };
}