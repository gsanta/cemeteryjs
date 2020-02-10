import * as React from 'react';
import { CanvasController } from '../../controllers/canvases/svg/CanvasController';
import { AbstractCanvasController } from '../../controllers/canvases/AbstractCanvasController';
import { SvgCanvasComponent } from './svg/SvgCanvasComponent';
import { WebglCanvasController } from '../../controllers/canvases/webgl/WebglCanvasController';
import { WebglCanvasComponent } from './webgl/WebglCanvasComponent';
import { SvgCanvasToolsComponent } from './svg/SvgCanvasToolsComponent';

export function canvasFactory(controller: AbstractCanvasController): JSX.Element {
    switch(controller.getId()) {
        case CanvasController.id:
            return <SvgCanvasComponent canvasController={controller as CanvasController}/>;
        case WebglCanvasController.id:
            return <WebglCanvasComponent canvasController={controller as WebglCanvasController}/>;
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}

export function canvasToolsFactory(controller: AbstractCanvasController): CanvasToolsProps {
    switch(controller.getId()) {
        case CanvasController.id:
            return {
                title: 'Tools',
                body: <SvgCanvasToolsComponent canvasController={controller as CanvasController}/>
            }
    }

    return null;
}