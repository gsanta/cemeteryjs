import { AbstractSettings } from './AbstractSettings';
import { UpdateTask } from '../../../services/UpdateServices';
import { MeshConcept } from '../models/concepts/MeshConcept';
import { ServiceLocator } from '../../../services/ServiceLocator';
import { Stores } from '../../../stores/Stores';
import { ConceptType } from '../models/concepts/Concept';
import { AnimationConcept, AnimationCondition } from '../models/meta/AnimationConcept';

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

    private getServices: () => ServiceLocator;
    private getStores: () => Stores;

    constructor(getServices: () => ServiceLocator, getStores: () => Stores) {
        super();
        this.getServices = getServices;
        this.getStores = getStores;

        this.animationConcept = new AnimationConcept();
        this.animationConcept.id = getStores().canvasStore.generateUniqueName(ConceptType.AnimationConcept);
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
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
            case AnimationSettingsProps.RotateLeftAnimation:
                this.animationConcept.addAnimation({name: val, condition: AnimationCondition.RotateLeft});
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
            case AnimationSettingsProps.RotateRightAnimation:
                this.animationConcept.addAnimation({name: val, condition: AnimationCondition.RotateRight});
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
            case AnimationSettingsProps.MoveAnimation:
                this.animationConcept.addAnimation({name: val, condition: AnimationCondition.Move});
                this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
                break;
        }
    }

    load() {
        this.meshConcept = this.getStores().selectionStore.getConcept() as MeshConcept;
        if (this.meshConcept.animationId) {
            this.animationConcept = this.getStores().canvasStore.getAnimationConceptById(this.meshConcept.animationId);            
        }
        this.getServices().updateService().runImmediately(UpdateTask.RepaintSettings);
    }

    save() {
        if (this.animationConcept.elementalAnimations.length > 0) {
            this.meshConcept.animationId = this.animationConcept.id;
            if (!this.getStores().canvasStore.hasMeta(this.animationConcept)) {
                this.getStores().canvasStore.addMeta(this.animationConcept);
            }
        }
    }
}