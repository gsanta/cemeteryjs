import * as React from 'react';
import styled from 'styled-components';
import { colors } from './styles';
import { AppContext, AppContextType } from './Context';
import { UI_Builder } from '../UI_Builder';
import { UI_Region } from '../../models/UI_Panel';
import { Point } from '../../../utils/geometry/shapes/Point';

export interface SidebarComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
}

const SidebarStyled = styled.div`
    height: 100%;
    background: ${colors.panelBackground};
    color: ${colors.textColor};
    position: absolute;
    top: ${(props: {elementPos: Point}) => `${props.elementPos.y}px`};
    left: ${(props: {elementPos: Point}) => `${props.elementPos.x}px`};
    width: 300px;
    height: 500px;
    z-index: 1000;
    overflow-y: auto;
    -webkit-box-shadow: 7px 7px 5px 0px rgba(50, 50, 50, 0.75);
    -moz-box-shadow:    7px 7px 5px 0px rgba(50, 50, 50, 0.75);
    box-shadow:         7px 7px 5px 0px rgba(50, 50, 50, 0.75);

    .ce-row {
        margin: 3px;
    }

    .ce-sidepanel-header {
        cursor: move;
        width: 100%;
        height: 30px;
        padding: 5px 2px;
        background: ${colors.grey1};
        color: ${colors.textColorDark};
        font-weight: bold;
        text-align: center;
    }
`;

interface SidebarComponentState {
    cursorPos?: Point;
    elementPos: Point;
}

export class SidePanelComponent extends React.Component<SidebarComponentProps, SidebarComponentState> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: SidebarComponentProps) {
        super(props);

        this.state = {
            elementPos: new Point(20, 50)
        }
    }

    componentDidMount() {
        this.context.registry.services.render.setRenderer(UI_Region.Sidepanel, () => this.forceUpdate());
    }

    
    render(): JSX.Element {
        const plugins = this.context.registry.ui.helper.getSidebarPanels();
        const components = plugins.map(plugin => new UI_Builder(this.context.registry).build(plugin));

        return (
            <SidebarStyled elementPos={this.state.elementPos}>
                <div 
                    className="ce-sidepanel-header"
                    onMouseDown={e => this.onMouseDown(e.nativeEvent)}
                    onMouseUp={e => this.onMouseUp()}
                >Sidepanel</div>
                {components}
            </SidebarStyled>
        );
    }

    private onMouseDown(e: MouseEvent) {
        e.preventDefault();

        this.setState({cursorPos: new Point(e.clientX, e.clientY)});

        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
    
    private onMouseMove(e: MouseEvent) {
        e.preventDefault();

        if (!this.state.cursorPos) {
            return;
        }

        const deltaPos = new Point(this.state.cursorPos.x - e.clientX, this.state.cursorPos.y - e.clientY);

        this.setState({
            cursorPos: new Point(e.clientX, e.clientY),
            elementPos: new Point(this.state.elementPos.x - deltaPos.x, this.state.elementPos.y - deltaPos.y)
        });
      }
    
    private onMouseUp() {
        this.setState({cursorPos: undefined});
    }
}
