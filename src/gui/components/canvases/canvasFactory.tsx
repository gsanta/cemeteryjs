import { ControllerFacade } from '../../controllers/ControllerFacade';
import { TextCanvasController } from '../../controllers/canvases/text/TextCanvasController';
import { TextCanvasComponent } from './text/TextCanvasComponent';
import * as React from 'react';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { SvgCanvasComponent } from './svg/SvgCanvasComponent';
import { SvgCanvasToolbar } from './svg/SvgCanvasToolbar';

export function createCanvas(controllers: ControllerFacade): [JSX.Element, JSX.Element] {

    switch(controllers.getActiveCanvas().getId()) {
        case TextCanvasController.id:
            return [
                null,
                <TextCanvasComponent canvasController={controllers.getActiveCanvas() as TextCanvasController}/>
            ];
        case SvgCanvasController.id:
            return [
                <SvgCanvasToolbar canvasController={controllers.getActiveCanvas() as SvgCanvasController}/>,
                <SvgCanvasComponent canvasController={controllers.getActiveCanvas() as SvgCanvasController}/>
            ];
    }
}