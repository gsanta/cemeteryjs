import { SceneEditorPerspectiveName } from '../services/UI_PerspectiveService';
import { UI_Region } from '../UI_Plugin';


export interface Preferences {

    fullscreenRegion: UI_Region.Canvas1 | UI_Region.Canvas2;
    perspective: string;

    panelSizes: {
        sidepanel: {
            minPixel: number,
            currRatio: number
        },
        canvas1: {
            minPixel: number,
            currRatio: number
        },
        canvas2: {
            minPixel: number,
            currRatio: number
        }
    }
}

export const defaultPreferences: Preferences = {
    fullscreenRegion: undefined,
    perspective: SceneEditorPerspectiveName,

    panelSizes: {
        sidepanel: {
            minPixel: 230,
            currRatio: 12
        },
        canvas1: {
            minPixel: 500,
            currRatio: 44
        },
        canvas2: {
            minPixel: 500,
            currRatio: 44
        }
    }
}