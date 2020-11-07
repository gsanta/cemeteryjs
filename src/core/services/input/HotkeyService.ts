import { Point } from '../../../utils/geometry/shapes/Point';
import { Registry } from '../../Registry';
import { IKeyboardEvent, isCtrlOrCommandDown } from './KeyboardService';
import { PointerService, Wheel } from './PointerService';

export type IHotkeyAction = (hotkeyEvent: IHotkeyEvent, registry: Registry) => boolean;

export class HotkeyService {
    private inputs: HTMLElement[] = [];
    private primaryInput: HTMLElement;
    private hotkeys: Hotkey[] = [];
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    registerInput(input: HTMLElement, isPrimaryInput = false) {
        this.inputs.push(input);
        if (isPrimaryInput) {
            this.primaryInput = input;
        }

        input.addEventListener('keydown',  this.registry.services.keyboard.keyDown);
        input.addEventListener('keyup', this.registry.services.keyboard.keyUp);
    }

    unregisterInput(input: HTMLElement) {
        input.removeEventListener('keydown',  this.registry.services.keyboard.keyDown);
        input.removeEventListener('keyup', this.registry.services.keyboard.keyUp);
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

    executeHotkey(hotkeyEvent: IHotkeyEvent): boolean {
        const executedHotkeys = this.hotkeys.filter(h => h.hotkey(hotkeyEvent));

        if (this.registry.plugins.getHoveredPlugin()) {
            // TODO it should also return with the executed hotkeys
            this.registry.ui.helper.hoveredPanel.toolController.getAll().filter(tool => tool.hotkey(hotkeyEvent));
        }

        if (executedHotkeys.length > 0) {
            return true;
        }
        return false;
    }

    focus(): void {
        // this.primaryInput && this.primaryInput.focus();
    }

    blur(): void {
        // this.primaryInput && this.primaryInput.blur();
    }
}

export interface HotkeyTrigger {
    readonly keyCodes: number[];
    readonly keyCodeFunc: (hotkeyEvent: IHotkeyEvent) => boolean;
    readonly alt: boolean;
    readonly shift: boolean;
    readonly ctrlOrCommand: boolean;
    readonly wheel: boolean;
    readonly mouseDown: boolean;
    readonly pinch: boolean;
    readonly worksOnOverlays: boolean;
    readonly worksDuringMouseDown: boolean;
    readonly hover: boolean;
    readonly unhover: boolean;
}

export interface IHotkeyEvent {
    keyCode?: number;
    isAltDown?: boolean;
    isShiftDown?: boolean;
    isCtrlDown?: boolean;
    isMetaDown?: boolean;
    pointers?: {id: number, pos: Point, isDown: boolean}[];
    deltaY?: number;
    isHover?: boolean;
    isUnhover?: boolean;
    isKeyup?: boolean;
}

export interface IHotkey {
    hotkey(hotkeyEvent: IHotkeyEvent): boolean;
}

export const defaultHotkeyTrigger: HotkeyTrigger = {
    keyCodes: [],
    keyCodeFunc: undefined,
    alt: false,
    shift: false,
    ctrlOrCommand: false,
    wheel: false,
    pinch: false,
    worksOnOverlays: false,
    worksDuringMouseDown: false,
    mouseDown: false,
    hover: false,
    unhover: false
}

export class Hotkey implements IHotkey {
    readonly id: string;
    readonly trigger: HotkeyTrigger;
    readonly action: IHotkeyAction;
    protected registry: Registry;

    constructor(id: string, trigger: Partial<HotkeyTrigger>, action: IHotkeyAction, registry: Registry) {
        this.id = id;
        this.registry = registry;

        this.trigger = {...defaultHotkeyTrigger, ...trigger};
        this.action = action;
    }

    hotkey(hotkeyEvent: IHotkeyEvent): boolean {
        if (checkHotkeyAgainstTrigger(hotkeyEvent, this.trigger, this.registry)) {
            this.action(hotkeyEvent, this.registry);
            return true;
        }
        return false;
    }
}

export function checkHotkeyAgainstTrigger(hotkeyEvent: IHotkeyEvent, hotkeyTrigger: HotkeyTrigger, registry: Registry) {
    return (
        keyCodesMatch(hotkeyEvent, hotkeyTrigger) &&
        hotkeyEvent.isAltDown === hotkeyTrigger.alt &&
        (hotkeyTrigger.shift === undefined || hotkeyEvent.isShiftDown === hotkeyTrigger.shift) &&
        isCtrlOrCommandDown(<IKeyboardEvent> hotkeyEvent) === hotkeyTrigger.ctrlOrCommand &&
        wheelMatch(registry.services.pointer) === hotkeyTrigger.wheel &&
        mouseDownMatch(hotkeyEvent, hotkeyTrigger) &&
        keyCodeFuncMatch(hotkeyEvent, hotkeyTrigger)
    );
}


function wheelMatch(pointerService: PointerService): boolean {
    return pointerService.wheel !== Wheel.IDLE;
}

function keyCodeFuncMatch(hotkeyEvent: IHotkeyEvent, hotkeyTrigger: HotkeyTrigger) {
    if (!hotkeyTrigger.keyCodeFunc) { return true; }

    return hotkeyEvent.keyCode !== undefined && hotkeyTrigger.keyCodeFunc(hotkeyEvent);
}

function mouseDownMatch(hotkeyEvent: IHotkeyEvent, hotkeyTrigger: HotkeyTrigger) {
    return hotkeyTrigger.mouseDown === false || hotkeyTrigger.mouseDown === hotkeyEvent.pointers[0].isDown
}

function keyCodesMatch(hotkeyEvent: IHotkeyEvent, hotkeyTrigger: HotkeyTrigger): boolean {
    return hotkeyTrigger.keyCodes.length === 0 || hotkeyTrigger.keyCodes.find(keyCode => keyCode === hotkeyEvent.keyCode) !== undefined;
}