import { UI_Table } from "./elements/UI_Table";
import { UI_Container } from './elements/UI_Container';
import { UI_Text } from "./elements/UI_Text";
import { UI_Button } from "./elements/UI_Button";
import { UI_Select } from "./elements/UI_Select";
import { UI_FileUpload } from "./elements/UI_FileUpload";
import { UI_TextField } from './elements/UI_TextField';
import { UI_GridSelect } from './elements/UI_GridSelect';
import { UI_SvgRect } from './elements/svg/UI_SvgRect';
import { UI_SvgCircle } from './elements/svg/UI_SvgCircle';
import { UI_SvgPath } from './elements/svg/UI_SvgPath';
import { UI_SvgImage } from './elements/svg/UI_SvgImage';
import { UI_SvgGroup } from './elements/svg/UI_SvgGroup';
import { UI_Tool } from './elements/toolbar/UI_Tool';
import { UI_Tooltip } from './elements/UI_Tooltip';
import { UI_Element } from './elements/UI_Element';
import { UI_Toolbar } from './elements/toolbar/UI_Toolbar';
import { UI_SvgCanvas } from './elements/UI_SvgCanvas';

export class UI_Factory {
    static table(parent: UI_Container, config: { controllerId?: string}): UI_Table {
        const table = new UI_Table(parent.plugin);

        config.controllerId && (table.controllerId = config.controllerId);

        parent.children.push(table);

        return table;
    }

    static text(parent: UI_Container): UI_Text {
        const text = new UI_Text(parent.plugin);

        parent.children.push(text);

        return text;
    }

    static button(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_Button {
        const button = new UI_Button(parent.plugin);
        button.prop = config.prop;

        config.controllerId && (button.controllerId = config.controllerId);

        parent.children.push(button);

        return button;
    }

    static select(parent: UI_Container, config: { controllerId?: string, valProp: string, listProp: string}) {
        const select = new UI_Select(parent.plugin);
        select.prop = config.valProp;
        select.listProp = config.listProp;

        config.controllerId && (select.controllerId = config.controllerId);

        parent.children.push(select);

        return select;
    }

    static fileUpload(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_FileUpload {
        const button = new UI_FileUpload(parent.plugin);
        button.prop = config.prop;

        config.controllerId && (button.controllerId = config.controllerId);

        parent.children.push(button);

        return button;
    }


    static textField(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_TextField {
        const textField = new UI_TextField(parent.plugin);
        textField.prop = config.prop;
        textField.type = 'text';

        config.controllerId && (textField.controllerId = config.controllerId);

        parent.children.push(textField);

        return textField;
    }

    static grid(parent: UI_Container, config: { controllerId?: string, prop: string, filledIndexProp?: string}): UI_GridSelect {
        const gridSelect = new UI_GridSelect(parent.plugin);
        gridSelect.prop = config.prop;
        gridSelect.filledIndexProp = config.filledIndexProp;

        config.controllerId && (gridSelect.controllerId = config.controllerId);

        parent.children.push(gridSelect);

        return gridSelect;
    }


    ///////////////////////////////////////////// Svg /////////////////////////////////////////////


    static svgRect(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgRect {
        const rect = new UI_SvgRect(parent.plugin);
        rect.prop = config.prop;

        config.controllerId && (rect.controllerId = config.controllerId);
    
        parent.children.push(rect);
    
        return rect;
    }

    static svgCircle(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgCircle {
        const circle = new UI_SvgCircle(parent.plugin);
        circle.prop = config.prop;

        config.controllerId && (circle.controllerId = config.controllerId);
    
        parent.children.push(circle);
    
        return circle;
    }

    static svgPath(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgPath {
        const path = new UI_SvgPath(parent.plugin);
        path.prop = config.prop;

        config.controllerId && (path.controllerId = config.controllerId);
    
        parent.children.push(path);
    
        return path;
    }

    static svgImage(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgImage {
        const image = new UI_SvgImage(parent.plugin);
        image.prop = config.prop;
    
        parent.children.push(image);
    
        return image;
    }

    static svgGroup(parent: UI_Container, config: { controllerId?: string, key: string}): UI_SvgGroup {
        const group = new UI_SvgGroup(parent.plugin);
        group.key = config.key;
        
        parent.children.push(group);
        
        return group;
    }

    ///////////////////////////////////////////// Toolbar /////////////////////////////////////////////

    static toolbar(parent: UI_SvgCanvas): UI_Toolbar {
        const toolbar = new UI_Toolbar(parent.plugin);
        return toolbar;
    }

    static tool(parent: UI_Toolbar, config: { toolId: string }): UI_Tool {
        const tool = new UI_Tool(parent.plugin);
        tool.toolId = config.toolId;

        return tool;
    }

    static tooltip(parent: UI_Element): UI_Tooltip {
        const tooltip = new UI_Tooltip(parent.plugin);

        return tooltip;
    }
}