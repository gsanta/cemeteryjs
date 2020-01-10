

export enum InputCommand {
    Forward = 'Forward',
    Backward = 'Backward',
    TurnLeft = 'TurnLeft',
    TurnRight = 'TurnRight',
}

export class InputCommandStore {
    commands: Set<InputCommand> = new Set();
}