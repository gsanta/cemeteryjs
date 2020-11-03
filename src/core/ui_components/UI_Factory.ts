import { AbstractCanvasPanel } from '../plugin/AbstractCanvasPanel';
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
import { UI_SvgDefs } from './elements/svg/UI_SvgDef';
import { UI_SvgMarker } from './elements/svg/UI_SvgMarker';

export class UI_Factory {

    static registry: Registry;

    static layout(pluginId: string, config: UI_ElementConfig): UI_Layout {
        const layout = new UI_Layout({pluginId: pluginId, ...config});

        return layout;
    }

    static dialog(pluginId: string, config: UI_ElementConfig): UI_Dialog {
        const dialog = new UI_Dialog({pluginId: pluginId, ...config});

        return dialog;
    }


    static row(parent: UI_Container, config: UI_ElementConfig): UI_Row {
        const element = new UI_Row({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static column(parent: UI_Container, config: UI_ElementConfig): UI_Column {
        const element = new UI_Column({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static box(parent: UI_Container, config: UI_ElementConfig): UI_Box {
        const element = new UI_Box({pluginId: parent.pluginId, ...config});
        
        this.setupElement(parent, element);
        parent.children.push(element);

        return element;
    }

    static htmlCanvas(parent: UI_Container, config: UI_ElementConfig): UI_HtmlCanvas {
        const element = new UI_HtmlCanvas({pluginId: parent.pluginId, ...config});
        parent.children.push(element);

        this.setupElement(parent, element);

        return element;
    }

    static svgCanvas(parent: UI_Container, config: UI_ElementConfig): UI_SvgCanvas {
        const element = new UI_SvgCanvas({pluginId: parent.pluginId, ...config});
        parent.children.push(element);

        this.setupElement(parent, element);

        return element;
    }

    static dropLayer(parent: UI_HtmlCanvas | UI_SvgCanvas, config: UI_ElementConfig): UI_DropLayer {
        const element = new UI_DropLayer({pluginId: parent.pluginId, ...config});

        parent._dropLayer = element;

        this.setupElement(parent, element);

        return element;
    }

    static gizmoLayer(parent: UI_HtmlCanvas | UI_SvgCanvas, config: UI_ElementConfig): UI_GizmoLayer {
        const element = new UI_GizmoLayer({pluginId: parent.pluginId, ...config});

        parent._gizmoLayer = element;

        this.setupElement(parent, element);

        return element;
    }


    static accordion(parent: UI_Container, config: UI_ElementConfig): UI_Accordion {
        const element = new UI_Accordion({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static text(parent: UI_Container, config: UI_ElementConfig): UI_Text {
        const element = new UI_Text({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static image(parent: UI_Container, config: UI_ElementConfig): UI_Image {
        const element = new UI_Image({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static icon(parent: UI_Container, config: UI_ElementConfig): UI_Icon {
        const element = new UI_Icon({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static listItem(parent: UI_Container, config: {key: string, dropTargetPlugin: AbstractCanvasPanel, dropId: string}): UI_ListItem {
        const element = new UI_ListItem({pluginId: parent.pluginId, ...config});

        if (config) {
            element.listItemId = config.dropId;
            element.dropTargetPlugin = config.dropTargetPlugin;
    
        }

        this.setupElement(parent, element);

        parent.children.push(element);
        return element;
    }

    static button(parent: UI_Container, config: UI_ElementConfig): UI_Button {
        const element = new UI_Button({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static select(parent: UI_Container, config: { key: string, target?: string}) {
        const element = new UI_Select({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static fileUpload(parent: UI_Container, config: UI_ElementConfig): UI_FileUpload {
        const element = new UI_FileUpload({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static textField(parent: UI_Container, config: { key: string, target?: string}): UI_TextField {
        const element = new UI_TextField({pluginId: parent.pluginId, ...config});
        element.type = 'text';

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static grid(parent: UI_Container, config: { key: string, filledIndexProp?: string}): UI_GridSelect {
        const element = new UI_GridSelect({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }
Id

    ///////////////////////////////////////////// Svg /////////////////////////////////////////////

    static svgText(parent: UI_Container, config: UI_ElementConfig): UI_SvgText {
        const element = new UI_SvgText({pluginId: parent.pluginId, ...config});

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        this.setupElement(parent, element);

        parent.children.push(element);
    
        return element;
    }

    static svgRect(parent: UI_Container, config: UI_ElementConfig): UI_SvgRect {
        const element = new UI_SvgRect({pluginId: parent.pluginId, ...config});

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgLine(parent: UI_Container, config: UI_ElementConfig): UI_SvgLine {
        const element = new UI_SvgLine({pluginId: parent.pluginId, ...config});

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgCircle(parent: UI_Container, config: UI_ElementConfig): UI_SvgCircle {
        const element = new UI_SvgCircle({pluginId: parent.pluginId, ...config});

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgPath(parent: UI_Container, config: UI_ElementConfig): UI_SvgPath {
        const element = new UI_SvgPath({pluginId: parent.pluginId, ...config});

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgPolygon(parent: UI_Container, config: UI_ElementConfig): UI_SvgPolygon {
        const element = new UI_SvgPolygon({pluginId: parent.pluginId, ...config});

        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        this.setupElement(parent, element);
    
        parent.children.push(element);
    
        return element;
    }

    static svgImage(parent: UI_Container, config: UI_ElementConfig): UI_SvgImage {
        const element = new UI_SvgImage({pluginId: parent.pluginId, ...config});
    
        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        this.setupElement(parent, element);

        parent.children.push(element);
    
        return element;
    }

    static svgGroup(parent: UI_Container, config: UI_ElementConfig): UI_SvgGroup {
        const element = new UI_SvgGroup({ pluginId: parent.pluginId, ...config});
        
        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        this.setupElement(parent, element);

        parent.children.push(element);
        
        return element;
    }

    static svgDef(parent: UI_Container, config: UI_ElementConfig): UI_SvgDefs {
        const element = new UI_SvgDefs({ pluginId: parent.pluginId, ...config});

        parent.children.push(element);
        
        return element;
    }

    static svgMarker(parent: UI_Container, config: {key: string, uniqueId: string}): UI_SvgMarker {
        const element = new UI_SvgMarker({pluginId: parent.pluginId, ...config});

        parent.children.push(element);
        
        return element;
    }

    static svgForeignObject(parent: UI_Container, config: UI_ElementConfig): UI_SvgForeignObject {
        const element = new UI_SvgForeignObject({pluginId: parent.pluginId, ...config});
        
        element.scopedToolId = parent.scopedToolId;
        element.data = parent.data;
        this.setupElement(parent, element);

        parent.children.push(element);
        
        return element;
    }

    ///////////////////////////////////////////// Toolbar /////////////////////////////////////////////Id

    static toolbar(parent: UI_SvgCanvas | UI_HtmlCanvas, config: UI_ElementConfig): UI_Toolbar {
        const element = new UI_Toolbar({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent._toolbar = element;

        return element;
    }

    static toolbarDropdown(parent: UI_Toolbar, config: UI_ElementConfig): UI_ToolbarDropdown {
        const element = new UI_ToolbarDropdown({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static toolDropdownHeader(parent: UI_ToolbarDropdown, config: UI_ElementConfig): UI_ToolDropdownHeader {
        const element = new UI_ToolDropdownHeader({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent._header = element;

        return element;
    }

    static tool(parent: UI_Toolbar | UI_ToolDropdownHeader | UI_ToolbarDropdown, config: UI_ElementConfig): UI_Tool {
        const element = new UI_Tool({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static actionIcon(parent: UI_Toolbar, config: {key: string, uniqueId: string}): UI_ActionIcon {
        const element = new UI_ActionIcon({pluginId: parent.pluginId, ...config });
        element.pluginId = parent.pluginId;

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static iconSeparator(parent: UI_Toolbar, config: UI_ElementConfig): UI_IconSeparator {
        const element = new UI_IconSeparator({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    ///////////////////////////////////////////// Table /////////////////////////////////////////////

    static table(parent: UI_Container, config: UI_ElementConfig): UI_Table {
        const element = new UI_Table({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static tooltip(parent: UI_Tool | UI_ActionIcon | UI_Icon, config: { anchorId?: string }): UI_Tooltip {
        const element = new UI_Tooltip({pluginId: parent.pluginId, ...config});
        
        (config && config.anchorId) && (element.anchorId = config.anchorId);
        this.setupElement(parent, element);

        parent._tooltip = element;

        return element;
    }

    static tableColumn(parent: UI_Container, config: UI_ElementConfig) {
        const element = new UI_TableColumn({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static tableRow(parent: UI_Table, config: {isHeader?: boolean}) {
        const element = new UI_TableRow({pluginId: parent.pluginId, ...config});
        element.isHeader = config.isHeader;

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    static tableRowGroup(parent: UI_Table, config: UI_ElementConfig) {
        const element = new UI_TableRowGroup({pluginId: parent.pluginId, ...config});

        this.setupElement(parent, element);

        parent.children.push(element);

        return element;
    }

    private static setupElement(parentElement: UI_Element, element: UI_Element) {
        element.controllerId = parentElement.controllerId;
    }
}