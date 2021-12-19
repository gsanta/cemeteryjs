import React from 'react';

interface SideBarProps {

}

const SideBar = (props: SideBarProps): JSX.Element => (
    <div
        className="side-panel__header"
    >
        Sidepanel
    </div>
);

const SidePanel = () => (
    <div className="side-panel">
        <SideBar />
    </div>
);

export default SidePanel;
