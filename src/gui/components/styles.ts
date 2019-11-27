import { ICanvasController } from '../controllers/canvases/ICanvasController';

export const colors = {
    grey2: '#383838',
    grey3: '#595959',
    grey4: '#8F8C83',
    grey5: '#BFBDB6',
    textColor: '#EDF0EE',
    textColorDark: '#2E2E2E',
    active: '#F2F1ED',
    success: '#75B54A',
    info: '#5595B9',
    
    getCanvasBackground: (canvas: ICanvasController) => {
        return '#CCAC50';
    },

    getCanvasBackgroundLight: (canvas: ICanvasController) => {
        return '#EDD18A';
    } 
}

export const sizes = {
    inputHeight: '30px'
}