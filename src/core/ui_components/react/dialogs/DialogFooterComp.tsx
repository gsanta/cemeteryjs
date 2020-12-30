import * as React from 'react';
import { UI_DialogFooter } from '../../elements/surfaces/dialog/UI_DialogFooter';
import { UI_ContainerProps } from '../UI_ComponentProps';

export function DialogFooterComp(props: UI_ContainerProps<UI_DialogFooter> ) {
    return <div className="ce-dialog-footer">{props.children}</div>
}
