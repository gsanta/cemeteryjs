import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../styles';
import { CloseIconComponent } from '../../../plugins/common/toolbar/icons/CloseIconComponent';

export interface DialogProps {
    title: string;
    children: JSX.Element | JSX.Element[];
    footer?: JSX.Element | JSX.Element[] | string;
    closeDialog(): void;
    className?: string;
}

const DialogOverlayStyled = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    z-index: 1000;
    top: 0;
    left: 0;
    background-color: #435056;
    opacity: 0.5;
`;

const DialogStyled = styled.div`
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    background-color: ${colors.panelBackground};
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.14);
    padding: 15px;
    font-size: 16px;
    z-index: 1001;
    top: 40px;
    left: 50%;
    transform: translate(-50%, 0);
    position: absolute;
`;

const DialogTitleStyled = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    color: ${colors.textColor};
    font-size: 16px;
`;

const DialogBodyStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;

const DialogFooterStyled = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 15px;

    > button {
        margin-right: 10px;
    }
`;

export function DialogComponent(props: DialogProps) {
    const dialogClassName = `dialog ${props.className ? props.className : ''}`.trim();

    const footer = props.footer ? <DialogFooterStyled>{props.footer}</DialogFooterStyled> : null;

    return (
        <div onClick={e => e.stopPropagation()}>
            <DialogOverlayStyled onClick={props.closeDialog}></DialogOverlayStyled>
            <DialogStyled className={dialogClassName}>
                <DialogTitleStyled>
                    <div>{props.title}</div>
                    <div><CloseIconComponent onClick={props.closeDialog} /></div>
                </DialogTitleStyled>
                <DialogBodyStyled>{props.children}</DialogBodyStyled>
                {footer}
            </DialogStyled>
        </div>
    );
}
