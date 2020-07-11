import { ExportFileIconComponent } from "../../../plugins/common/toolbar/icons/ExportFileIconComponent";
import * as React from 'react';
import { ImportFileIconComponent } from "../../../plugins/common/toolbar/icons/ImportFileIconComponent";
import { BlankIconComponent } from "../../../plugins/common/toolbar/icons/BlankIconComponent";

export function iconFactory(iconName: string): JSX.Element {

    switch(iconName) {
        case 'export-icon':
            return <ExportFileIconComponent format="long" onClick={() => this.exportFile()} isActive={false}/>;
        case 'import-icon':
            return <ImportFileIconComponent format="long" onClick={() => this.exportFile()} isActive={false}/>;
        case 'blank-icon':
            return <BlankIconComponent format="long" onClick={() => this.exportFile()} isActive={false}/>;
    }
}