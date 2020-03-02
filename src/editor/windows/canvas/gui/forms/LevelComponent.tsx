import * as React from 'react';
import { GridComponent } from './GridComponent';
import { CanvasWindow } from '../../CanvasWindow';
import { LevelFormPropType } from '../../forms/LevelForm';

export interface LevelProps {
    window: CanvasWindow;
}

export class LevelComponent extends React.Component<LevelProps> {


    render() {
        const level = this.props.window.levelForm.getVal(LevelFormPropType.Level);
        return <GridComponent value={level as number} onChange={(val) => this.props.window.levelForm.updateProp(val, LevelFormPropType.Level)}/>
    }
}