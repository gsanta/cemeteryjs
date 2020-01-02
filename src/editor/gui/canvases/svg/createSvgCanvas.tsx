import * as React from 'react';
import { SvgCanvasToolbarComponent } from './SvgCanvasToolbarComponent';
import { SvgCanvasComponent } from './SvgCanvasComponent';
import { ItemSettingsComponent } from './ItemSettingsComponent';
import { SvgCanvasController } from '../../../controllers/canvases/svg/SvgCanvasController';
import { EditorFacade } from '../../../controllers/EditorFacade';


export function createSvgCanvas(editorFacade: EditorFacade): [JSX.Element, JSX.Element, JSX.Element] {
    return [
        <SvgCanvasToolbarComponent canvasController={editorFacade.svgCanvasController as SvgCanvasController}/>,
        <SvgCanvasComponent canvasController={editorFacade.svgCanvasController as SvgCanvasController}/>,
        <ItemSettingsComponent canvasController={editorFacade.svgCanvasController as SvgCanvasController}/>
    ];
}