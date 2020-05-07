import { Registry } from '../../../editor/Registry';

export enum Platform {
    WINDOWS = 'Windows',
    LINUX = 'Linux',
    MAC = 'Mac',
    UNKNOWN = 'Unknown'
}

function getPlatform(): Platform {
    if (!navigator || !navigator.appVersion) {
        return Platform.UNKNOWN;
    }

    if (navigator.appVersion.indexOf("Win") != -1) {
        return Platform.WINDOWS;
    } else if (navigator.appVersion.indexOf("Mac") != -1) {
        return Platform.MAC;
    } else if (navigator.appVersion.indexOf("Linux") != -1) {
        return Platform.LINUX;
    }

    return Platform.UNKNOWN;
}


export enum Keyboard {
    Enter = 13,
    w = 87,
    a = 65,
    d = 68,
    s = 83,
    e = 69,
    Space = 32
}

export interface IKeyboardEvent {
    keyCode: number;
    isAltDown: boolean;
    isShiftDown: boolean;
    isCtrlDown: boolean;
    isMetaDown: boolean;
}

export class KeyboardService {
    serviceName = 'keyboard-service'

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }
    
    onKeyDown(e: KeyboardEvent): void {
        this.registry.services.hotkey.executeKeyboardEvent(this.convertEvent(e));
        this.registry.services.view.getHoveredView().getActiveTool()?.keydown(this.convertEvent(e));
        this.registry.services.update.runScheduledTasks();

    }

    onKeyUp(e: KeyboardEvent): void {
        this.registry.services.view.getHoveredView().getActiveTool()?.keyup(this.convertEvent(e));
        this.registry.services.update.runScheduledTasks();
    }

    private convertEvent(event: KeyboardEvent): IKeyboardEvent {
        return {
            keyCode: event.keyCode,
            isAltDown: !!event.altKey,
            isShiftDown: !!event.shiftKey,
            isCtrlDown: !!event.ctrlKey,
            isMetaDown: !!event.metaKey
        }
    }
}

export function isCtrlOrCommandDown(event: IKeyboardEvent): boolean {
    const platform = getPlatform();

    switch (platform) {
        case Platform.MAC:
            return event.isMetaDown;
        case Platform.WINDOWS:
        case Platform.LINUX:
            return event.isCtrlDown;
        default:
            return event.isCtrlDown || event.isMetaDown;
    }
}