import * as React from 'react';
import styled from 'styled-components';
import { DialogComponent } from './DialogComponent';
import { AppContext, AppContextType } from '../Context';

const AnimationDialogStyled = styled(DialogComponent)`
    width: 400px;
`;

const AnimationDialogFooterStyled = styled.div`
    display: flex;
    justify-content: space-between;

    a {
        text-decoration: none;
        color: inherit;
    }
`;

export class AnimationDialogComponent extends React.Component {
    static contextType = AppContext;
    context: AppContextType;

    render(): JSX.Element {
        return this.context.getServices().dialogService().isActiveDialog('animation-dialog') ?
            (
                <AnimationDialogStyled
                    className="about-dialog"
                    title="About"
                    footer={
                        <AnimationDialogFooterStyled>

                        </AnimationDialogFooterStyled>
                    }
                    closeDialog={() => this.context.getServices().dialogService().close()}
                >
                    <div>
                    </div>
                </AnimationDialogStyled>
            )
            : null;
    }
}