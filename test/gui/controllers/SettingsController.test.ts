import { SettingsProperty } from '../../../src/gui/controllers/settings/SettingsController';
import { setupControllers } from "./controllerTestUtils";
import { SvgEditorController } from '../../../src/gui/controllers/editors/svg/SvgEditorController';
import { TextEditorController } from '../../../src/gui/controllers/editors/text/TextEditorController';
import { FileFormat } from '../../../src/WorldGenerator';

it ("Update the 'activeEditor' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const settingsController = controllers.settingsController;
    const settingsModel = controllers.settingsModel;

    settingsController.focusProp(SettingsProperty.EDITOR);
    
    expect(settingsController.getVal(SettingsProperty.EDITOR)).toEqual(SvgEditorController.id);
    expect(settingsModel.activeEditor.getId()).toEqual(SvgEditorController.id);

    settingsController.updateStringProp(TextEditorController.id);

    expect(settingsController.getVal(SettingsProperty.EDITOR)).toEqual(TextEditorController.id);
    expect(settingsModel.activeEditor.getId()).toEqual(SvgEditorController.id);

    settingsController.commitProp();

    expect(settingsController.getVal(SettingsProperty.EDITOR)).toEqual(TextEditorController.id);
    expect(settingsModel.activeEditor.getId()).toEqual(TextEditorController.id);
});

it ("Update the 'isWorldItemTypeEditorOpen' prop", () => {
    const controllers = setupControllers(FileFormat.TEXT);

    const settingsController = controllers.settingsController;
    const settingsModel = controllers.settingsModel;

    settingsController.focusProp(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN);
    
    expect(settingsController.getVal(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN)).toEqual(true);
    expect(settingsModel.isWorldItemTypeEditorOpen).toEqual(true);

    settingsController.updateBooleanProp(false);

    expect(settingsController.getVal(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN)).toEqual(false);
    expect(settingsModel.isWorldItemTypeEditorOpen).toEqual(true);

    settingsController.commitProp();

    expect(settingsController.getVal(SettingsProperty.IS_WORLD_ITEM_TYPE_EDITOR_OPEN)).toEqual(false);
    expect(settingsModel.isWorldItemTypeEditorOpen).toEqual(false);
});