import { Modifier } from './Modifier';


export class ModifierFacade {
    private modifierMap: Map<string, Modifier> = new Map();

    constructor(modifiers: Modifier[]) {
        modifiers.forEach(modifier => this.modifierMap.set(modifier.getName(), modifier));
    }

    getModifier(name: string) {
        return this.modifierMap.get(name);
    }
}