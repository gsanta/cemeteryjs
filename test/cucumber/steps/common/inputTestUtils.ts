

export function createFakeMouseEvent(x: number, y: number): MouseEvent {
    return <MouseEvent> {
        x,
        y,
        button: 1
    }
}

export function createFakeKeyboardEventFromString(str: string): KeyboardEvent {
    return <KeyboardEvent> {
        keyCode: str.charCodeAt(0),
        altKey: false,
        shiftKey: false,
        ctrlKey: false,
        preventDefault: () => {},
        stopPropagation: () => {}
    }
}