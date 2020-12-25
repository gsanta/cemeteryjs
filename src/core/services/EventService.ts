
export abstract class AbstractEventHandler<F extends Function> {
    abstract on(func: F);
    abstract off(func: F);
    abstract emit();
}

export class EmptyEventHandler extends AbstractEventHandler<() => void> {
    private funcs: (() => void)[] = [];

    on(func: () => void) {
        this.funcs.push(func);
    }

    off(func: () => void) {
        this.funcs = this.funcs.filter(f => f !== func);
    }

    emit() {
        this.funcs.forEach(func => func());
    }
}

export class EventService  {
    select: EmptyEventHandler = new EmptyEventHandler();
}