import { ExportFileIconComponent } from "../../../plugins/common/toolbar/icons/ExportFileIconComponent";
import * as React from 'react';

export function iconFactory(iconName: string): JSX.Element {

    switch(iconName) {
        case 'export-icon':
            return <ExportFileIconComponent format="long" onClick={() => this.exportFile()} isActive={false}/>;
    }
}