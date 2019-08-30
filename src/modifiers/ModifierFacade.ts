import { Modifier } from './Modifier';
import { ModifierFactory } from './ModifierFactory';
import { WorldItem } from '../WorldItemInfo';


export class ModifierFacade {
    private modifierFactory: ModifierFactory;

    constructor(modifierFactory: ModifierFactory) {
        this.modifierFactory = modifierFactory;
    }

    applyModifiers(worldItems: WorldItem[], modNames: string[]): WorldItem[] {
        modNames.forEach(modName => this.checkIfExists(modName));

        return this.resolve(modNames).reduce((worldItems, transformator) => transformator.apply(worldItems), worldItems);
    }

    private resolve(modNames: string[]): Modifier[] {
        const resolvedModifiers: Modifier[] = [];

        while(modNames.length > 0) {
            const modifier = this.modifierFactory.getInstance(modNames[0]);
            if (this.areDepsOfModifierResolved(modifier, resolvedModifiers)) {

            }
        }
        return [];
    }

    private areDepsOfModifierResolved(modifier: Modifier, resolvedModifiers: Modifier[]) {
        const unresolvedModifiers = modifier.dependencies.filter(dep => resolvedModifiers.find(mod => mod.getName() === dep) === undefined);

        if (unresolvedModifiers.length > 0) {
            throw new Error(`The following modifiers were not resolved for ${modifier.getName()}: ${unresolvedModifiers.join(', ')}`);
        }

        return true;
    }

    private checkIfExists(modName: string) {
        if (!this.modifierFactory.getInstance(modName)) {
            throw new Error(`No modifier exists with name: ${modName}`);
        }
    }
}