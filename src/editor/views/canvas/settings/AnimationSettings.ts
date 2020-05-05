import { Registry } from '../../../Registry';
import { UpdateTask } from '../../../services/UpdateServices';
import { ConceptType } from '../../../models/concepts/Concept';
import { MeshConcept } from '../../../models/concepts/MeshConcept';
import { AnimationConcept, AnimationCondition } from '../../../models/meta/AnimationConcept';
import { AbstractSettings } from './AbstractSettings';

export enum AnimationSettingsProps {
    Name = 'Name',
    MoveAnimation = 'MoveAnimation',
    RotateLeftAnimation = 'RotateLeftAnimation',
    RotateRightAnimation = 'RotateRightAnimation',
}

export class AnimationSettings extends AbstractSettings<AnimationSettingsProps> {
    static settingsName = 'animation-settings';
    getName() { return AnimationSettings.settingsName; }
    animationConcept: AnimationConcept;
    meshConcept: MeshConcept;

    private registry: Registry;

    constructor(registry: Registry) {
        super();
        this.registry = registry;
        this.animationConcept = new AnimationConcept();
        this.animationConcept.id = registry.stores.canvasStore.generateUniqueName(ConceptType.AnimationConcept);
    }

    protected getProp(prop: AnimationSettingsProps) {
        switch (prop) {
            case AnimationSettingsProps.Name:
                return this.animationConcept.id;
            case AnimationSettingsProps.RotateLeftAnimation:
                return this.animationConcept.getAnimationByCond(AnimationCondition.RotateLeft);
            case AnimationSettingsProps.RotateRightAnimation:
                return this.animationConcept.getAnimationByCond(AnimationCondition.RotateRight);
            case AnimationSettingsProps.MoveAnimation:
                return this.animationConcept.getAnimationByCond(AnimationCondition.Move);
        }
    }

    protected setProp(val: any, prop: AnimationSettingsProps) {
        switch (prop) {
            case AnimationSettingsProps.Name:
                this.animationConcept.id = val;
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
                break;
            case AnimationSettingsProps.RotateLeftAnimation:
                this.animationConcept.addAnimation({name: val, condition: AnimationCondition.RotateLeft});
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings, UpdateTask.SaveData);
                break;
            case AnimationSettingsProps.RotateRightAnimation:
                this.animationConcept.addAnimation({name: val, condition: AnimationCondition.RotateRight});
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings, UpdateTask.SaveData);
                break;
            case AnimationSettingsProps.MoveAnimation:
                this.animationConcept.addAnimation({name: val, condition: AnimationCondition.Move});
                this.registry.services.update.runImmediately(UpdateTask.RepaintSettings, UpdateTask.SaveData);
                break;
        }
    }

    load() {
        this.meshConcept = this.registry.stores.selectionStore.getConcept() as MeshConcept;
        if (this.meshConcept.animationId) {
            this.animationConcept = this.registry.stores.canvasStore.getAnimationConceptById(this.meshConcept.animationId);            
        }
        this.registry.services.update.runImmediately(UpdateTask.RepaintSettings);
    }

    save() {
        if (this.animationConcept.elementalAnimations.length > 0) {
            this.meshConcept.animationId = this.animationConcept.id;
            if (!this.registry.stores.canvasStore.hasMeta(this.animationConcept)) {
                this.registry.stores.canvasStore.addMeta(this.animationConcept);
            }
        }
        this.animationConcept = undefined;
    }
}