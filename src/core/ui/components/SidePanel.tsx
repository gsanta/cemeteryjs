import React, { useEffect, useState } from 'react';
import { Point } from '../../../utils/geometry/shapes/Point';

interface SideBarProps {

}

const SidePanelHeader = (props: SideBarProps): JSX.Element => {
    const [isMouseDown, setMouseDown] = useState(false);
    const [cursorPos, setCursorPos] = useState<Point>(null);
    const [elementPos, setElementPos] = useState<Point>(null);

    function handleMouseMove(e: MouseEvent) {
        e.preventDefault();

        if (!cursorPos) {
            return;
        }

        setCursorPos(new Point(e.clientX, e.clientY));

        const deltaPos = new Point(cursorPos.x - e.clientX, cursorPos.y - e.clientY);
        setElementPos(new Point(elementPos.x - deltaPos.x, elementPos.y - deltaPos.y));
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return () => window.removeEventListener('mousemove', handleMouseMove);

    }, [isMouseDown]);

    return (
        <div
            className="side-panel__header"
            onMouseDown={() => setMouseDown(true)}
        >
            Sidepanel
        </div>
    );
};

const SidePanel = () => (
    <div className="side-panel">
        <SidePanelHeader />
    </div>
);

export default SidePanel;
