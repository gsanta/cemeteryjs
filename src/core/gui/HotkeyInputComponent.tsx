
import * as React from "react";
import styled from "styled-components";
import { Registry } from "../Registry";

const HotkeyStyled = styled.input`
    position: absolute;
    z-index: -10;
    top: -100;
    left: -100;
`;

export class HotkeyInputComponent extends React.Component<{registry: Registry}> {

    private readonly inputRef = React.createRef<HTMLInputElement>();

    componentDidMount(): void {
        this.props.registry.services.hotkey.registerInput(this.inputRef.current, true);
    }

    render() {
        return <HotkeyStyled ref={this.inputRef} readOnly={true} type="text" />;
    }
}
