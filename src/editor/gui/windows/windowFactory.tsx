import * as React from 'react';
import { CanvasController } from '../../controllers/windows/canvas/CanvasController';
import { AbstractCanvasController } from '../../controllers/windows/AbstractCanvasController';
import { RendererController } from '../../controllers/windows/renderer/RendererController';
import { RendererComponent } from './renderer/RendererComponent';
import { CanvasToolbarComponent } from './canvas/CanvasToolbarComponent';
import { CanvasComponent } from './canvas/CanvasComponent';

export function windowFactory(controller: AbstractCanvasController): JSX.Element {
    switch(controller.getId()) {
        case CanvasController.id:
            return <CanvasComponent canvasController={controller as CanvasController}/>;
        case RendererController.id:
            return <RendererComponent canvasController={controller as RendererController}/>;
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