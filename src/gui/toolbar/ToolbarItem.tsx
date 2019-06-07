import * as React from 'react';

export const ToolbarItem = (props: ToolbarItemProps) =>  {
    return (
        <div>{props.children}</div>
    );
}

export interface ToolbarItemProps {
    children: JSX.Element | JSX.Element[];
}
