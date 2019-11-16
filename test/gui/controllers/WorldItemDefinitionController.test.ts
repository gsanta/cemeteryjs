import { setupControllers } from "./controllerTestUtils";
import { WorldItemTypeProperty, WorldItemDefinitionForm } from "../../../src/gui/controllers/world_items/WorldItemDefinitionForm";
import { WorldItemDefinition } from "../../../src/WorldItemDefinition";
import { FileFormat } from '../../../src/WorldGenerator';

it ("Update the 'type' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemDefinitionForm = new WorldItemDefinitionForm(controllers.getActiveCanvas());

    const meshDescriptor = worldItemDefinitionForm.getModel().types[1];

    testSimpleProp(worldItemDefinitionForm, meshDescriptor, WorldItemTypeProperty.TYPE_NAME, 'new type', val => worldItemDefinitionForm.updateStringProp(val));
});

it ("Update the 'char' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemDefinitionForm = new WorldItemDefinitionForm(controllers.getActiveCanvas());
    const meshDescriptor = worldItemDefinitionForm.getModel().types[1];

    testSimpleProp(worldItemDefinitionForm, meshDescriptor, WorldItemTypeProperty.CHAR, 'A', val => worldItemDefinitionForm.updateStringProp(val));
});

it ("Update the 'model' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemDefinitionForm = new WorldItemDefinitionForm(controllers.getActiveCanvas());

    const meshDescriptor = worldItemDefinitionForm.getModel().types[1];

    testSimpleProp(worldItemDefinitionForm, meshDescriptor, WorldItemTypeProperty.MODEL, 'models/door/new_model.babylon', val => worldItemDefinitionForm.updateStringProp(val));
});

it ("Update the 'shape' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemDefinitionForm = new WorldItemDefinitionForm(controllers.getActiveCanvas());

    const meshDescriptor = worldItemDefinitionForm.getModel().types[0];

    testSimpleProp(worldItemDefinitionForm, meshDescriptor, WorldItemTypeProperty.SHAPE, 'circle', val => worldItemDefinitionForm.updateStringProp(val));
});

it ("Update the 'scale' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemDefinitionForm = new WorldItemDefinitionForm(controllers.getActiveCanvas());

    const meshDescriptor = worldItemDefinitionForm.getModel().types[1];

    testSimpleProp(worldItemDefinitionForm, meshDescriptor, WorldItemTypeProperty.SCALE, 2, val => worldItemDefinitionForm.updateNumberProp(val));
});

it ("Update the 'translate' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemDefinitionForm = new WorldItemDefinitionForm(controllers.getActiveCanvas());

    const meshDescriptor = worldItemDefinitionForm.getModel().types[1];

    testSimpleProp(worldItemDefinitionForm, meshDescriptor, WorldItemTypeProperty.TRANSLATE_Y, 4, val => worldItemDefinitionForm.updateNumberProp(val));
});

it ("Update the 'isBorder' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemDefinitionForm = new WorldItemDefinitionForm(controllers.getActiveCanvas());
    const meshDescriptor = worldItemDefinitionForm.getModel().types[1];

    testSimpleProp(worldItemDefinitionForm, meshDescriptor, WorldItemTypeProperty.IS_BORDER, false, val => worldItemDefinitionForm.updateBooleanProp(val));
});

it ("Update the 'isBorder' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemDefinitionForm = new WorldItemDefinitionForm(controllers.getActiveCanvas());
    const meshDescriptor = worldItemDefinitionForm.getModel().types[1];
    const oldMaterials = ['materials/door/door.jpg'];
    worldItemDefinitionForm.setSelectedDefinition('door');
    worldItemDefinitionForm.focusProp(WorldItemTypeProperty.MATERIALS);

    expect(worldItemDefinitionForm.getVal(WorldItemTypeProperty.MATERIALS)).toEqual('');
    expect(meshDescriptor.materials).toEqual(oldMaterials);

    worldItemDefinitionForm.updateStringProp('materials/door/door2.jpg');
    
    expect(worldItemDefinitionForm.getVal(WorldItemTypeProperty.MATERIALS)).toEqual('materials/door/door2.jpg');
    expect(meshDescriptor.materials).toEqual(oldMaterials);

    worldItemDefinitionForm.commitProp();
    expect(worldItemDefinitionForm.getVal(WorldItemTypeProperty.MATERIALS)).toEqual('');
    expect(worldItemDefinitionForm.getModel().types.find(desc => desc.typeName === 'door').materials).toEqual(
        [
            'materials/door/door.jpg',
            'materials/door/door2.jpg'
        ]
    );
});

function testSimpleProp(
    worldItemTypeController: WorldItemDefinitionForm,
    descriptor: WorldItemDefinition,
    property: WorldItemTypeProperty,
    newVal: any, updateProp: (val: any) => void
) {
    const meshDescriptorIndex = worldItemTypeController.getModel().types.indexOf(descriptor);
    const meshDescriptorType = descriptor.typeName;
    const oldVal = descriptor[property];
    worldItemTypeController.setSelectedDefinition(meshDescriptorType);
    worldItemTypeController.focusProp(property);

    expect(worldItemTypeController.getVal(property)).toEqual(oldVal);

    updateProp(newVal);
    
    expect(worldItemTypeController.getVal(property)).toEqual(newVal);
    expect(worldItemTypeController.getModel().types[meshDescriptorIndex][property]).toEqual(oldVal);

    worldItemTypeController.commitProp();
    expect(worldItemTypeController.getVal(property)).toEqual(newVal);
    expect(worldItemTypeController.getModel().types[meshDescriptorIndex][property]).toEqual(newVal);
}