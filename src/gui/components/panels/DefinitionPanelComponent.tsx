import * as React from 'react';
import './DefinitionPanelComponent.scss';
import { GuiServiceFacade } from '../../gui_services/GuiServiceFacade';

const definitions = [
    {
        type: 'wall',
        char: 'W',
        model: 'wall.babylon',
        scale: 3,
        translateY: 2,
        materials: ['wall.jpg'],
        isBorder: false
    },
    {
        type: 'door',
        char: 'W',
        model: 'wall.babylon',
        scale: 3,
        translateY: 2,
        materials: ['wall.jpg'],
        isBorder: false
    },
    {
        type: 'table',
        char: 'W',
        model: 'wall.babylon',
        scale: 3,
        translateY: 2,
        materials: ['wall.jpg'],
        isBorder: false
    }
]

export interface DefinitionPanelProps {
    services: GuiServiceFacade;
}

export class DefinitionPanelComponent extends React.Component<DefinitionPanelProps> {
    render() {
        const meshDescriptors = this.props.services.definitionService.meshDescriptors;

        const names = meshDescriptors.map(def => (
            <div><input type="text" value={def.type}></input></div>
        ))

        return (
            <div style={{ display: 'flex'}}>
                <div style={{width: '150px'}}>
                    {names}
                </div>
                <div style={{width: '300px'}}>other</div>
            </div>
        );
    }
};