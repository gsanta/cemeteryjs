import * as React from 'react';
import { AppContext, AppContextType } from '../../core/gui/Context';

export class CanvasComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;
    protected ref: React.RefObject<HTMLDivElement>;

    constructor(props: {}) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        this.context.registry.services.hotkey.registerInput(this.ref.current);
    }

    componentWillUnmount() {
        this.context.registry.services.hotkey.unregisterInput(this.ref.current);
    }
}