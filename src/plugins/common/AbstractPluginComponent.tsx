import * as React from 'react';
import { AppContext, AppContextType } from '../../core/gui/Context';
import { AbstractPlugin } from '../../core/AbstractPlugin';

export interface PluginProps {
    plugin: AbstractPlugin;
}

export abstract class AbstractPluginComponent<T extends PluginProps = PluginProps> extends React.Component<T> {
    static contextType = AppContext;
    context: AppContextType;
    protected ref: React.RefObject<HTMLDivElement>;
    protected noRegisterKeyEvents = false;

    constructor(props: T) {
        super(props);

        this.ref = React.createRef();
    }

    componentDidMount() {
        if (this.noRegisterKeyEvents) { return; }
        this.context.registry.services.hotkey.registerInput(this.ref.current);
    }

    componentWillUnmount() {
        if (this.noRegisterKeyEvents) { return; }
        this.context.registry.services.hotkey.unregisterInput(this.ref.current);
    }
}