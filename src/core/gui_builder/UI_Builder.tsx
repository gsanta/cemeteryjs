import { UI_Element } from './elements/UI_Element';
import { RowGui } from './UI_ReactElements';
import * as React from 'react';
import { Registry } from '../Registry';
import { UI_Region, UI_Plugin } from '../UI_Plugin';
import { ButtonComp } from '../gui/inputs/ButtonComp';
import { SelectComp } from '../gui/inputs/SelectComp';
import { TextFieldComp } from '../gui/inputs/TextFieldComp';
import { UI_AccordionTab } from './elements/UI_Accordion';
import { AccordionTabComp } from '../gui/surfaces/AccordionTabComp';
import { UI_FileUpload } from './elements/UI_FileUpload';
import { FileUploadComp } from '../gui/inputs/FileUploadComp';
import { UI_Row } from './elements/UI_Row';
import { UI_Button } from './elements/UI_Button';
import { UI_ElementType } from './elements/UI_ElementType';
import { UI_TextField } from './elements/UI_TextField';
import { UI_Container } from './elements/UI_Container';
import { UI_Select } from './elements/UI_Select';
import { UI_GridSelect } from './elements/UI_GridSelect';
import { GridSelectComp } from '../gui/inputs/GridSelectComp';
import { TableComp } from '../gui/table/TableComp';
import { TextComp } from '../gui/text/TextComp';
import { TableRowComp } from '../gui/table/TableRowComp';
import { TableColumnComp } from '../gui/table/TableColumnComp';
import { UI_Table, UI_TableRow } from './elements/UI_Table';
import { UI_TableColumn } from './elements/UI_TableColumn';
import { UI_Text } from './elements/UI_Text';
import { UI_SvgRect } from './elements/svg/UI_SvgRect';
import { SvgRectComp } from '../gui/svg/SvgRectComp';
import { UI_SvgGroup } from './elements/svg/UI_SvgGroup';
import { SvgGroupComp } from '../gui/svg/SvgGroupComp';
import { SvgCanvasComp } from '../gui/surfaces/SvgCanvasComp';
import { UI_SvgCanvas } from './elements/UI_SvgCanvas';
import { AbstractPlugin } from '../AbstractPlugin';
import { UI_SvgCircle } from './elements/svg/UI_SvgCircle';
import { SvgCircleComp } from '../gui/svg/SvgCircleComp';
import { UI_SvgImage } from './elements/svg/UI_SvgImage';
import { SvgImageComp } from '../gui/svg/SvgImageComp';
import { UI_SvgPath } from './elements/svg/UI_SvgPath';
import { SvgPathComp } from '../gui/svg/SvgPathComp';
import { UI_Toolbar } from './elements/toolbar/UI_Toolbar';
import { UI_Tool } from './elements/toolbar/UI_Tool';
import { ToolbarComp } from '../gui/surfaces/ToolbarComp';

export class UI_Builder {

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    build(plugin: UI_Plugin): JSX.Element {
        return this.buildContainer(plugin.render(), plugin);
    }

    // private buildRecuresively(container: UI_Container): JSX.Element {
    //     switch(container.type) {
    //         case UI_ElementType.Layout:
    //             const children = container.children.map(child => {
    //                 if ((child as UI_Container).children !== undefined) {

    //                 }
    //             }

    //             // return <div>${this.buildRecuresively()}</div>
    //     }

    // }

    private buildContainer(element: UI_Container, plugin: UI_Plugin): JSX.Element {
        const children = element.children.map(child => {
            if ((child as UI_Container).children !== undefined) {
                return this.buildContainer(child as UI_Container, plugin);
            } else {
                return this.buildLeaf(child);
            }
        });

        switch(element.elementType) {
            case UI_ElementType.Layout:
                return <div>{children}</div>;
            case UI_ElementType.Row:
                const row = element as UI_Row;
                return <RowGui element={row}>{children}</RowGui>;
            case UI_ElementType.AccordionTab:
                const accordionTab = element as UI_AccordionTab;
                return <AccordionTabComp element={accordionTab}>{children}</AccordionTabComp>;
            case UI_ElementType.Table:
                const table = element as UI_Table;
                return <TableComp element={table}>{children}</TableComp>;
            case UI_ElementType.TableRow:
                const tableRow = element as UI_TableRow;
                return <TableRowComp element={tableRow}>{children}</TableRowComp>;
            case UI_ElementType.TableColumn:
                const tableColumn = element as UI_TableColumn;
                return <TableColumnComp element={tableColumn}>{children}</TableColumnComp>;
            case UI_ElementType.SvgGroup:
                const group = element as UI_SvgGroup;
                return <SvgGroupComp element={group}>{children}</SvgGroupComp>
            case UI_ElementType.SvgCanvas:
                const svgCanvas = element as UI_SvgCanvas;
                return <SvgCanvasComp plugin={plugin as AbstractPlugin}>{children}</SvgCanvasComp>;
        }
    }

    private buildToolbar(uiToolbar: UI_Toolbar) {
        const toolsLeft: JSX.Element[] = [];
        const toolsMiddle: JSX.Element[] = [];
        const toolsRight: JSX.Element[] = [];

        uiToolbar.children.forEach(child => {
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
    }

    private buildLeaf(element: UI_Element): JSX.Element {
        switch(element.elementType) {
            case UI_ElementType.Text:
                const text = element as UI_Text;
                return <TextComp element={text}/>;
            case UI_ElementType.TextField:
                const textField = element as UI_TextField;
                return <TextFieldComp element={textField}/>;
            case UI_ElementType.Button:
                const button = element as UI_Button;
                return <ButtonComp element={button}/>;
            case UI_ElementType.Select:
                const select = element as UI_Select;
                return <SelectComp element={select}/>;
            case UI_ElementType.FileUpload:
                const fileUpload = element as UI_FileUpload;
                return <FileUploadComp element={fileUpload}/>;
            case UI_ElementType.GridSelect:
                const gridSelect = element as UI_GridSelect;
                return <GridSelectComp element={gridSelect}/>
            case UI_ElementType.SvgRect:
                const rect = element as UI_SvgRect;
                return <SvgRectComp element={rect}/>;
            case UI_ElementType.SvgCircle:
                const circle = element as UI_SvgCircle;
                return <SvgCircleComp element={circle}/>;
            case UI_ElementType.SvgImage:
                const image = element as UI_SvgImage;
                return <SvgImageComp element={image}/>; 
            case UI_ElementType.SvgPath:
                const path = element as UI_SvgPath
                return <SvgPathComp element={path}/>; 
            case UI_ElementType.Toolbar:
                const toolbar = element as UI_Toolbar;
                return <ToolbarComp/>
        }
    }
}   