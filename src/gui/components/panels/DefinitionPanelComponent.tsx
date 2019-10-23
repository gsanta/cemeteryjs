import * as React from 'react';
import './DefinitionPanelComponent.scss';
import { GuiServiceFacade } from '../../gui_services/GuiServiceFacade';
import { Input } from '../forms/Input';

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
            <div><Input type="text" value={def.type} onChange={() => null} placeholder="name"/></div>
        ))

        return (
            <div className="definition-panel">
                <div className="names-column">
                    {names}
                </div>
                <div className="properties-columnt">
                </div>
            </div>
        );
    }
};