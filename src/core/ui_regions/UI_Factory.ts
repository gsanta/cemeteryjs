import { UI_Table, UI_TableRow } from './elements/UI_Table';
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
import { UI_Tool } from './elements/toolbar/UI_ToolIcon';
import { UI_Tooltip } from './elements/UI_Tooltip';
import { UI_Element } from './elements/UI_Element';
import { UI_Toolbar } from './elements/toolbar/UI_Toolbar';
import { UI_SvgCanvas } from './elements/UI_SvgCanvas';
import { UI_TableColumn } from "./elements/UI_TableColumn";
import { UI_Row } from './elements/UI_Row';
import { UI_Accordion } from './elements/surfaces/UI_Accordion';
import { UI_ListItem } from './elements/UI_ListItem';
import { UI_SvgForeignObject } from './elements/svg/UI_SvgForeignObject';
import { UI_Box } from './elements/UI_Box';
import { UI_SvgText } from './elements/svg/UI_SvgText';
import { UI_HtmlCanvas } from './elements/UI_HtmlCanvas';
import { UI_ActionIcon } from './elements/toolbar/UI_ActionIcon';
import { UI_IconSeparator } from './elements/toolbar/UI_IconSeparator';
import { UI_Dialog } from './elements/surfaces/UI_Dialog';
import { UI_Plugin } from '../plugins/UI_Plugin';
import { UI_Layout } from './elements/UI_Layout';
import { UI_Image } from './elements/UI_Image';
import { UI_Column } from './elements/UI_Column';
import { UI_TableRowGroup } from './elements/surfaces/table/UI_TableRowGroup';
import { UI_Icon } from './elements/UI_Icon';

export class UI_Factory {
    static layout(plugin: UI_Plugin): UI_Layout {
        const layout = new UI_Layout(plugin, plugin.region);

        return layout;
    }

    static dialog(plugin: UI_Plugin, config: { controllerId?: string }): UI_Dialog {
        const dialog = new UI_Dialog(plugin);

        return dialog;
    }


    static row(parent: UI_Container, config: { controllerId?: string, key: string}): UI_Row {
        const row = new UI_Row(parent.plugin);
        row.key = config && config.key;

        row.generateId(parent);
        parent.children.push(row);

        this.setController(parent, row, config);

        return row;
    }

    static column(parent: UI_Container, config: { controllerId?: string, key: string}): UI_Column {
        const column = new UI_Column(parent.plugin);
        column.key = config && config.key;

        column.generateId(parent);
        parent.children.push(column);

        this.setController(parent, column, config);

        return column;
    }

    static box(parent: UI_Container, config: { controllerId?: string, key: string}): UI_Box {
        const box = new UI_Box(parent.plugin);
        box.key = config.key;
        
        box.generateId(parent);
        parent.children.push(box);

        this.setController(parent, box, config);

        return box;
    }

    static htmlCanvas(parent: UI_Container, config: { controllerId?: string}): UI_HtmlCanvas {
        const htmlCanvas = new UI_HtmlCanvas(parent.plugin);
        parent.children.push(htmlCanvas);

        htmlCanvas.generateId(parent);
        this.setController(parent, htmlCanvas, config);

        return htmlCanvas;
    }

    static svgCanvas(parent: UI_Container, config: { controllerId?: string}): UI_SvgCanvas {
        const svgCanvas = new UI_SvgCanvas(parent.plugin);
        parent.children.push(svgCanvas);

        svgCanvas.generateId(parent);
        this.setController(parent, svgCanvas, config);

        return svgCanvas;
    }

    static accordion(parent: UI_Container, config: { controllerId?: string}): UI_Accordion {
        const accordion = new UI_Accordion(parent.plugin);

        accordion.generateId(parent);
        this.setController(parent, accordion, config);
        parent.children.push(accordion);

        return accordion;
    }

