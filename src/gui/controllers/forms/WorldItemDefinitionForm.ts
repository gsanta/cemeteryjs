import { AbstractFormController } from './AbstractFormController';
import { WorldItemDefinition } from '../../../WorldItemDefinition';

export enum WorldItemTypeProperty {
    TYPE_NAME = 'typeName',
    CHAR = 'char',
    MODEL = 'model',
    SHAPE = 'shape',
    SCALE = 'scale',
    TRANSLATE_Y = 'translateY',
    MATERIALS = 'materials',
    COLOR = 'color',
}

export class WorldItemDefinitionForm extends AbstractFormController<WorldItemTypeProperty> {
    shapes: string[] = ['rect'];

    private selectedIndex = -1;
    worldItemDefinitions: WorldItemDefinition[];
    selectedType: WorldItemDefinition;

    setRenderer(renderFunc: () => void) {
        this.renderFunc = renderFunc;
    }

    focusedPropType: WorldItemTypeProperty;

    focusProp(type: WorldItemTypeProperty, initialValue?: string) {
        this.focusedPropType = type;
        switch(this.focusedPropType) {
            case WorldItemTypeProperty.MODEL:
                this.tempString = this.selectedType.model;
                break;
            case WorldItemTypeProperty.CHAR:
                this.tempString = this.selectedType.char;
                break;
            case WorldItemTypeProperty.SCALE:
                this.tempNumber = this.selectedType.scale;
                break;
            case WorldItemTypeProperty.SHAPE:
                this.tempString = this.selectedType.shape;
                break;
            case WorldItemTypeProperty.TRANSLATE_Y:
                this.tempNumber = this.selectedType.translateY;
                break;
            case WorldItemTypeProperty.MATERIALS:
                this.tempString = "";
                break;
            case WorldItemTypeProperty.COLOR:
                this.tempString = this.selectedType.color;
                break;
            case WorldItemTypeProperty.TYPE_NAME:
                this.tempString = this.selectedType.typeName;
                break;
        }

        this.renderFunc();
    }

    updateStringProp(value: string) {
        this.tempString = value;
        this.renderFunc();
    }

    updateBooleanProp(value: boolean) {
        this.tempBoolean = value;
        this.renderFunc();
    }

    updateNumberProp(value: number) {
        this.tempNumber = value;
        this.renderFunc();
    }

    deletItemFromListProp(prop: WorldItemTypeProperty, index: number) {
        switch(prop) {
            case WorldItemTypeProperty.MATERIALS:
                this.selectedType.materials.splice(index, 1);
                this.syncSelected(this.selectedType.typeName);
                break;
        } 

        this.renderFunc();
    }

    commitProp(removeFocus = false) {
        const worldItemType = this.worldItemDefinitions.find(desc => desc.typeName === this.selectedType.typeName);

        switch(this.focusedPropType) {
            case WorldItemTypeProperty.MODEL:
                this.selectedType.model = this.tempString;
                break;
            case WorldItemTypeProperty.CHAR:
                this.selectedType.char = this.tempString;
                break;
            case WorldItemTypeProperty.SCALE:
                this.selectedType.scale = this.tempNumber;
                break;
            case WorldItemTypeProperty.SHAPE:
                this.selectedType.shape = this.tempString;
                break;
            case WorldItemTypeProperty.TRANSLATE_Y:
                this.selectedType.translateY = this.tempNumber;
                break;
            case WorldItemTypeProperty.TYPE_NAME:
                this.selectedType.typeName = this.tempString;
                break;
            case WorldItemTypeProperty.MATERIALS:
                this.selectedType.materials.push(this.tempString);
                this.tempString = '';
                this.focusedPropType = null;
                break;
            case WorldItemTypeProperty.COLOR:
                this.selectedType.color = this.tempString;
                this.tempString = '';
                break;
        }

        this.syncSelected(worldItemType.typeName);

        if (removeFocus) {
            this.focusedPropType = null;
        }

        this.renderFunc();
    }

    getVal(property: WorldItemTypeProperty) {
        switch(property) {
            case WorldItemTypeProperty.MODEL:
                return this.focusedPropType === property ? this.tempString : this.selectedType.model;
            case WorldItemTypeProperty.CHAR:
                return this.focusedPropType === property ? this.tempString : this.selectedType.char;
            case WorldItemTypeProperty.SCALE:
                return this.focusedPropType === property ? this.tempNumber : this.selectedType.scale;
            case WorldItemTypeProperty.SHAPE:
                return this.focusedPropType === property ? this.tempString : this.selectedType.shape;
            case WorldItemTypeProperty.TRANSLATE_Y:
                return this.focusedPropType === property ? this.tempNumber : this.selectedType.translateY;
            case WorldItemTypeProperty.TYPE_NAME:
                return this.focusedPropType === property ? this.tempString : this.selectedType.typeName;
            case WorldItemTypeProperty.MATERIALS:
                return this.focusedPropType === property ? this.tempString : '';
            case WorldItemTypeProperty.COLOR:
                return this.focusedPropType === property ? this.tempString : this.selectedType.color;
        }
    }


    getListItem(index: number) {
        return this.worldItemDefinitions[index];
    }

    getSelectedItemIndex(): number {
        return this.selectedIndex;
    }

    setSelectedDefinition(type: string) {
        if (this.selectedType) {
            this.syncSelected(this.selectedType.typeName);
        }

        const worldItemDefinition = this.worldItemDefinitions.find(descriptor => descriptor.typeName === type);
        this.selectedIndex = this.worldItemDefinitions.indexOf(worldItemDefinition);
        this.selectedType = WorldItemDefinition.clone(worldItemDefinition);

        this.renderFunc();
    }

    getModel(): WorldItemDefinition[] {
        return this.worldItemDefinitions;
    }

    setModel(worldItemDefinitions: WorldItemDefinition[]) {
        this.worldItemDefinitions = WorldItemDefinition.cloneAll(worldItemDefinitions);
        this.setSelectedDefinition(this.worldItemDefinitions[0].typeName);
    }

    private syncSelected(origTypeName: string) {
        const origWorldItemType = this.worldItemDefinitions.find(type => type.typeName === origTypeName);
        const clone = [...this.worldItemDefinitions];
        clone.splice(this.worldItemDefinitions.indexOf(origWorldItemType), 1, WorldItemDefinition.clone(this.selectedType));
        this.worldItemDefinitions = clone;
    }
}
