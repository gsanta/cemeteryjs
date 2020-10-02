import { AbstractCanvasPlugin } from '../plugin/AbstractCanvasPlugin';
import { UI_Plugin } from '../plugin/UI_Plugin';
import { Registry } from '../Registry';
import { UI_DropLayer } from './elements/surfaces/canvases/UI_DropLayer';
import { UI_TableRowGroup } from './elements/surfaces/table/UI_TableRowGroup';
import { UI_Accordion } from './elements/surfaces/UI_Accordion';
import { UI_Dialog } from './elements/surfaces/UI_Dialog';
import { UI_SvgCircle } from './elements/svg/UI_SvgCircle';
import { UI_SvgForeignObject } from './elements/svg/UI_SvgForeignObject';
import { UI_SvgGroup } from './elements/svg/UI_SvgGroup';
import { UI_SvgImage } from './elements/svg/UI_SvgImage';
import { UI_SvgLine } from './elements/svg/UI_SvgLine';
import { UI_SvgPath } from './elements/svg/UI_SvgPath';
import { UI_SvgPolygon } from './elements/svg/UI_SvgPolygon';
import { UI_SvgRect } from './elements/svg/UI_SvgRect';
import { UI_SvgText } from './elements/svg/UI_SvgText';
import { UI_ActionIcon } from './elements/toolbar/UI_ActionIcon';
import { UI_IconSeparator } from './elements/toolbar/UI_IconSeparator';
import { UI_Toolbar } from './elements/toolbar/UI_Toolbar';
import { UI_Tool } from './elements/toolbar/UI_ToolIcon';
import { UI_Box } from './elements/UI_Box';
import { UI_Button } from "./elements/UI_Button";
import { UI_Column } from './elements/UI_Column';
import { UI_Container } from './elements/UI_Container';
import { UI_ElementConfig } from './elements/UI_Element';
import { UI_FileUpload } from "./elements/UI_FileUpload";
import { UI_GridSelect } from './elements/UI_GridSelect';
import { UI_HtmlCanvas } from './elements/UI_HtmlCanvas';
import { UI_Icon } from './elements/UI_Icon';
import { UI_Image } from './elements/UI_Image';
import { UI_Layout } from './elements/UI_Layout';
import { UI_ListItem } from './elements/UI_ListItem';
import { UI_Row } from './elements/UI_Row';
import { UI_Select } from "./elements/UI_Select";
import { UI_SvgCanvas } from './elements/UI_SvgCanvas';
import { UI_Table, UI_TableRow } from './elements/UI_Table';
import { UI_TableColumn } from "./elements/UI_TableColumn";
import { UI_Text } from "./elements/UI_Text";
import { UI_TextField } from './elements/UI_TextField';
import { UI_Tooltip } from './elements/UI_Tooltip';

export class UI_Factory {

    static registry: Registry;

    static layout(pluginId: string, config: UI_ElementConfig): UI_Layout {
        const layout = new UI_Layout(pluginId);

        return layout;
    }

    static dialog(pluginId: string, config: UI_ElementConfig): UI_Dialog {
        const dialog = new UI_Dialog(pluginId);

        return dialog;
    }


    static row(parent: UI_Container, config: UI_ElementConfig): UI_Row {
        const row = new UI_Row(parent.pluginId);
        row.key = config && config.key;

        row.generateId(parent);
        parent.children.push(row);

        return row;
    }

    static column(parent: UI_Container, config: UI_ElementConfig): UI_Column {
        const column = new UI_Column(parent.pluginId);
        column.key = config && config.key;

        column.generateId(parent);
        parent.children.push(column);

        return column;
    }

    static box(parent: UI_Container, config: UI_ElementConfig): UI_Box {
        const box = new UI_Box(parent.pluginId);
        box.key = config.key;
        
        box.generateId(parent);
        parent.children.push(box);

        return box;
    }

    static htmlCanvas(parent: UI_Container, config: UI_ElementConfig): UI_HtmlCanvas {
        const htmlCanvas = new UI_HtmlCanvas(parent.pluginId);
        parent.children.push(htmlCanvas);

        htmlCanvas.generateId(parent);

        return htmlCanvas;
    }

    static svgCanvas(parent: UI_Container, config: UI_ElementConfig): UI_SvgCanvas {
        const svgCanvas = new UI_SvgCanvas(parent.pluginId);
        parent.children.push(svgCanvas);

        svgCanvas.generateId(parent);

        return svgCanvas;
    }

