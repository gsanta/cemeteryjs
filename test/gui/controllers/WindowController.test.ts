import { setupControllers } from "./controllerTestUtils";
import { WindowController, WindowProperty } from '../../../src/gui/controllers/WindowController';
import { EditorType } from '../../../src/gui/models/WindowModel';

it ("Update the 'activeEditor' prop", () => {
    const controllers = setupControllers();

    const windowController = controllers.windowController;
    const windowModel = controllers.windowModel;

    windowController.focusProp(WindowProperty.EDITOR);
    
    expect(windowController.getVal(WindowProperty.EDITOR)).toEqual(EditorType.BITMAP_EDITOR);
    expect(windowModel.activeEditor).toEqual(EditorType.BITMAP_EDITOR);

    windowController.updateStringProp(EditorType.TEXT_EDITOR);

    expect(windowController.getVal(WindowProperty.EDITOR)).toEqual(EditorType.TEXT_EDITOR);
    expect(windowModel.activeEditor).toEqual(EditorType.BITMAP_EDITOR);

    windowController.commitProp();

    expect(windowController.getVal(WindowProperty.EDITOR)).toEqual(EditorType.TEXT_EDITOR);
    expect(windowModel.activeEditor).toEqual(EditorType.TEXT_EDITOR);
});

it ("Update the 'isWorldItemTypeEditorOpen' prop", () => {
    const controllers = setupControllers();

    const windowController = controllers.windowController;
    const windowModel = controllers.windowModel;

    windowController.focusProp(WindowProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN);
    
    expect(windowController.getVal(WindowProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN)).toEqual(true);
    expect(windowModel.isWorldItemTypeEditorOpen).toEqual(true);

    windowController.updateBooleanProp(false);

    expect(windowController.getVal(WindowProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN)).toEqual(false);
    expect(windowModel.isWorldItemTypeEditorOpen).toEqual(true);

    windowController.commitProp();

    expect(windowController.getVal(WindowProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN)).toEqual(false);
    expect(windowModel.isWorldItemTypeEditorOpen).toEqual(false);
});