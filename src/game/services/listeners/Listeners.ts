import { GamepadEvent } from "../GameEventManager";

export class Listeners {
    private gamepadListeners: ((gamepadEvent: GamepadEvent) => void)[] = [];
    private afterRenderListeners: (() => void)[] = [];

    registerGamepadListener(listener: (gamepadEvent: GamepadEvent) => void) {
        this.gamepadListeners.push(listener);
    }

    registerAfterRenderListener(listener: () => void) {
        this.afterRenderListeners.push(listener);
    }

    getGamepadListeners(): ((gamepadEvent: GamepadEvent) => void)[] {
        return this.gamepadListeners;
    }

    getAfterRenderListeners(): (() => void)[] {
        return this.afterRenderListeners;
    }
}