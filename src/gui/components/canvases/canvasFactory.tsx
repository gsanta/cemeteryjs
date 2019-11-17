import { ControllerFacade } from '../../controllers/ControllerFacade';
import { TextCanvasController } from '../../controllers/canvases/text/TextCanvasController';
import { TextCanvasComponent } from './text/TextCanvasComponent';
import * as React from 'react';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { SvgCanvasComponent } from './svg/SvgCanvasComponent';

export function createCanvas(controllers: ControllerFacade) {

    switch(controllers.getActiveCanvas().getId()) {
        case TextCanvasController.id:
            return <TextCanvasComponent canvasController={controllers.getActiveCanvas() as TextCanvasController}/>
        case SvgCanvasController.id:
            return <SvgCanvasComponent canvasController={controllers.getActiveCanvas() as SvgCanvasController}/>
    }
}