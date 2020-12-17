import { IRenderer } from "../../../../core/plugin/IRenderer";
import { Registry } from "../../../../core/Registry";
import { UI_Accordion } from "../../../../core/ui_components/elements/surfaces/UI_Accordion";
import { UI_Layout } from "../../../../core/ui_components/elements/UI_Layout";
import { MeshView } from "./MeshView";
import { MeshViewControllerParam } from "./MeshViewControllers";

export class MeshSettingsRenderer implements IRenderer<UI_Layout> {
    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    renderInto(layout: UI_Layout): void {
        const selectedViews = this.registry.data.view.scene.getSelectedViews();
        const meshView = <MeshView> selectedViews[0];

        let row = layout.row({ key: MeshViewControllerParam.MeshId });

        const textField = row.textField({key: MeshViewControllerParam.MeshId});
        textField.layout = 'horizontal';
        textField.label = 'Id';

        row = layout.row({ key: MeshViewControllerParam.Name });

        const nameField = row.textField({key: MeshViewControllerParam.Name});
        nameField.layout = 'horizontal';
        nameField.label = 'Name';

        row = layout.row({ key: MeshViewControllerParam.Layer });
        const grid = row.grid({key: MeshViewControllerParam.Layer});
        grid.label = 'Layer';
        const filledIndexes = new Set<number>();
        this.registry.data.view.scene.getAllViews().forEach(view => filledIndexes.add(view.layer));
        grid.filledIndexes =  Array.from(filledIndexes);

        row = layout.row({ key: MeshViewControllerParam.Clone });
        const cloneMeshButton = row.button(MeshViewControllerParam.Clone);
        cloneMeshButton.label = 'Clone Mesh';
        cloneMeshButton.width = '200px';
        
        let accordion = layout.accordion({key: 'transforms'});
        accordion.title = 'Transforms'

        row = accordion.row({ key: MeshViewControllerParam.RotX });
        let rotationTextField = row.textField({key: MeshViewControllerParam.RotX});
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rot X';
        rotationTextField.type = 'number';

        row = accordion.row({ key: MeshViewControllerParam.RotY });
        rotationTextField = row.textField({key: MeshViewControllerParam.RotY});
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rot Y';
        rotationTextField.type = 'number';

        row = accordion.row({ key: MeshViewControllerParam.RotZ });
        rotationTextField = row.textField({key: MeshViewControllerParam.RotZ});
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rot Z';
        rotationTextField.type = 'number';

        row = accordion.row({ key: MeshViewControllerParam.PosX });

        let positionTextField = row.textField({key: MeshViewControllerParam.PosX});
        positionTextField.layout = 'horizontal';
        positionTextField.label = 'Pos X';

        row = accordion.row({ key: MeshViewControllerParam.PosY });

        positionTextField = row.textField({key: MeshViewControllerParam.PosY});
        positionTextField.layout = 'horizontal';
        positionTextField.label = 'Pos Y';

        row = accordion.row({ key: MeshViewControllerParam.PosZ });

        positionTextField = row.textField({key: MeshViewControllerParam.PosZ});
        positionTextField.layout = 'horizontal';
        positionTextField.label = 'Pos Z';
        
        row = accordion.row({ key: MeshViewControllerParam.ScaleX });

        let scaleTextField = row.textField({key: MeshViewControllerParam.ScaleX});
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale X';

        row = accordion.row({ key: MeshViewControllerParam.ScaleY });

        scaleTextField = row.textField({key: MeshViewControllerParam.ScaleY});
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale Y';

        row = accordion.row({ key: MeshViewControllerParam.ScaleZ });

        scaleTextField = row.textField({key: MeshViewControllerParam.ScaleZ});
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale Z';

        if (meshView.getObj().shapeConfig) {
            if (meshView.getObj().shapeConfig.shapeType === 'Box') {
                this.renderBoxSettings(accordion);
            }
        }

        accordion = layout.accordion({key: 'appearance'});
        accordion.title = 'Appearance';

        row = accordion.row({ key: MeshViewControllerParam.Color });
        const colorTextField = row.textField({key: MeshViewControllerParam.Color});
        colorTextField.layout = 'horizontal';
        colorTextField.label = 'Color';
        colorTextField.type = 'text';

        row = accordion.row({ key: MeshViewControllerParam.Visibility });
        const visibilityTextField = row.textField({key: MeshViewControllerParam.Visibility});
        visibilityTextField.layout = 'horizontal';
        visibilityTextField.label = 'Visibility';
        visibilityTextField.type = 'number';

        row = accordion.row({ key: MeshViewControllerParam.Model });
        const modelTextField = row.textField({key: MeshViewControllerParam.Model});
        modelTextField.layout = 'horizontal';
        modelTextField.label = 'Model path';
        modelTextField.type = 'text';

        row = accordion.row({ key: MeshViewControllerParam.Texture });
        const textureTextField = row.textField({key: MeshViewControllerParam.Texture});
        textureTextField.layout = 'horizontal';
        textureTextField.label = 'Texture path';
        textureTextField.type = 'text';

        row = accordion.row({ key: MeshViewControllerParam.Thumbnail });
        const changeThumbnailButton = row.button(MeshViewControllerParam.Thumbnail);
        changeThumbnailButton.label = 'Change thumbnail';
        changeThumbnailButton.width = '200px';
    }

    private renderBoxSettings(layout: UI_Accordion) {
        let row = layout.row({ key: MeshViewControllerParam.Width });
        const widthField = row.textField({key: MeshViewControllerParam.Width});
        widthField.layout = 'horizontal';
        widthField.label = 'Width';
        widthField.type = 'number';

        row = layout.row({ key: MeshViewControllerParam.Height });
        const heightField = row.textField({key: MeshViewControllerParam.Height});
        heightField.layout = 'horizontal';
        heightField.label = 'Height';
        heightField.type = 'number';

        row = layout.row({ key: MeshViewControllerParam.Depth });
        const depthField = row.textField({key: MeshViewControllerParam.Depth});
        depthField.layout = 'horizontal';
        depthField.label = 'Depth';
        depthField.type = 'number';
    }
}