    static dropLayer(parent: UI_HtmlCanvas | UI_SvgCanvas, config: UI_ElementConfig): UI_DropLayer {
        const dropLayer = new UI_DropLayer(parent.pluginId);

        config && (dropLayer.prop = config.prop);

        parent._dropLayer = dropLayer;

        dropLayer.generateId(parent);

        return dropLayer;
    }

    static accordion(parent: UI_Container, config: UI_ElementConfig): UI_Accordion {
        const accordion = new UI_Accordion(parent.pluginId);

        accordion.generateId(parent);
        parent.children.push(accordion);

        return accordion;
    }

    static text(parent: UI_Container, config: UI_ElementConfig): UI_Text {
        const text = new UI_Text(parent.pluginId);

        text.generateId(parent);
        parent.children.push(text);

        return text;
    }

    static image(parent: UI_Container, config: UI_ElementConfig): UI_Image {
        const image = new UI_Image(parent.pluginId);
        image.key = config.key;

        image.generateId(parent);
        parent.children.push(image);

        return image;
    }

    static icon(parent: UI_Container, config: UI_ElementConfig): UI_Icon {
        const icon = new UI_Icon(parent.pluginId);
        icon.prop = config.prop;

        icon.id = `${parent.id}_${icon.elementType}-${icon.prop ? icon.prop : icon.key}`;

        parent.children.push(icon);

        return icon;
    }

    static listItem(parent: UI_Container, config: {prop: string, dropTargetPlugin: AbstractCanvasPlugin, dropId: string}): UI_ListItem {
        const listItem = new UI_ListItem(parent.pluginId);

        if (config) {
            listItem.prop = config.prop;
            listItem.listItemId = config.dropId;
            listItem.dropTargetPlugin = config.dropTargetPlugin;
            listItem.generateId(parent);

        }

        parent.children.push(listItem);
        return listItem;
    }

    static button(parent: UI_Container, config: UI_ElementConfig): UI_Button {
        const button = new UI_Button(parent.pluginId);
        button.prop = config.prop;

        button.generateId(parent);

        parent.children.push(button);

        return button;
    }

    static select(parent: UI_Container, config: { prop: string, target?: string}) {
        const select = new UI_Select(parent.pluginId, config.target);
        select.prop = config.prop;

        select.generateId(parent);

        parent.children.push(select);

        return select;
    }

    static fileUpload(parent: UI_Container, config: UI_ElementConfig): UI_FileUpload {
        const fileUpload = new UI_FileUpload(parent.pluginId);
        fileUpload.prop = config.prop;

        fileUpload.generateId(parent);

        parent.children.push(fileUpload);

        return fileUpload;
    }

    static textField(parent: UI_Container, config: { prop: string, target?: string}): UI_TextField {
        const textField = new UI_TextField(parent.pluginId, config.target);
        textField.prop = config.prop;
        textField.type = 'text';

        textField.generateId(parent);

        parent.children.push(textField);

        return textField;
    }

    static grid(parent: UI_Container, config: { prop: string, filledIndexProp?: string}): UI_GridSelect {
        const gridSelect = new UI_GridSelect(parent.pluginId);
        gridSelect.prop = config.prop;

        gridSelect.generateId(parent);

        parent.children.push(gridSelect);

        return gridSelect;
    }
Id

    ///////////////////////////////////////////// Svg /////////////////////////////////////////////

    static svgText(parent: UI_Container, config: UI_ElementConfig): UI_SvgText {
        const text = new UI_SvgText(parent.pluginId);
        text.key = config && config.key;

        text.generateId(parent);

        parent.children.push(text);
    
        return text;
    }

    static svgRect(parent: UI_Container, config: UI_ElementConfig): UI_SvgRect {
        const rect = new UI_SvgRect(parent.pluginId);
        rect.prop = config.prop;

        rect.generateId(parent);
    
        parent.children.push(rect);
    
        return rect;
    }

    static svgLine(parent: UI_Container, config: UI_ElementConfig): UI_SvgLine {
        const line = new UI_SvgLine(parent.pluginId);
        line.prop = config.prop;

        line.generateId(parent);
    
        parent.children.push(line);
    
        return line;
    }