    static text(parent: UI_Container): UI_Text {
        const text = new UI_Text(parent.plugin);

        text.generateId(parent);
        parent.children.push(text);

        return text;
    }

    static image(parent: UI_Container, config: { key: string}): UI_Image {
        const image = new UI_Image(parent.plugin);
        image.key = config.key;

        image.generateId(parent);
        parent.children.push(image);

        return image;
    }

    static icon(parent: UI_Container, config: { prop: string}): UI_Icon {
        const icon = new UI_Icon(parent.plugin);
        icon.prop = config.prop;

        icon.id = `${parent.id}_${icon.elementType}-${icon.prop ? icon.prop : icon.key}`;

        this.setController(parent, icon);
        parent.children.push(icon);

        return icon;
    }

    static listItem(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_ListItem {
        const listItem = new UI_ListItem(parent.plugin);

        listItem.prop = config.prop;
        listItem.generateId(parent);
        this.setController(parent, listItem, config);

        parent.children.push(listItem);

        return listItem;
    }

    static button(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_Button {
        const button = new UI_Button(parent.plugin);
        button.prop = config.prop;

        button.generateId(parent);
        this.setController(parent, button, config);

        parent.children.push(button);

        return button;
    }

    static select(parent: UI_Container, config: { controllerId?: string, valProp: string, listProp: string}) {
        const select = new UI_Select(parent.plugin);
        select.prop = config.valProp;
        select.listProp = config.listProp;

        select.generateId(parent);
        this.setController(parent, select, config);

        parent.children.push(select);

        return select;
    }

    static fileUpload(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_FileUpload {
        const fileUpload = new UI_FileUpload(parent.plugin);
        fileUpload.prop = config.prop;

        fileUpload.generateId(parent);
        this.setController(parent, fileUpload, config);

        parent.children.push(fileUpload);

        return fileUpload;
    }


    static textField(parent: UI_Container, config: { controllerId?: string, prop: string}): UI_TextField {
        const textField = new UI_TextField(parent.plugin);
        textField.prop = config.prop;
        textField.type = 'text';

        textField.generateId(parent);
        this.setController(parent, textField, config);

        parent.children.push(textField);

        return textField;
    }

    static grid(parent: UI_Container, config: { controllerId?: string, prop: string, filledIndexProp?: string}): UI_GridSelect {
        const gridSelect = new UI_GridSelect(parent.plugin);
        gridSelect.prop = config.prop;
        gridSelect.filledIndexProp = config.filledIndexProp;

        gridSelect.generateId(parent);
        this.setController(parent, gridSelect, config);

        parent.children.push(gridSelect);

        return gridSelect;
    }


    ///////////////////////////////////////////// Svg /////////////////////////////////////////////

    static svgText(parent: UI_Container, config: { key: string}): UI_SvgText {
        const text = new UI_SvgText(parent.plugin);
        text.key = config.key;

        text.generateId(parent);

        parent.children.push(text);
    
        return text;
    }

    static svgRect(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgRect {
        const rect = new UI_SvgRect(parent.plugin);
        rect.prop = config.prop;

        rect.generateId(parent);
        this.setController(parent, rect, config);

        config.controllerId && (rect.controllerId = config.controllerId);
    
        parent.children.push(rect);
    
        return rect;
    }

    static svgCircle(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgCircle {
        const circle = new UI_SvgCircle(parent.plugin);
        circle.prop = config.prop;

        circle.generateId(parent);
        this.setController(parent, circle, config);
    
        parent.children.push(circle);
    
        return circle;
    }

    static svgPath(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgPath {
        const path = new UI_SvgPath(parent.plugin);
        path.prop = config.prop;

        path.generateId(parent);
        this.setController(parent, path, config);
    
        parent.children.push(path);
    
        return path;
    }

    static svgImage(parent: UI_Container, config: { controllerId?: string, prop?: string}): UI_SvgImage {
        const image = new UI_SvgImage(parent.plugin);
        image.prop = config.prop;
    
        image.generateId(parent);
        this.setController(parent, image, config);

        parent.children.push(image);
    
        return image;
    }

    static svgGroup(parent: UI_Container, config: { controllerId?: string, key: string}): UI_SvgGroup {
        const group = new UI_SvgGroup(parent.plugin);
        group.key = config.key;
        
        group.generateId(parent);
        this.setController(parent, group, config);

        parent.children.push(group);
        
        return group;
    }

    static svgForeignObject(parent: UI_Container, config: { controllerId?: string, key: string}): UI_SvgForeignObject {
        const foreignObject = new UI_SvgForeignObject(parent.plugin);
        foreignObject.key = config.key;
        
        foreignObject.generateId(parent);
        this.setController(parent, foreignObject, config);

        parent.children.push(foreignObject);
        
        return foreignObject;
    }

    ///////////////////////////////////////////// Toolbar /////////////////////////////////////////////

    static toolbar(parent: UI_SvgCanvas | UI_HtmlCanvas): UI_Toolbar {
        const toolbar = new UI_Toolbar(parent.plugin);

        toolbar.generateId(parent);

        parent._toolbar = toolbar;

        return toolbar;
    }

    static tool(parent: UI_Toolbar, config: { controllerId: string, key?: string, prop?: string }): UI_Tool {
        const tool = new UI_Tool(parent.plugin);
        tool.key = config.key;
        tool.prop = config.prop;

        this.setController(parent, tool, config);
        tool.generateId(parent);

        parent.tools.push(tool);

        return tool;
    }

    static actionIcon(parent: UI_Toolbar, config: { controllerId: string, prop: string }): UI_ActionIcon {
        const actionIcon = new UI_ActionIcon(parent.plugin);
        actionIcon.prop = config.prop;

        this.setController(parent, actionIcon, config);
        actionIcon.generateId(parent);

        parent.tools.push(actionIcon);

        return actionIcon;
    }

    static iconSeparator(parent: UI_Toolbar): UI_IconSeparator {
        const iconSeparator = new UI_IconSeparator(parent.plugin);

        parent.tools.push(iconSeparator);

        return iconSeparator;
    }


    ///////////////////////////////////////////// Table /////////////////////////////////////////////

    static table(parent: UI_Container, config: { controllerId?: string}): UI_Table {
        const table = new UI_Table(parent.plugin);

        table.generateId(parent);
        this.setController(parent, table, config);

        parent.children.push(table);

        return table;
    }

    static tooltip(parent: UI_Tool | UI_ActionIcon | UI_Icon, config: { anchorId?: string }): UI_Tooltip {
        const tooltip = new UI_Tooltip(parent.plugin);
        
        (config && config.anchorId) && (tooltip.anchorId = config.anchorId);

        parent._tooltip = tooltip;

        return tooltip;
    }

    static tableColumn(parent: UI_Container, config: { controllerId?: string}) {
        const column = new UI_TableColumn(parent.plugin);

        column.generateId(parent);
        this.setController(parent, column, config);

        parent.children.push(column);

        return column;
    }

    static tableRow(parent: UI_Table, config: {isHeader?: boolean, controllerId?: string}) {
        const row = new UI_TableRow(parent.plugin);
        row.isHeader = config.isHeader;

        this.setController(parent, row, config);
        row.generateId(parent);

        parent.children.push(row);

        return row;
    }

    static tableRowGroup(parent: UI_Table, config: {key: string}) {
        const row = new UI_TableRowGroup(parent.plugin);

        row.generateId(parent);

        parent.children.push(row);

        return row;
    }

    private static setController(parent: UI_Element, current: UI_Element, config?: {controllerId?: string}) {
        if (config && config.controllerId) {
            current.controllerId = config.controllerId;
        } else {
            current.controllerId = parent.controllerId;
        }
    }
}