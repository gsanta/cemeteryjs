import * as React from 'react';
import styled from 'styled-components';
import { AppContext, AppContextType } from '../../../core/gui/Context';
import { colors } from '../../../core/gui/styles';
import { DialogComponent } from './DialogComponent';
import { ListActionsSettings } from '../../views/canvas/settings/ListActionsSettings';

const ListActionsDialogStyled = styled(DialogComponent)`
    width: 500px;
    color: ${colors.textColor};
`;

export class ListActionsDialogComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    componentDidMount() {
        this.context.registry.services.update.addSettingsRepainter(() => this.forceUpdate());
    }

    render(): JSX.Element {
        return this.context.registry.services.dialog.isActiveDialog(ListActionsSettings.name) ?
        (
            <ListActionsDialogStyled title="Add action" closeDialog={() => this.close()}>
                <div>

                </div>
            </ListActionsDialogStyled>
        )
        : null;
    }

    private close() {
        this.context.registry.services.dialog.close();
    }
}