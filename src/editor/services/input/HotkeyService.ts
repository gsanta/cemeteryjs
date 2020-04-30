import { ServiceLocator } from '../ServiceLocator';
import { IKeyboardEvent, isCtrlOrCommandDown } from './KeyboardService';
import { IPointerEvent, PointerService, Wheel } from './PointerService';
import { Point } from '../../../misc/geometry/shapes/Point';

export type IHotkeyAction = (hotkeyEvent: IHotkeyEvent, getServices: () => ServiceLocator) => boolean;

export class HotkeyService {
    serviceName = 'hotkey-service'
    private inputs: HTMLElement[] = [];
    private primaryInput: HTMLElement;
    private hotkeys: Hotkey[] = [];
    getServices: () => ServiceLocator;

    constructor(getServices: () => ServiceLocator) {
        this.getServices = getServices;
    }

    registerInput(input: HTMLElement, isPrimaryInput = false) {
        this.inputs.push(input);
        if (isPrimaryInput) {
            this.primaryInput = input;
        }

        input.addEventListener('keydown', (e: KeyboardEvent) => {
            this.getServices().keyboard.onKeyDown(e);
            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }

    registerHotkey(hotKey: Hotkey): void {
        const hkWithSameId = this.hotkeys.find(hk => hk.id === hotKey.id);
        if (hkWithSameId) {
            throw new Error(`A hotkey is already registered with this id: ${hotKey.id}`);
        }

        this.hotkeys.push(hotKey);
    }

    unregisterHotkey(hotKeyId: string): void {
        this.hotkeys = this.hotkeys.filter(hk => hk.id !== hotKeyId);
    }

    hasHotkey(hotkeyId: string): boolean {
        return this.hotkeys.find(hk => hk.id === hotkeyId) !== undefined;
    }

    executeKeyboardEvent(keyboardEvent: IKeyboardEvent): boolean {
        const hotkeyEvent = this.convertKeyboardEvent(keyboardEvent);
        return this.executeIfMatches(hotkeyEvent);
    }

    executePointerEvent(mouseEvent: IPointerEvent): boolean {
        const hotkeyEvent = <IHotkeyEvent> mouseEvent;
        return this.executeIfMatches(hotkeyEvent);
    }

    private executeIfMatches(hotkeyEvent: IHotkeyEvent): boolean {
        const hotkey = this.hotkeys.find(h => h.matches(hotkeyEvent, this.getServices));

        return hotkey && this.executeHotkey(hotkey, hotkeyEvent);
    }

    focus(): void {
        this.primaryInput && this.primaryInput.focus();
    }

    blur(): void {
        this.primaryInput && this.primaryInput.blur();
    }

    private convertKeyboardEvent(event: IKeyboardEvent): IHotkeyEvent {
        return event;
    }

    private executeHotkey(hotKey: Hotkey, hotkeyEvent: IHotkeyEvent): boolean {
        this.focus();
        return hotKey.action(hotkeyEvent, this.getServices);
    }
}

export interface HotkeyTrigger {
    readonly keyCode: number;
    readonly keyCodeFunc: (hotkeyEvent: IHotkeyEvent) => boolean;
    readonly alt: boolean;
    readonly shift: boolean;
    readonly ctrlOrCommand: boolean;
    readonly wheel: boolean;
    readonly mouseDown: boolean;
    readonly pinch: boolean;
    readonly worksOnOverlays: boolean;
    readonly worksDuringMouseDown: boolean;
}

export interface IHotkeyEvent {
    keyCode?: number;
    isAltDown: boolean;
    isShiftDown: boolean;
    isCtrlDown: boolean;
    isMetaDown: boolean;
    pointers?: {id: number, pos: Point, isDown: boolean}[];
    deltaY?: number;
}

export class Hotkey {
    readonly id: string;
    readonly trigger: HotkeyTrigger;
    readonly action: IHotkeyAction;

    private static readonly defaultHotkeyTrigger: HotkeyTrigger = {
        keyCode: undefined,
        keyCodeFunc: undefined,
        alt: false,
        shift: false,
        ctrlOrCommand: false,
        wheel: false,
        pinch: false,
        worksOnOverlays: false,
        worksDuringMouseDown: false,
        mouseDown: false
    }

    constructor(id: string, trigger: Partial<HotkeyTrigger>, action: IHotkeyAction) {
        this.id = id;

        this.trigger = {...Hotkey.defaultHotkeyTrigger, ...trigger};
        this.action = action;
    }

    matches(hotkeyEvent: IHotkeyEvent, getServices: () => ServiceLocator): boolean {
        const b = (
            (this.trigger.keyCode === undefined || hotkeyEvent.keyCode === this.trigger.keyCode) &&
            hotkeyEvent.isAltDown === this.trigger.alt &&
            (this.trigger.shift === undefined || hotkeyEvent.isShiftDown === this.trigger.shift) &&
            isCtrlOrCommandDown(<IKeyboardEvent> hotkeyEvent) === this.trigger.ctrlOrCommand &&
            this.wheelMatch(getServices().pointer) === this.trigger.wheel &&
            this.mouseDownMatch(hotkeyEvent) &&
            this.keyCodeFuncMatch(hotkeyEvent)
        );
        return b;
    }

    private wheelMatch(pointerService: PointerService): boolean {
        return pointerService.wheel !== Wheel.IDLE;
    }

    private keyCodeFuncMatch(hotkeyEvent: IHotkeyEvent) {
        if (!this.trigger.keyCodeFunc) { return true; }

        return hotkeyEvent.keyCode !== undefined && this.trigger.keyCodeFunc(hotkeyEvent);
    }

    private mouseDownMatch(hotkeyEvent: IHotkeyEvent) {
        return this.trigger.mouseDown === hotkeyEvent.pointers[0].isDown
    }
}