    static svgCircle(parent: UI_Container, config: UI_ElementConfig): UI_SvgCircle {
        const circle = new UI_SvgCircle(parent.pluginId);
        circle.prop = config.prop;

        circle.generateId(parent);
    
        parent.children.push(circle);
    
        return circle;
    }

    static svgPath(parent: UI_Container, config: UI_ElementConfig): UI_SvgPath {
        const path = new UI_SvgPath(parent.pluginId);
        path.prop = config.prop;

        path.generateId(parent);
    
        parent.children.push(path);
    
        return path;
    }

    static svgPolygon(parent: UI_Container, config: UI_ElementConfig): UI_SvgPolygon {
        const polygon = new UI_SvgPolygon(parent.pluginId);
        polygon.prop = config.prop;

        polygon.generateId(parent);
    
        parent.children.push(polygon);
    
        return polygon;
    }

    static svgImage(parent: UI_Container, config: UI_ElementConfig): UI_SvgImage {
        const image = new UI_SvgImage(parent.pluginId);
        image.prop = config.prop;
    
        image.generateId(parent);

        parent.children.push(image);
    
        return image;
    }

    static svgGroup(parent: UI_Container, config: UI_ElementConfig): UI_SvgGroup {
        const group = new UI_SvgGroup(parent.pluginId);
        group.key = config.key;
        
        group.generateId(parent);

        parent.children.push(group);
        
        return group;
    }

    static svgForeignObject(parent: UI_Container, config: UI_ElementConfig): UI_SvgForeignObject {
        const foreignObject = new UI_SvgForeignObject(parent.pluginId);
        foreignObject.key = config.key;
        
        foreignObject.generateId(parent);

        parent.children.push(foreignObject);
        
        return foreignObject;
    }

    ///////////////////////////////////////////// Toolbar /////////////////////////////////////////////Id

    static toolbar(parent: UI_SvgCanvas | UI_HtmlCanvas, config: UI_ElementConfig): UI_Toolbar {
        const toolbar = new UI_Toolbar(parent.pluginId, parent.pluginId);

        toolbar.generateId(parent);

        parent._toolbar = toolbar;

        return toolbar;
    }

    static tool(parent: UI_Toolbar, toolId: string): UI_Tool {
        const tool = new UI_Tool(parent.pluginId);
        tool.key = `key-${toolId}`;
        tool.toolId = toolId;

        tool.generateId(parent);

        parent.tools.push(tool);

        return tool;
    }

    static actionIcon(parent: UI_Toolbar, config: UI_ElementConfig): UI_ActionIcon {
        const actionIcon = new UI_ActionIcon(parent.pluginId);
        actionIcon.prop = config.prop;

        actionIcon.generateId(parent);

        parent.tools.push(actionIcon);

        return actionIcon;
    }

    static iconSeparator(parent: UI_Toolbar, config: UI_ElementConfig): UI_IconSeparator {
        const iconSeparator = new UI_IconSeparator(parent.pluginId);

        parent.tools.push(iconSeparator);

        return iconSeparator;
    }


    ///////////////////////////////////////////// Table /////////////////////////////////////////////

    static table(parent: UI_Container, config: UI_ElementConfig): UI_Table {
        const table = new UI_Table(parent.pluginId);

        table.generateId(parent);

        parent.children.push(table);

        return table;
    }

    static tooltip(parent: UI_Tool | UI_ActionIcon | UI_Icon, config: { anchorId?: string }): UI_Tooltip {
        const tooltip = new UI_Tooltip(parent.pluginId);
        
        (config && config.anchorId) && (tooltip.anchorId = config.anchorId);

        parent._tooltip = tooltip;

        return tooltip;
    }

    static tableColumn(parent: UI_Container, config: UI_ElementConfig) {
        const column = new UI_TableColumn(parent.pluginId);

        column.generateId(parent);

        parent.children.push(column);

        return column;
    }

    static tableRow(parent: UI_Table, config: {isHeader?: boolean}) {
        const row = new UI_TableRow(parent.pluginId);
        row.isHeader = config.isHeader;

        row.generateId(parent);

        parent.children.push(row);

        return row;
    }

    static tableRowGroup(parent: UI_Table, config: UI_ElementConfig) {
        const row = new UI_TableRowGroup(parent.pluginId);

        row.generateId(parent);

        parent.children.push(row);

        return row;
    }
}