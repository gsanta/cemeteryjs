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

export class UI_Builder {

    private registry: Registry;

    constructor(registry: Registry) {
        this.registry = registry;
    }

    build(plugin: UI_Plugin): JSX.Element {
        return this.buildContainer(plugin.render());
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

    private buildContainer(element: UI_Container): JSX.Element {
        const children = element.children.map(child => {
            if ((child as UI_Container).children !== undefined) {
                return this.buildContainer(child as UI_Container);
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
        }
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
        }
    }
}   