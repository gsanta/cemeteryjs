import * as React from 'react';
import './Editor.css';

export class Editor extends React.Component {

    render(): JSX.Element {
        return (
            <div contentEditable={true} className="editor">


            </div>
        )
    }
}