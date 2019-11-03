import { setupControllers } from "./controllerTestUtils";
import { DefinitionProperty, DefinitionController } from "../../../src/gui/controllers/DefinitionController";
import { MeshDescriptor } from "../../../src";

it ("Update the 'type' prop", () => {
    const controllers = setupControllers();

    const definitionController = controllers.definitionController;
    const meshDescriptor = definitionController.worldItemTypes[1];

    testSimpleProp(definitionController, meshDescriptor, DefinitionProperty.TYPE, 'new type', val => definitionController.updateStringProp(val));
});

it ("Update the 'char' prop", () => {
    const controllers = setupControllers();

    const definitionController = controllers.definitionController;
    const meshDescriptor = definitionController.worldItemTypes[1];

    testSimpleProp(definitionController, meshDescriptor, DefinitionProperty.CHAR, 'A', val => definitionController.updateStringProp(val));
});

it ("Update the 'model' prop", () => {
    const controllers = setupControllers();

    const definitionController = controllers.definitionController;
    const meshDescriptor = definitionController.worldItemTypes[1];

    testSimpleProp(definitionController, meshDescriptor, DefinitionProperty.MODEL, 'models/door/new_model.babylon', val => definitionController.updateStringProp(val));
});

it ("Update the 'shape' prop", () => {
    const controllers = setupControllers();

    const definitionController = controllers.definitionController;
    const meshDescriptor = definitionController.worldItemTypes[0];

    testSimpleProp(definitionController, meshDescriptor, DefinitionProperty.SHAPE, 'circle', val => definitionController.updateStringProp(val));
});

it ("Update the 'scale' prop", () => {
    const controllers = setupControllers();

    const definitionController = controllers.definitionController;
    const meshDescriptor = definitionController.worldItemTypes[1];

    testSimpleProp(definitionController, meshDescriptor, DefinitionProperty.SCALE, 2, val => definitionController.updateNumberProp(val));
});

it ("Update the 'translate' prop", () => {
    const controllers = setupControllers();

    const definitionController = controllers.definitionController;
    const meshDescriptor = definitionController.worldItemTypes[1];

    testSimpleProp(definitionController, meshDescriptor, DefinitionProperty.TRANSLATE_Y, 4, val => definitionController.updateNumberProp(val));
});

it ("Update the 'isBorder' prop", () => {
    const controllers = setupControllers();

    const definitionController = controllers.definitionController;
    const meshDescriptor = definitionController.worldItemTypes[1];

    testSimpleProp(definitionController, meshDescriptor, DefinitionProperty.IS_BORDER, false, val => definitionController.updateBooleanProp(val));
});

it ("Update the 'isBorder' prop", () => {
    const controllers = setupControllers();

    const definitionController = controllers.definitionController;
    const meshDescriptor = definitionController.worldItemTypes[1];
    const oldMaterials = ['materials/door/door.jpg'];
    definitionController.setSelectedDefinition('door');
    definitionController.focusProp(DefinitionProperty.MATERIALS);

    expect(definitionController.getVal(DefinitionProperty.MATERIALS)).toEqual('');
    expect(meshDescriptor.materials).toEqual(oldMaterials);

    definitionController.updateStringProp('materials/door/door2.jpg');
    
    expect(definitionController.getVal(DefinitionProperty.MATERIALS)).toEqual('materials/door/door2.jpg');
    expect(meshDescriptor.materials).toEqual(oldMaterials);

    definitionController.commitProp();
    expect(definitionController.getVal(DefinitionProperty.MATERIALS)).toEqual('');
    expect(definitionController.worldItemTypes.find(desc => desc.type === 'door').materials).toEqual(
        [
            'materials/door/door.jpg',
            'materials/door/door2.jpg'
        ]
    );
});

function testSimpleProp(
    definitionController: DefinitionController,
    descriptor: MeshDescriptor,
    property: DefinitionProperty,
    newVal: any, updateProp: (val: any) => void
) {
    const meshDescriptorIndex = definitionController.worldItemTypes.indexOf(descriptor);
    const meshDescriptorType = descriptor.type;
    const oldVal = descriptor[property];
    definitionController.setSelectedDefinition(meshDescriptorType);
    definitionController.focusProp(property);

    expect(definitionController.getVal(property)).toEqual(oldVal);

    updateProp(newVal);
    
    expect(definitionController.getVal(property)).toEqual(newVal);
    expect(definitionController.worldItemTypes[meshDescriptorIndex][property]).toEqual(oldVal);

    definitionController.commitProp();
    expect(definitionController.getVal(property)).toEqual(newVal);
    expect(definitionController.worldItemTypes[meshDescriptorIndex][property]).toEqual(newVal);
}

function testArrayProp(
    definitionController: DefinitionController,
    descriptor: MeshDescriptor,
    property: DefinitionProperty,
    newVal: any, updateProp: (val: any) => void
) {
    const meshDescriptorIndex = definitionController.worldItemTypes.indexOf(descriptor);
    const meshDescriptorType = descriptor.type;
    const oldVal = descriptor[property];
    definitionController.setSelectedDefinition(meshDescriptorType);
    definitionController.focusProp(property);

    expect(definitionController.getVal(property)).toEqual(oldVal);

    updateProp(newVal);
    
    expect(definitionController.getVal(property)).toEqual(newVal);
    expect(definitionController.worldItemTypes[meshDescriptorIndex][property]).toEqual(oldVal);

    definitionController.commitProp();
    expect(definitionController.getVal(property)).toEqual(newVal);
    expect(definitionController.worldItemTypes[meshDescriptorIndex][property]).toEqual(newVal);
}