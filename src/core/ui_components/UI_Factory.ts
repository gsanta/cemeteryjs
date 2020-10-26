import { AbstractCanvasPlugin } from '../plugin/AbstractCanvasPlugin';
import { Registry } from '../Registry';
import { UI_GizmoLayer } from './elements/gizmo/UI_GizmoLayer';
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
import { UI_Tool } from './elements/toolbar/UI_Tool';
import { UI_Box } from './elements/UI_Box';
import { UI_Button } from "./elements/UI_Button";
import { UI_Column } from './elements/UI_Column';
import { UI_Container } from './elements/UI_Container';
import { UI_Element, UI_ElementConfig } from './elements/UI_Element';
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
import { UI_ToolbarDropdown } from './elements/toolbar/UI_ToolbarDropdown';
import { UI_ToolDropdownHeader } from './elements/toolbar/UI_ToolDropdownHeader';
import { UI_SvgDef } from './elements/svg/UI_SvgDef';
import { UI_SvgMarker } from './elements/svg/UI_SvgMarker';

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
        const element = new UI_Row(parent.pluginId);
        element.key = config && config.key;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static column(parent: UI_Container, config: UI_ElementConfig): UI_Column {
        const element = new UI_Column(parent.pluginId);
        element.key = config && config.key;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static box(parent: UI_Container, config: UI_ElementConfig): UI_Box {
        const element = new UI_Box(parent.pluginId);
        element.key = config.key;
        
        element.generateId(parent);
        this.setupElement(parent, element);
        parent.children.push(element);

        return element;
    }

    static htmlCanvas(parent: UI_Container, config: UI_ElementConfig): UI_HtmlCanvas {
        const element = new UI_HtmlCanvas(parent.pluginId);
        parent.children.push(element);

        element.generateId(parent);
        this.setupElement(parent, element);

        return element;
    }

    static svgCanvas(parent: UI_Container, config: UI_ElementConfig): UI_SvgCanvas {
        const element = new UI_SvgCanvas(parent.pluginId);
        parent.children.push(element);

        element.generateId(parent);
        this.setupElement(parent, element);

        return element;
    }

    static dropLayer(parent: UI_HtmlCanvas | UI_SvgCanvas, config: UI_ElementConfig): UI_DropLayer {
        const element = new UI_DropLayer(parent.pluginId);

        config && (element.prop = config.prop);

        parent._dropLayer = element;

        element.generateId(parent);
        this.setupElement(parent, element);

        return element;
    }

    static gizmoLayer(parent: UI_HtmlCanvas | UI_SvgCanvas, config: UI_ElementConfig): UI_GizmoLayer {
        const element = new UI_GizmoLayer(parent.pluginId);

        config && (element.prop = config.prop);

        parent._gizmoLayer = element;

        element.generateId(parent);
        this.setupElement(parent, element);

        return element;
    }


    static accordion(parent: UI_Container, config: UI_ElementConfig): UI_Accordion {
        const element = new UI_Accordion(parent.pluginId);

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static text(parent: UI_Container, config: UI_ElementConfig): UI_Text {
        const element = new UI_Text(parent.pluginId);

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static image(parent: UI_Container, config: UI_ElementConfig): UI_Image {
        const element = new UI_Image(parent.pluginId);
        element.key = config.key;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static icon(parent: UI_Container, config: UI_ElementConfig): UI_Icon {
        const element = new UI_Icon(parent.pluginId);
        element.prop = config.prop;

        element.id = `${parent.id}_${element.elementType}-${element.prop ? element.prop : element.key}`;
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static listItem(parent: UI_Container, config: {prop: string, dropTargetPlugin: AbstractCanvasPlugin, dropId: string}): UI_ListItem {
        const element = new UI_ListItem(parent.pluginId);

        if (config) {
            element.prop = config.prop;
            element.listItemId = config.dropId;
            element.dropTargetPlugin = config.dropTargetPlugin;
            element.generateId(parent);

        }

        this.setupElement(parent, element);

        parent.children.push(element);
        return element;
    }

    static button(parent: UI_Container, config: UI_ElementConfig): UI_Button {
        const element = new UI_Button(parent.pluginId);
        element.prop = config.prop;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static select(parent: UI_Container, config: { prop: string, target?: string}) {
        const element = new UI_Select(parent.pluginId, config.target);
        element.prop = config.prop;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static fileUpload(parent: UI_Container, config: UI_ElementConfig): UI_FileUpload {
        const element = new UI_FileUpload(parent.pluginId);
        element.prop = config.prop;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static textField(parent: UI_Container, config: { prop: string, target?: string}): UI_TextField {
        const element = new UI_TextField(parent.pluginId, config.target);
        element.prop = config.prop;
        element.type = 'text';

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static grid(parent: UI_Container, config: { prop: string, filledIndexProp?: string}): UI_GridSelect {
        const element = new UI_GridSelect(parent.pluginId);
        element.prop = config.prop;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }
Id

    ///////////////////////////////////////////// Svg /////////////////////////////////////////////

    static svgText(parent: UI_Container, config: UI_ElementConfig): UI_SvgText {
        const element = new UI_SvgText(parent.pluginId);
        element.key = config && config.key;

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);
    
        return element;
    }

    static svgRect(parent: UI_Container, config: UI_ElementConfig): UI_SvgRect {
        const element = new UI_SvgRect(parent.pluginId);
        element.prop = config.prop;

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        element.generateId(parent);
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgLine(parent: UI_Container, config: UI_ElementConfig): UI_SvgLine {
        const element = new UI_SvgLine(parent.pluginId);
        element.prop = config.prop;

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        element.generateId(parent);
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgCircle(parent: UI_Container, config: UI_ElementConfig): UI_SvgCircle {
        const element = new UI_SvgCircle(parent.pluginId);
        element.prop = config.prop;

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        element.generateId(parent);
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgPath(parent: UI_Container, config: UI_ElementConfig): UI_SvgPath {
        const element = new UI_SvgPath(parent.pluginId);
        element.prop = config.prop;

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        element.generateId(parent);
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgPolygon(parent: UI_Container, config: UI_ElementConfig): UI_SvgPolygon {
        const element = new UI_SvgPolygon(parent.pluginId);
        element.prop = config.prop;

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        element.generateId(parent);
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgImage(parent: UI_Container, config: UI_ElementConfig): UI_SvgImage {
        const element = new UI_SvgImage(parent.pluginId);
        element.prop = config.prop;
    
        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);
    
        return element;
    }

    static svgGroup(parent: UI_Container, config: UI_ElementConfig): UI_SvgGroup {
        const element = new UI_SvgGroup(parent.pluginId);
        element.key = config.key;
        
        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);
        
        return element;
    }

    static svgDef(parent: UI_Container, config: UI_ElementConfig): UI_SvgDef {
        const element = new UI_SvgDef(parent.pluginId);
        element.key = config.key;
        
        element.generateId(parent);

        parent.children.push(element);
        
        return element;
    }

    static svgMarker(parent: UI_Container, config: UI_ElementConfig): UI_SvgMarker {
        const element = new UI_SvgMarker(parent.pluginId);
        element.key = config.key;
        
        element.generateId(parent);

        parent.children.push(element);
        
        return element;
    }

    static svgForeignObject(parent: UI_Container, config: UI_ElementConfig): UI_SvgForeignObject {
        const element = new UI_SvgForeignObject(parent.pluginId);
        element.key = config.key;
        
        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);
        
        return element;
    }

    ///////////////////////////////////////////// Toolbar /////////////////////////////////////////////Id

    static toolbar(parent: UI_SvgCanvas | UI_HtmlCanvas, config: UI_ElementConfig): UI_Toolbar {
        const element = new UI_Toolbar(parent.pluginId, parent.pluginId);

        element.generateId(parent);
        this.setupElement(parent, element);

        parent._toolbar = element;

        return element;
    }

    static toolbarDropdown(parent: UI_Toolbar, config: UI_ElementConfig): UI_ToolbarDropdown {
        const element = new UI_ToolbarDropdown(parent.pluginId);
        element.prop = config.prop;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static toolDropdownHeader(parent: UI_ToolbarDropdown, config: UI_ElementConfig): UI_ToolDropdownHeader {
        const element = new UI_ToolDropdownHeader(parent.pluginId);
        element.prop = config.prop;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent._header = element;

        return element;
    }

    static tool(parent: UI_Toolbar | UI_ToolDropdownHeader | UI_ToolbarDropdown, config: UI_ElementConfig): UI_Tool {
        const element = new UI_Tool(parent.pluginId);
        element.key = `key-${config.prop}`;
        element.prop = config.prop;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static actionIcon(parent: UI_Toolbar, config: UI_ElementConfig): UI_ActionIcon {
        const element = new UI_ActionIcon(parent.pluginId);
        element.prop = config.prop;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static iconSeparator(parent: UI_Toolbar, config: UI_ElementConfig): UI_IconSeparator {
        const element = new UI_IconSeparator(parent.pluginId);

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }


    ///////////////////////////////////////////// Table /////////////////////////////////////////////

    static table(parent: UI_Container, config: UI_ElementConfig): UI_Table {
        const element = new UI_Table(parent.pluginId);

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static tooltip(parent: UI_Tool | UI_ActionIcon | UI_Icon, config: { anchorId?: string }): UI_Tooltip {
        const element = new UI_Tooltip(parent.pluginId);
        
        (config && config.anchorId) && (element.anchorId = config.anchorId);
        this.setupElement(parent, element);

        parent._tooltip = element;

        return element;
    }

    static tableColumn(parent: UI_Container, config: UI_ElementConfig) {
        const element = new UI_TableColumn(parent.pluginId);

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static tableRow(parent: UI_Table, config: {isHeader?: boolean}) {
        const element = new UI_TableRow(parent.pluginId);
        element.isHeader = config.isHeader;

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static tableRowGroup(parent: UI_Table, config: UI_ElementConfig) {
        const element = new UI_TableRowGroup(parent.pluginId);

        element.generateId(parent);
        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    private static setupElement(parentElement: UI_Element, element: UI_Element) {
        element.controllerId = parentElement.controllerId;
    }
}