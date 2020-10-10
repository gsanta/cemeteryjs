import { UI_Element } from './elements/UI_Element';
import { RowComp } from './react/layout/RowComp';
import * as React from 'react';
import { Registry } from '../Registry';
import { ButtonComp } from './react/inputs/ButtonComp';
import { SelectComp } from './react/inputs/SelectComp';
import { TextFieldComp } from './react/inputs/TextFieldComp';
import { UI_Accordion } from './elements/surfaces/UI_Accordion';
import { AccordionTabComp } from './react/surfaces/AccordionTabComp';
import { UI_FileUpload } from './elements/UI_FileUpload';
import { FileUploadComp } from './react/inputs/FileUploadComp';
import { UI_Row } from './elements/UI_Row';
import { UI_Button } from './elements/UI_Button';
import { UI_ElementType } from './elements/UI_ElementType';
import { UI_TextField } from './elements/UI_TextField';
import { UI_Container } from './elements/UI_Container';
import { UI_Select } from './elements/UI_Select';
import { UI_GridSelect } from './elements/UI_GridSelect';
import { GridSelectComp } from './react/inputs/GridSelectComp';
import { TableComp } from './react/table/TableComp';
import { TextComp } from './react/text/TextComp';
import { ImageComp } from './react/text/ImageComp';
import { TooltipComp } from './react/text/TooltipComp';
import { TableRowComp } from './react/table/TableRowComp';
import { TableColumnComp } from './react/table/TableColumnComp';
import { UI_Table, UI_TableRow } from './elements/UI_Table';
import { UI_TableColumn } from './elements/UI_TableColumn';
import { UI_Text } from './elements/UI_Text';
import { UI_SvgRect } from './elements/svg/UI_SvgRect';
import { SvgRectComp } from './react/svg/SvgRectComp';
import { UI_SvgGroup } from './elements/svg/UI_SvgGroup';
import { SvgGroupComp } from './react/svg/SvgGroupComp';
import { CanvasComp } from './react/surfaces/canvas/CanvasComp';
import { UI_SvgCanvas } from './elements/UI_SvgCanvas';
import { UI_SvgCircle } from './elements/svg/UI_SvgCircle';
import { SvgCircleComp } from './react/svg/SvgCircleComp';
import { UI_SvgImage } from './elements/svg/UI_SvgImage';
import { SvgImageComp } from './react/svg/SvgImageComp';
import { UI_SvgPath } from './elements/svg/UI_SvgPath';
import { SvgPathComp } from './react/svg/SvgPathComp';
import { UI_Toolbar } from './elements/toolbar/UI_Toolbar';
import { ToolbarComp } from './react/surfaces/toolbar/ToolbarComp';
import { UI_Tool } from './elements/toolbar/UI_ToolIcon';
import { UI_Tooltip } from './elements/UI_Tooltip';
import { UI_ListItem } from './elements/UI_ListItem';
import { UI_SvgForeignObject } from './elements/svg/UI_SvgForeignObject';
import { ForeignObjectComp } from './react/svg/ForeignObjectComp';
import { BoxComp } from './react/layout/BoxComp';
import { UI_Box } from './elements/UI_Box';
import { UI_SvgText } from './elements/svg/UI_SvgText';
import { UI_HtmlCanvas } from './elements/UI_HtmlCanvas';
import { UI_ActionIcon } from './elements/toolbar/UI_ActionIcon';
import { ActionIconComp } from './react/surfaces/toolbar/ActionIconComp';
import { ToolComp } from './react/surfaces/toolbar/ToolComp';
import { IconSeparatorComp } from './react/surfaces/toolbar/IconSeparatorComp';
import { UI_Dialog } from './elements/surfaces/UI_Dialog';
import { UI_Image } from './elements/UI_Image';
import { UI_Column } from './elements/UI_Column';
import { ColumnComp } from './react/layout/ColumnComp';
import { UI_TableRowGroup } from './elements/surfaces/table/UI_TableRowGroup';
import { TableRowGroupComp } from './react/table/TableRowGroupComp';
import { UI_Icon } from './elements/UI_Icon';
import { IconComp } from './react/text/IconComp';
import { UI_DropLayer } from './elements/surfaces/canvases/UI_DropLayer';
import { DropLayerComp } from './react/surfaces/canvas/DropLayerComp';
import { SvgTextComp } from './react/svg/SvgTextComp';
import { UI_SvgLine } from './elements/svg/UI_SvgLine';
import { SvgLineComp } from './react/svg/SvgLineComp';
import { ListItemComp } from './react/data_display/ListItemComp';
import { DialogComp } from './react/dialogs/DialogComp';
import { UI_Plugin } from '../plugin/UI_Plugin';
import { UI_SvgPolygon } from './elements/svg/UI_SvgPolygon';
import { SvgPolygonComp } from './react/svg/SvgPolygonComp';
import { UI_GizmoLayer } from './elements/gizmo/UI_GizmoLayer';
import { GizmoLayerComp } from './react/surfaces/canvas/GizmoLayerComp';


