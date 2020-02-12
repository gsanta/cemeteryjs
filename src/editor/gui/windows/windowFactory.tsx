import * as React from 'react';
import { CanvasController } from '../../controllers/canvases/svg/CanvasController';
import { AbstractCanvasController } from '../../controllers/canvases/AbstractCanvasController';
import { WebglCanvasController } from '../../controllers/canvases/webgl/WebglCanvasController';
import { RendererComponent } from './renderer/RendererComponent';
import { CanvasToolbarComponent } from './canvas/CanvasToolbarComponent';
import { CanvasComponent } from './canvas/CanvasComponent';

export function windowFactory(controller: AbstractCanvasController): JSX.Element {
    switch(controller.getId()) {
        case CanvasController.id:
            return <CanvasComponent canvasController={controller as CanvasController}/>;
        case WebglCanvasController.id:
            return <RendererComponent canvasController={controller as WebglCanvasController}/>;
    }

    return null;
}

export interface CanvasToolsProps {
    title: string;
    body: JSX.Element | JSX.Element[];
}

export function windowToolsFactory(controller: AbstractCanvasController): CanvasToolsProps {
    switch(controller.getId()) {
        case CanvasController.id:
            return {
                title: 'Tools',
                body: <CanvasToolbarComponent canvasController={controller as CanvasController}/>
            }
    }

    return null;
}