import * as React from 'react';


export class PathMarkersComponent extends React.Component {

    render(): JSX.Element[] {

        return [
            <marker id="arrow" viewBox="0 0 10 10"  markerWidth="15" markerHeight="15"  refX="10" refY="5" orient="auto">
                <line x1="0" y1="0" x2="10" y2="5" stroke="black"/>
                <line x1="0" y1="10" x2="10" y2="5" stroke="black"/>
            </marker>
        ]
    }
}