import { SceneEditorPerspectiveName } from '../services/UI_PerspectiveService';
import { UI_Region } from '../UI_Plugin';


export interface Preferences {

    fullscreenRegion: UI_Region.Canvas1 | UI_Region.Canvas2;
    perspective: string;

    panelSizes: {
        sidepanel: {
            minPixel: number,
            twoColumnRatio: number,
            threeColumnRatio: number,
        },
        canvas1: {
            minPixel: number,
            twoColumnRatio: number,
            threeColumnRatio: number
        },
        canvas2: {
            minPixel: number,
            twoColumnRatio: number,
            threeColumnRatio: number
        }
    }
}

export const defaultPreferences: Preferences = {
    fullscreenRegion: undefined,
    perspective: SceneEditorPerspectiveName,

    panelSizes: {
        sidepanel: {
            minPixel: 230,
            twoColumnRatio: 12,
            threeColumnRatio: 12
        },
        canvas1: {
            minPixel: 500,
            twoColumnRatio: 44,
            threeColumnRatio: 88
        },
        canvas2: {
            minPixel: 500,
            twoColumnRatio: 44,
            threeColumnRatio: 88
        }
    }
}