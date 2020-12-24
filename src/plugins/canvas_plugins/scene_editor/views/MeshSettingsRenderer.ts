import { IRenderer } from "../../../../core/plugin/IRenderer";
import { Registry } from "../../../../core/Registry";
import { UI_Accordion } from "../../../../core/ui_components/elements/surfaces/UI_Accordion";
import { UI_Layout } from "../../../../core/ui_components/elements/UI_Layout";
import { MeshView } from "./MeshView";
import { MeshViewControllers } from "./MeshViewControllers";

export class MeshSettingsRenderer implements IRenderer<UI_Layout> {
    private registry: Registry;
    private controller: MeshViewControllers;

    constructor(registry: Registry) {
        this.registry = registry;
        this.controller = new MeshViewControllers(registry);
    }

    renderInto(layout: UI_Layout): void {
        const selectedViews = this.registry.data.view.scene.getSelectedViews();
        const meshView = <MeshView> selectedViews[0];

        let row = layout.row({ key: 'id-row' });

        const textField = row.textField({ key: 'id' });
        textField.paramController = this.controller.meshId;
        textField.layout = 'horizontal';
        textField.label = 'Id';

        row = layout.row({ key: 'name-row' });

        const nameField = row.textField({ key: 'name' });
        nameField.paramController = this.controller.name;
        nameField.layout = 'horizontal';
        nameField.label = 'Name';

        row = layout.row({ key: 'layer-row' });
        const grid = row.grid({ key: 'layer' });
        grid.label = 'Layer';
        const filledIndexes = new Set<number>();
        this.registry.data.view.scene.getAllViews().forEach(view => filledIndexes.add(view.layer));
        grid.filledIndexes =  Array.from(filledIndexes);

        row = layout.row({ key: 'clone-row' });
        const cloneMeshButton = row.button('clone');
        cloneMeshButton.label = 'Clone Mesh';
        cloneMeshButton.width = '200px';
        
        let accordion = layout.accordion({ key: 'transforms' });
        accordion.title = 'Transforms'

        row = accordion.row({ key: 'rot-x-row' });
        let rotationTextField = row.textField({ key: 'rot-x' });
        rotationTextField.paramController = this.controller.rotateX;
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rot X';
        rotationTextField.type = 'number';

        row = accordion.row({ key: 'rot-y-row' });
        rotationTextField = row.textField({ key: 'rot-y' });
        rotationTextField.paramController = this.controller.rotateY;
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rot Y';
        rotationTextField.type = 'number';

        row = accordion.row({ key: 'rot-z-row' });
        rotationTextField = row.textField({ key: 'rot-z' });
        rotationTextField.paramController = this.controller.rotateZ;
        rotationTextField.layout = 'horizontal';
        rotationTextField.label = 'Rot Z';
        rotationTextField.type = 'number';

        row = accordion.row({ key: 'pos-x-row' });

        let positionTextField = row.textField({ key: 'pos-x' });
        positionTextField.paramController = this.controller.posX;
        positionTextField.layout = 'horizontal';
        positionTextField.label = 'Pos X';

        row = accordion.row({ key: 'pos-y-row' });

        positionTextField = row.textField({ key: 'pos-y' });
        positionTextField.paramController = this.controller.posY;
        positionTextField.layout = 'horizontal';
        positionTextField.label = 'Pos Y';

        row = accordion.row({ key: 'pos-z-row' });

        positionTextField = row.textField({ key: 'pos-z' });
        positionTextField.paramController = this.controller.posZ;
        positionTextField.layout = 'horizontal';
        positionTextField.label = 'Pos Z';
        
        row = accordion.row({ key: 'scale-x-row' });

        let scaleTextField = row.textField({ key: 'scale-x' });
        scaleTextField.paramController = this.controller.scaleX;
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale X';

        row = accordion.row({ key: 'scale-y-row' });

        scaleTextField = row.textField({ key: 'scale-y'} );
        scaleTextField.paramController = this.controller.scaleY;
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale Y';

        row = accordion.row({ key: 'scale-z-row' });

        scaleTextField = row.textField({ key: 'scale-z' });
        scaleTextField.paramController = this.controller.scaleZ;
        scaleTextField.layout = 'horizontal';
        scaleTextField.label = 'Scale Z';

        if (meshView.getObj().shapeConfig) {
            if (meshView.getObj().shapeConfig.shapeType === 'Box') {
                this.renderBoxSettings(accordion);
            }
        }

        accordion = layout.accordion({key: 'appearance'});
        accordion.title = 'Appearance';

        row = accordion.row({ key: 'color-row' });
        const colorTextField = row.textField({ key: 'color' });
        colorTextField.paramController = this.controller.color;
        colorTextField.layout = 'horizontal';
        colorTextField.label = 'Color';
        colorTextField.type = 'text';

        row = accordion.row({ key: 'visibility-row' });
        const visibilityTextField = row.textField({ key: 'visibility' });
        visibilityTextField.paramController = this.controller.visibility;
        visibilityTextField.layout = 'horizontal';
        visibilityTextField.label = 'Visibility';
        visibilityTextField.type = 'number';

        row = accordion.row({ key: 'model-row' });
        const modelTextField = row.textField({ key: 'model' });
        modelTextField.paramController = this.controller.model;
        modelTextField.layout = 'horizontal';
        modelTextField.label = 'Model path';
        modelTextField.type = 'text';

        row = accordion.row({ key: 'texture-row' });
        const textureTextField = row.textField({ key: 'texture' });
        textureTextField.paramController = this.controller.texture;
        textureTextField.layout = 'horizontal';
        textureTextField.label = 'Texture path';
        textureTextField.type = 'text';

        row = accordion.row({ key: 'thumbnail-row' });
        const changeThumbnailButton = row.button('thumbnail');
        changeThumbnailButton.paramController = this.controller.thumbnail;
        changeThumbnailButton.label = 'Change thumbnail';
        changeThumbnailButton.width = '200px';
    }

    private renderBoxSettings(layout: UI_Accordion) {
        let row = layout.row({ key: 'width-row' });
        const widthField = row.textField({ key: 'width' });
        widthField.paramController = this.controller.width;
        widthField.layout = 'horizontal';
        widthField.label = 'Width';
        widthField.type = 'number';

        row = layout.row({ key: 'height-row' });
        const heightField = row.textField({ key: 'height' });
        heightField.paramController = this.controller.height;
        heightField.layout = 'horizontal';
        heightField.label = 'Height';
        heightField.type = 'number';

        row = layout.row({ key: 'depth-row' });
        const depthField = row.textField({ key: 'depth' });
        depthField.paramController = this.controller.depth;
        depthField.layout = 'horizontal';
        depthField.label = 'Depth';
        depthField.type = 'number';
    }
}