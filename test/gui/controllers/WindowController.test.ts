import { setupControllers } from "./controllerTestUtils";
import { SettingsController, SettingsProperty } from '../../../src/gui/controllers/settings/SettingsController';
import { EditorType } from '../../../src/gui/controllers/settings/SettingsModel';

it ("Update the 'activeEditor' prop", () => {
    const controllers = setupControllers();

    const windowController = controllers.settingsController;
    const windowModel = controllers.settingsModel;

    windowController.focusProp(SettingsProperty.EDITOR);
    
    expect(windowController.getVal(SettingsProperty.EDITOR)).toEqual(EditorType.BITMAP_EDITOR);
    expect(windowModel.activeEditor).toEqual(EditorType.BITMAP_EDITOR);

    windowController.updateStringProp(EditorType.TEXT_EDITOR);

    expect(windowController.getVal(SettingsProperty.EDITOR)).toEqual(EditorType.TEXT_EDITOR);
    expect(windowModel.activeEditor).toEqual(EditorType.BITMAP_EDITOR);

    windowController.commitProp();

    expect(windowController.getVal(SettingsProperty.EDITOR)).toEqual(EditorType.TEXT_EDITOR);
    expect(windowModel.activeEditor).toEqual(EditorType.TEXT_EDITOR);
});

it ("Update the 'isWorldItemTypeEditorOpen' prop", () => {
    const controllers = setupControllers();

    const windowController = controllers.settingsController;
    const windowModel = controllers.settingsModel;

    windowController.focusProp(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN);
    
    expect(windowController.getVal(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN)).toEqual(true);
    expect(windowModel.isWorldItemTypeEditorOpen).toEqual(true);

    windowController.updateBooleanProp(false);

    expect(windowController.getVal(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN)).toEqual(false);
    expect(windowModel.isWorldItemTypeEditorOpen).toEqual(true);

    windowController.commitProp();

    expect(windowController.getVal(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN)).toEqual(false);
    expect(windowModel.isWorldItemTypeEditorOpen).toEqual(false);
});