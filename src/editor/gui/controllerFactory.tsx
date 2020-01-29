import * as React from 'react';
import { ICanvasController } from '../controllers/canvases/ICanvasController';
import { SvgCanvasController } from '../controllers/canvases/svg/SvgCanvasController';
import { SvgCanvasComponent } from './canvases/svg/SvgCanvasComponent';
import { WebglCanvasController } from '../controllers/canvases/webgl/WebglCanvasController';
import { WebglCanvasComponent } from './canvases/webgl/WebglCanvasComponent';

export function controllerFactory(controller: ICanvasController): JSX.Element {
    switch(controller.getId()) {
        case SvgCanvasController.id:
            return <SvgCanvasComponent canvasController={controller as SvgCanvasController}/>;
        case WebglCanvasController.id:
            return <WebglCanvasComponent canvasController={controller as WebglCanvasController}/>;
    }
}