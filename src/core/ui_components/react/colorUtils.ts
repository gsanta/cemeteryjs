import { Color3 } from "babylonjs";

export function toHexString(color: string) {
    switch(color) {
        case 'green':
            return Color3.Green().toHexString();
        case 'red':
            return Color3.Red().toHexString();
        case 'blue':
            return Color3.Blue().toHexString();
        case 'white':
            return Color3.White().toHexString();
        case 'yellow':
            return Color3.Yellow().toHexString();
        case 'black':
        case undefined:
            return Color3.White().toHexString();
        default:
            return color;
    }
}