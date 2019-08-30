import { Modifier } from './Modifier';


export class ModifierFactory {
    private modifierMap: Map<string, Modifier> = new Map();

    getInstance(modName: string): Modifier {
        return this.modifierMap.get(modName);
    }

    registerInstance(modifier: Modifier): ModifierFactory {
        this.modifierMap.set(modifier.getName(), modifier);

        return this;
    }
}