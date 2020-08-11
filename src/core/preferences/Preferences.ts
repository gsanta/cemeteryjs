import { SceneEditorPerspectiveName } from '../services/UI_PerspectiveService';
import { UI_Region } from '../plugins/UI_Plugin';


export interface Preferences {

    fullscreenRegion: UI_Region.Canvas1 | UI_Region.Canvas2;
    perspective: string;

    panelSizes: {
        Sidepanel: {
            minPixel: number,
            twoColumnRatio: number,
            threeColumnRatio: number,
        },
        Canvas1: {
            minPixel: number,
            twoColumnRatio: number,
            threeColumnRatio: number
        },
        Canvas2: {
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
        Sidepanel: {
            minPixel: 230,
            twoColumnRatio: 12,
            threeColumnRatio: 12
        },
        Canvas1: {
            minPixel: 500,
            twoColumnRatio: 88,
            threeColumnRatio: 44
        },
        Canvas2: {
            minPixel: 500,
            twoColumnRatio: 88,
            threeColumnRatio: 44
        }
    }
}