export class UI_Builder {

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    build(plugin: UI_Plugin): JSX.Element {
        return this.buildContainer(plugin.render(), plugin.id);
    }

    private buildContainer(element: UI_Container, pluginId?: string): JSX.Element {
        if (!element) { return null; }

        switch(element.elementType) {
            case UI_ElementType.Layout:
                return <div key={element.id}>{this.buildChildren(element, pluginId)}</div>;
            case UI_ElementType.Row:
                const row = element as UI_Row;
                return <RowComp key={row.id} element={row}>{this.buildChildren(element, pluginId)}</RowComp>;
            case UI_ElementType.Column:
                const column = element as UI_Column;
                return <ColumnComp registry={this.registry} key={column.id} element={column}>{this.buildChildren(element, pluginId)}</ColumnComp>;
            case UI_ElementType.Accordion:
                const accordionTab = element as UI_Accordion;
                return <AccordionTabComp registry={this.registry} key={accordionTab.id} element={accordionTab}>{this.buildChildren(element, pluginId)}</AccordionTabComp>;
            case UI_ElementType.Table:
                const table = element as UI_Table;
                return <TableComp element={table}>{this.buildChildren(element, pluginId)}</TableComp>;
            case UI_ElementType.TableRow:
                const tableRow = element as UI_TableRow;
                return <TableRowComp element={tableRow}>{this.buildChildren(element, pluginId)}</TableRowComp>;
            case UI_ElementType.TableColumn:
                const tableColumn = element as UI_TableColumn;
                return <TableColumnComp element={tableColumn}>{this.buildChildren(element, pluginId)}</TableColumnComp>;
            case UI_ElementType.SvgGroup:
                const group = element as UI_SvgGroup;
                return <SvgGroupComp registry={this.registry} element={group}>{this.buildChildren(element, pluginId)}</SvgGroupComp>
            case UI_ElementType.SvgCanvas:
                return this.buildSvgCanvas(element as UI_SvgCanvas | UI_HtmlCanvas, pluginId);
            case UI_ElementType.Box:
                const box = element as UI_Box;
                return <BoxComp registry={this.registry} element={box}>{this.buildChildren(element, pluginId)}</BoxComp>;
            case UI_ElementType.Dialog:
                const dialog = element as UI_Dialog;
                return <DialogComp registry={this.registry} element={dialog}>{this.buildChildren(element, pluginId)}</DialogComp>;
            case UI_ElementType.SvgForeignObject:
                const foreignObject = element as UI_SvgForeignObject;
                return <ForeignObjectComp registry={this.registry} element={foreignObject}>{this.buildChildren(element, pluginId)}</ForeignObjectComp>;
            case UI_ElementType.GizmoLayer:
                const gizmoLayer = element as UI_GizmoLayer;
                return <GizmoLayerComp registry={this.registry} element={gizmoLayer}>{this.buildChildren(element, pluginId)}</GizmoLayerComp>

        }
    }

    private buildChildren(element: UI_Container, pluginId: string): JSX.Element[] {
        return element.children.map(child => {
            if ((child as UI_Container).children !== undefined) {
                return this.buildContainer(child as UI_Container, pluginId);
            } else {
                return this.buildLeaf(child);
            }
        });
    }

    private buildSvgCanvas(canvas: UI_SvgCanvas | UI_HtmlCanvas, pluginId: string) {
        let toolbar: JSX.Element = null;

        if (canvas._toolbar) {
            toolbar = this.buildToolbar(canvas._toolbar);
        }

        let dropLayer: JSX.Element = null;

        if (canvas._dropLayer) {
            dropLayer = this.buildLeaf(canvas._dropLayer);
        }

        let gizmoLayer: JSX.Element = null;

        if (canvas._gizmoLayer) {
            gizmoLayer = this.buildContainer(canvas._gizmoLayer);
        }
        
        let children: JSX.Element[] = [];
        if (canvas.elementType === UI_ElementType.SvgCanvas) {
            children = this.buildChildren(canvas as UI_SvgCanvas, pluginId);
        }

        return <CanvasComp registry={this.registry} toolbar={toolbar} dropLayer={dropLayer} gizmoLayer={gizmoLayer} element={canvas}>{children}</CanvasComp>;
    }

    private buildToolbar(uiToolbar: UI_Toolbar) {
        const toolsLeft: JSX.Element[] = [];
        const toolsMiddle: JSX.Element[] = [];
        const toolsRight: JSX.Element[] = [];

        uiToolbar.tools.forEach(child => {
            switch(child.placement) {
                case 'left':
                default:
                    toolsLeft.push(this.buildLeaf(child));
                break;
                case 'middle':
                    toolsMiddle.push(this.buildLeaf(child));
                break;
                case 'right':
                    toolsRight.push(this.buildLeaf(child));
                break;
            }
        });

        return <ToolbarComp registry={this.registry} toolsLeft={toolsLeft} toolsMiddle={toolsMiddle} toolsRight={toolsRight} element={uiToolbar}></ToolbarComp>;
    }

