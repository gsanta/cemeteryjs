import * as React from 'react';
import styled from 'styled-components';
import { colors } from '../styles';
import { UI_ContainerProps } from '../UI_ComponentProps';
import { UI_Dialog } from '../../elements/surfaces/UI_Dialog';

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
    color: ${colors.textColor};
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

export function DialogComp(props: UI_ContainerProps<UI_Dialog> ) {
    return (
        <div onClick={e => e.stopPropagation()}>
            <DialogOverlayStyled onClick={() => props.element.close()}></DialogOverlayStyled>
            <DialogStyled 
                className='dialog'
                style={{
                    width: props.element.width ? props.element.width : '500px',
                    height: props.element.height ? props.element.height : 'auto',
                }}
            >
                <DialogTitleStyled>
                    <div>{props.element.title}</div>
                    {/* <div><CloseIconComponent onClick={() => props.element.close()} /></div> */}
                </DialogTitleStyled>
                <DialogBodyStyled>{props.children}</DialogBodyStyled>
            </DialogStyled>
        </div>
    );
}
