import { setupControllers } from "./controllerTestUtils";
import { WorldItemTypeProperty, WorldItemDefinitionController } from "../../../src/gui/controllers/world_items/WorldItemDefinitionController";
import { WorldItemDefinition } from "../../../src/WorldItemDefinition";
import { FileFormat } from '../../../src/WorldGenerator';

it ("Update the 'type' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemTypeController = controllers.worldItemDefinitionController;
    const meshDescriptor = worldItemTypeController.getModel().types[1];

    testSimpleProp(worldItemTypeController, meshDescriptor, WorldItemTypeProperty.TYPE_NAME, 'new type', val => worldItemTypeController.updateStringProp(val));
});

it ("Update the 'char' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemTypeController = controllers.worldItemDefinitionController;
    const meshDescriptor = worldItemTypeController.getModel().types[1];

    testSimpleProp(worldItemTypeController, meshDescriptor, WorldItemTypeProperty.CHAR, 'A', val => worldItemTypeController.updateStringProp(val));
});

it ("Update the 'model' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemTypeController = controllers.worldItemDefinitionController;
    const meshDescriptor = worldItemTypeController.getModel().types[1];

    testSimpleProp(worldItemTypeController, meshDescriptor, WorldItemTypeProperty.MODEL, 'models/door/new_model.babylon', val => worldItemTypeController.updateStringProp(val));
});

it ("Update the 'shape' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemTypeController = controllers.worldItemDefinitionController;
    const meshDescriptor = worldItemTypeController.getModel().types[0];

    testSimpleProp(worldItemTypeController, meshDescriptor, WorldItemTypeProperty.SHAPE, 'circle', val => worldItemTypeController.updateStringProp(val));
});

it ("Update the 'scale' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemTypeController = controllers.worldItemDefinitionController;
    const meshDescriptor = worldItemTypeController.getModel().types[1];

    testSimpleProp(worldItemTypeController, meshDescriptor, WorldItemTypeProperty.SCALE, 2, val => worldItemTypeController.updateNumberProp(val));
});

it ("Update the 'translate' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemTypeController = controllers.worldItemDefinitionController;
    const meshDescriptor = worldItemTypeController.getModel().types[1];

    testSimpleProp(worldItemTypeController, meshDescriptor, WorldItemTypeProperty.TRANSLATE_Y, 4, val => worldItemTypeController.updateNumberProp(val));
});

it ("Update the 'isBorder' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemTypeController = controllers.worldItemDefinitionController;
    const meshDescriptor = worldItemTypeController.getModel().types[1];

    testSimpleProp(worldItemTypeController, meshDescriptor, WorldItemTypeProperty.IS_BORDER, false, val => worldItemTypeController.updateBooleanProp(val));
});

it ("Update the 'isBorder' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const worldItemTypeController = controllers.worldItemDefinitionController;
    const meshDescriptor = worldItemTypeController.getModel().types[1];
    const oldMaterials = ['materials/door/door.jpg'];
    worldItemTypeController.setSelectedDefinition('door');
    worldItemTypeController.focusProp(WorldItemTypeProperty.MATERIALS);

    expect(worldItemTypeController.getVal(WorldItemTypeProperty.MATERIALS)).toEqual('');
    expect(meshDescriptor.materials).toEqual(oldMaterials);

    worldItemTypeController.updateStringProp('materials/door/door2.jpg');
    
    expect(worldItemTypeController.getVal(WorldItemTypeProperty.MATERIALS)).toEqual('materials/door/door2.jpg');
    expect(meshDescriptor.materials).toEqual(oldMaterials);

    worldItemTypeController.commitProp();
    expect(worldItemTypeController.getVal(WorldItemTypeProperty.MATERIALS)).toEqual('');
    expect(worldItemTypeController.getModel().types.find(desc => desc.typeName === 'door').materials).toEqual(
        [
            'materials/door/door.jpg',
            'materials/door/door2.jpg'
        ]
    );
});

function testSimpleProp(
    worldItemTypeController: WorldItemDefinitionController,
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