    private buildTool(uiTool: UI_Tool) {
        const tooltip = uiTool._tooltip ? this.buildLeaf(uiTool._tooltip) : null;

        return <ToolComp registry={this.registry} key={uiTool.id} tooltip={tooltip} element={uiTool}/>; 
    }

    private buildActionIcon(uiActionIcon: UI_ActionIcon) {
        const tooltip = uiActionIcon._tooltip ? this.buildLeaf(uiActionIcon._tooltip) : null;

        return <ActionIconComp registry={this.registry} key={uiActionIcon.id} tooltip={tooltip} element={uiActionIcon}/>; 
    }

    private buildIcon(uiIcon: UI_Icon) {
        const tooltip = uiIcon._tooltip ? this.buildLeaf(uiIcon._tooltip) : null;

        return <IconComp registry={this.registry} key={uiIcon.id} tooltip={tooltip} element={uiIcon}/>; 
    }

    private buildLeaf(element: UI_Element): JSX.Element {
        switch(element.elementType) {
            case UI_ElementType.Text:
                const text = element as UI_Text;
                return <TextComp registry={this.registry} element={text}/>;
            case UI_ElementType.TextField:
                const textField = element as UI_TextField;
                return <TextFieldComp registry={this.registry} element={textField}/>;
            case UI_ElementType.Button:
                const button = element as UI_Button;
                return <ButtonComp registry={this.registry} element={button}/>;
            case UI_ElementType.Select:
                const select = element as UI_Select;
                return <SelectComp registry={this.registry} element={select}/>;
            case UI_ElementType.FileUpload:
                const fileUpload = element as UI_FileUpload;
                return <FileUploadComp registry={this.registry} element={fileUpload}/>;
            case UI_ElementType.GridSelect:
                const gridSelect = element as UI_GridSelect;
                return <GridSelectComp registry={this.registry} element={gridSelect}/>
            case UI_ElementType.SvgRect:
                const rect = element as UI_SvgRect;
                return <SvgRectComp registry={this.registry} element={rect}/>;
            case UI_ElementType.SvgCircle:
                const circle = element as UI_SvgCircle;
                return <SvgCircleComp registry={this.registry} element={circle}/>;
            case UI_ElementType.SvgLine:
                const line = element as UI_SvgLine;
                return <SvgLineComp registry={this.registry} element={line}/>;
            case UI_ElementType.SvgImage:
                const svgImage = element as UI_SvgImage;
                return <SvgImageComp registry={this.registry} element={svgImage}/>; 
            case UI_ElementType.SvgPath:
                const path = element as UI_SvgPath
                return <SvgPathComp registry={this.registry} element={path}/>;
            case UI_ElementType.SvgPolygon:
                const polygon = element as UI_SvgPolygon;
                return <SvgPolygonComp registry={this.registry} element={polygon}/>; 
            case UI_ElementType.SvgText:
                const svgText = element as UI_SvgText;
                return <SvgTextComp registry={this.registry} element={svgText}/>;
            case UI_ElementType.Toolbar:
                const toolbar = element as UI_Toolbar;
                return this.buildToolbar(toolbar);
            case UI_ElementType.ToolIcon:
                const tool = element as UI_Tool;
                return this.buildTool(tool);
            case UI_ElementType.ActionIcon:
                const actionIcon = element as UI_ActionIcon;
                return this.buildActionIcon(actionIcon);
            case UI_ElementType.IconSeparator:
                const iconSeparator = element as UI_ActionIcon;
                return <IconSeparatorComp registry={this.registry} element={iconSeparator}/>;
            case UI_ElementType.Tooltip:
                const tooltip = element as UI_Tooltip;
                return <TooltipComp registry={this.registry} element={tooltip}/>;
            case UI_ElementType.ListItem:
                const listItem = element as UI_ListItem;
                return <ListItemComp registry={this.registry} element={listItem}/>;
            case UI_ElementType.HtmlCanvas:
                return this.buildSvgCanvas(element as UI_SvgCanvas | UI_HtmlCanvas, element.pluginId);
            case UI_ElementType.Image:
                const image = element as UI_Image;
                return <ImageComp registry={this.registry} element={image}/>;
            case UI_ElementType.Icon:
                const icon = element as UI_Icon;
                return this.buildIcon(icon);
            case UI_ElementType.TableRowGroup:
                const tableRowGroup = element as UI_TableRowGroup;
                return <TableRowGroupComp registry={this.registry} element={tableRowGroup}></TableRowGroupComp>;
            case UI_ElementType.DropLayer:
                const dropLayer = element as UI_DropLayer;
                return <DropLayerComp registry={this.registry} element={dropLayer}></DropLayerComp>;
        }
    }
}   