import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from './Context';
import { AccordionComponent } from './misc/AccordionComponent';
import { colors } from './styles';
import { GeneralFormComponent } from '../views/canvas/gui/forms/GeneralFormComponent';
import { LevelFormComponent } from '../views/canvas/gui/forms/LevelFormComponent';
import { formComponentFactory } from '../views/canvas/gui/forms/formComponentFactory';
import { GlobalFormComponent } from '../views/canvas/gui/forms/GlobalFormComponent';
import { CanvasView } from '../views/canvas/CanvasView';

export interface SidebarComponentProps {
    isEditorOpen: boolean;
    toggleEditorOpen: () => void;
}

const SidebarStyled = styled.div`
    height: 100%;
    background: ${colors.panelBackground};
    color: ${colors.textColor};
`;


export class SidebarComponent extends React.Component<SidebarComponentProps> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: SidebarComponentProps) {
        super(props);

    }
    
    componentDidMount() {
        this.context.controllers.getWindowControllers().forEach(controller => this.context.getServices().updateService().addSettingsRepainter(() => this.forceUpdate()));
    }

    render(): JSX.Element {
        return (
            <SidebarStyled>
                <AccordionComponent
                    elements={[
                        {
                            title: 'General Settings',
                            body: <GeneralFormComponent editor={this.context.controllers} {...this.props}/>
                        },
                        {
                            title: 'Level Settings',
                            body: <LevelFormComponent getStores={() => this.context.controllers.stores} window={this.context.controllers.getWindowControllerByName('canvas') as CanvasView} {...this.props}/>
                        },
                        {
                            title: 'Object Settings',
                            body: formComponentFactory(this.context.controllers, () => this.context.controllers.stores)
                        },
                        {
                            title: 'Global Settings',
                            body: <GlobalFormComponent editor={this.context.controllers}/>
                        }
                    ]}
                />
            </SidebarStyled>
        );
    }
}
