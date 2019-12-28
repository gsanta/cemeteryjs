import * as React from 'react';
import { SvgCanvasToolbarComponent } from './SvgCanvasToolbarComponent';
import { SvgCanvasComponent } from './SvgCanvasComponent';
import { ItemSettingsComponent } from './ItemSettingsComponent';
import { ControllerFacade } from '../../../controllers/ControllerFacade';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';


export function createSvgCanvas(controllers: ControllerFacade): [JSX.Element, JSX.Element, JSX.Element] {
    return [
        <SvgCanvasToolbarComponent canvasController={controllers.svgCanvasController as SvgCanvasController}/>,
        <SvgCanvasComponent canvasController={controllers.svgCanvasController as SvgCanvasController}/>,
        <ItemSettingsComponent canvasController={controllers.svgCanvasController as SvgCanvasController}/>
    ];
}