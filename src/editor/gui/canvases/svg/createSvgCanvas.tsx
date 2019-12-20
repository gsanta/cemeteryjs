import * as React from 'react';
import { SvgCanvasController } from '../../../controllers/formats/svg/SvgCanvasController';
import { SvgCanvasToolbarComponent } from './SvgCanvasToolbarComponent';
import { SvgCanvasComponent } from './SvgCanvasComponent';
import { ItemSettingsComponent } from './ItemSettingsComponent';
import { ControllerFacade } from '../../../controllers/ControllerFacade';


export function createSvgCanvas(controllers: ControllerFacade): [JSX.Element, JSX.Element, JSX.Element] {
    return [
        <SvgCanvasToolbarComponent canvasController={controllers.svgCanvasController as SvgCanvasController}/>,
        <SvgCanvasComponent canvasController={controllers.svgCanvasController as SvgCanvasController}/>,
        <ItemSettingsComponent canvasController={controllers.svgCanvasController as SvgCanvasController}/>
    ];
}