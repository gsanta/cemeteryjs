import { Modifier } from '../modifiers/Modifier';
import { ModifierFactoryService } from './ModifierFactoryService';
import { WorldItem } from '../WorldItemInfo';


export class ModifierService {
    private modifierFactory: ModifierFactoryService;

    constructor(modifierFactory: ModifierFactoryService) {
        this.modifierFactory = modifierFactory;
    }

    applyModifiers(worldItems: WorldItem[], modNames: string[]): WorldItem[] {
        return this.resolve(modNames).reduce((worldItems, transformator) => transformator.apply(worldItems), worldItems);
    }

    private resolve(modNames: string[]): Modifier[] {
        const unresolvedModifiers = modNames.map(name => this.modifierFactory.getInstance(name));
        const resolvedModifiers: Modifier[] = [];
        let infiniteCycleTestCounter = 0;

        while(unresolvedModifiers.length > 0) {
            if (this.areDepsOfModifierResolved(unresolvedModifiers[0], resolvedModifiers)) {
                resolvedModifiers.push(unresolvedModifiers.shift());
                infiniteCycleTestCounter = 0;
            } else {
                infiniteCycleTestCounter++;
                unresolvedModifiers.push(unresolvedModifiers.shift());
            }

            if (infiniteCycleTestCounter === unresolvedModifiers.length) {
                throw new Error(`Modifier dependency can not be resolved by ordering the modifiers unresolved modifiers are: ${unresolvedModifiers.map(m => m.getName()).join(', ')}`);
            }
        }
        return [];
    }

    private areDepsOfModifierResolved(modifier: Modifier, resolvedModifiers: Modifier[]) {
        const unresolvedModifiers = modifier.dependencies.filter(dep => resolvedModifiers.find(mod => mod.getName() === dep) === undefined);

        return unresolvedModifiers.length === 0;
    }
}