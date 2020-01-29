import * as React from 'react';
import { ICanvasController } from '../../controllers/canvases/ICanvasController';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { SvgCanvasComponent } from './svg/SvgCanvasComponent';
import { WebglCanvasController } from '../../controllers/canvases/webgl/WebglCanvasController';
import { WebglCanvasComponent } from './webgl/WebglCanvasComponent';
import { SvgCanvasToolsComponent } from './svg/SvgCanvasToolsComponent';

export function canvasFactory(controller: ICanvasController): JSX.Element {
    switch(controller.getId()) {
        case SvgCanvasController.id:
            return <SvgCanvasComponent canvasController={controller as SvgCanvasController}/>;
        case WebglCanvasController.id:
            return <WebglCanvasComponent canvasController={controller as WebglCanvasController}/>;
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}

export function canvasToolsFactory(controller: ICanvasController): CanvasToolsProps {
    switch(controller.getId()) {
        case SvgCanvasController.id:
            return {
                title: 'Tools',
                body: <SvgCanvasToolsComponent canvasController={controller as SvgCanvasController}/>
            }
    }

    return null;
}