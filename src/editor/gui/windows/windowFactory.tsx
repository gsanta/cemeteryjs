import * as React from 'react';
import { CanvasController } from '../../canvas/CanvasController';
import { RendererController } from '../../renderer/RendererController';
import { RendererComponent } from '../../renderer/gui/RendererComponent';
import { CanvasComponent } from '../../canvas/gui/CanvasComponent';
import { CanvasToolbarComponent } from '../../canvas/gui/CanvasToolbarComponent';
import { AbstractCanvasController } from '../../common/AbstractCanvasController';

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