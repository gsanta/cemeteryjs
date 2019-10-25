
export interface Focusable {
    onFocus(text: string | number): void;
    onBlur(): void;
}