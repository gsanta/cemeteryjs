import { SceneEditorPerspectiveName } from '../services/UI_PerspectiveService';
import { UI_Region } from '../models/UI_Panel';


export interface Preferences {
    fullscreenRegion: UI_Region.Canvas1 | UI_Region.Canvas2;
    perspective: string;

    panelSizes: {
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

    colors: {
        green: string;
        red: string;
        blue: string;
    }
}

export const defaultPreferences: Preferences = {
    fullscreenRegion: undefined,
    perspective: SceneEditorPerspectiveName,

    panelSizes: {
        Canvas1: {
            minPixel: 500,
            twoColumnRatio: 100,
            threeColumnRatio: 50
        },
        Canvas2: {
            minPixel: 500,
            twoColumnRatio: 100,
            threeColumnRatio: 50
        }
    },

    colors: {
        green: 'green',
        red: 'red',
        blue: 'blue'
    }
}