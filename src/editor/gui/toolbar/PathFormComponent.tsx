import * as React from 'react';
import { SvgCanvasController } from '../../controllers/canvases/svg/SvgCanvasController';
import { PathView } from '../../controllers/canvases/svg/tools/path/PathTool';
import { AppContext, AppContextType } from '../Context';
import { ViewFormProps } from './viewComponentFactory';

export class PathFormComponent extends React.Component<ViewFormProps<PathView>> {
    static contextType = AppContext;
    context: AppContextType;

    constructor(props: ViewFormProps<PathView>) {
        super(props);

        this.props.canvasController.gameObjectForm.setRenderer(() => this.forceUpdate());
    }

    render() {
        return (
            <div>
                Path settings
            </div>
        );
    }
}