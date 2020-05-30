import * as React from 'react';
import { sort } from '../../../core/geometry/utils/Functions';
import { toDegree } from '../../../core/geometry/utils/Measurements';
import { colors } from '../../../core/gui/styles';
import { MeshView } from '../../../core/models/views/MeshView';
import { ConceptType } from '../../../core/models/views/View';
import { Registry } from '../../../core/Registry';
import { ViewComponent } from '../../common/ViewComponent';
import { GroupProps } from '../../InstanceProps';

export class MeshViewComponent extends ViewComponent<MeshView> {
    
    render() {
        const item = this.props.item;

        return (
            <g
                key={`${item.id}-group`}
                transform={`translate(${item.dimensions.topLeft.x} ${item.dimensions.topLeft.y}) rotate(${toDegree(item.rotation)} ${item.dimensions.getWidth() / 2} ${item.dimensions.getHeight() / 2})`}
                onMouseOver={() => this.props.hover ? this.props.hover(item) : () => undefined}
                onMouseOut={() => this.props.unhover ? this.props.unhover(item) : () => undefined}
                data-wg-x={item.dimensions.topLeft.x}
                data-wg-y={item.dimensions.topLeft.y}
                data-wg-width={item.dimensions.getWidth()}
                data-wg-height={item.dimensions.getHeight()}
                data-wg-type={item.type}
                data-wg-color={item.color}
                data-wg-layer={item.layer}
                data-rotation={item.rotation}
                data-wg-scale={item.scale}
                data-y-pos={item.yPos}
                data-wg-name={item.id}
                data-model-id={item.modelId}
                data-thumbnail={item.thumbnailPath}
                data-path={item.path}
                data-is-manual-control={item.isManualControl ? 'true' : 'false'}
            >
                {this.renderRect(item)}
                {this.renderThumbnail(item)}
            </g>
        )
    }

    private renderRect(item: MeshView) {
        const stroke = this.context.registry.stores.selectionStore.contains(item) || this.context.registry.services.pointer.hoveredItem === item ? colors.views.highlight : 'black';

        return (
            <rect
                key={`${item.id}-rect`}
                x={`0`}
                y={`0`}
                width={`${item.dimensions.getWidth()}px`}
                height={`${item.dimensions.getHeight()}px`}
                fill={item.color}
                stroke={stroke}
            />
        );
    }

    private renderThumbnail(item: MeshView) {
        let thumbnail: JSX.Element = null;

        if (item.thumbnailPath) {
            thumbnail = (
                <image xlinkHref={`assets/models/${this.getFolderNameFromFileName(item.thumbnailPath)}/${item.thumbnailPath}`} x="0" y="0" height={`${item.dimensions.getHeight()}px`} width={`${item.dimensions.getWidth()}px`} />
            )
        }

        return thumbnail;
    }

    private getFolderNameFromFileName(fileName: string) {
        return fileName.split('.')[0];
    }
}

export function MeshViewContainerComponent(props: GroupProps) {
    const views = getSortedMeshViews(props.registry).map(item => (
        <MeshViewComponent  
            item={item}
            renderWithSettings={props.renderWithSettings}
            registry={props.registry}
            hover={props.hover}
            unhover={props.unhover}
        />
    ));

    return views.length > 0 ? <g data-concept-type={ConceptType.MeshConcept} key={ConceptType.MeshConcept}>{views}</g> : null;
}

function getSortedMeshViews(registry: Registry) {
    let items = [...registry.stores.canvasStore.getMeshConcepts()];
    return sort(items, (a, b) => a.layer - b.layer);
}

