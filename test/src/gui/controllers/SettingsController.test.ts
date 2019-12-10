import { SettingsProperty } from '../../../../src/gui/controllers/forms/SettingsForm';
import { setupControllers } from "./controllerTestUtils";
import { SvgCanvasController } from '../../../../src/gui/controllers/canvases/svg/SvgCanvasController';
import { TextCanvasController } from '../../../../src/gui/controllers/canvases/text/TextCanvasController';
import { FileFormat } from '../../../../src/WorldGenerator';

it ("Update the 'activeEditor' prop", () => {
    const controllers = setupControllers(FileFormat.SVG);

    const settingsController = controllers.settingsController;
    const settingsModel = controllers.settingsModel;

    settingsController.focusProp(SettingsProperty.EDITOR);
    
    expect(settingsController.getVal(SettingsProperty.EDITOR)).toEqual(SvgCanvasController.id);
    expect(settingsModel.activeEditor.getId()).toEqual(SvgCanvasController.id);

    settingsController.updateStringProp(TextCanvasController.id);

    expect(settingsController.getVal(SettingsProperty.EDITOR)).toEqual(TextCanvasController.id);
    expect(settingsModel.activeEditor.getId()).toEqual(SvgCanvasController.id);

    settingsController.commitProp();

    expect(settingsController.getVal(SettingsProperty.EDITOR)).toEqual(TextCanvasController.id);
    expect(settingsModel.activeEditor.getId()).toEqual(TextCanvasController.id);
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