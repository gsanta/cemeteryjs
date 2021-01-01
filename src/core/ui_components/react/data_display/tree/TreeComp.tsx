import * as React from 'react';
import { UI_ComponentProps } from '../../../../ui_components/react/UI_ComponentProps';
import { UI_Tree } from '../../../elements/complex/tree/UI_Tree';
// const CheckboxTree = require('react-checkbox-tree');
import {Treebeard} from 'react-treebeard';
import { TreeData } from '../../../elements/complex/tree/TreeController';
const reactTreeBeard = require('react-treebeard');

const data = {
    name: 'root',
    toggled: true,
    checked: false,
    children: [
        {
            name: 'parent',
            children: [
                { name: 'child1', checked: false },
                { name: 'child2', checked: false }
            ],
            checked: false
        },
        {
            name: 'loading parent',
            loading: true,
            children: [],
            checked: false
        },
        {
            name: 'parent',
            checked: false,
            children: [
                {
                    name: 'nested parent',
                    checked: false,
                    children: [
                        { name: 'nested child 1', checked: false },
                        { name: 'nested child 2', checked: false }
                    ]
                }
            ]
        }
    ]
};

const linkStyle = {
    cursor: 'pointer',
    position: 'relative',
    padding: '0px 5px',
    display: 'flex'
}

export class TreeComp extends React.Component<UI_ComponentProps<UI_Tree>, {cursor: TreeData, active: boolean, style: any}> {

    constructor(props: UI_ComponentProps<UI_Tree>) {
        super(props);

        const style = reactTreeBeard.theme;
        style.tree.node.link = linkStyle;
        style.tree.base.width = '100%';
        delete style.tree.base.backgroundColor;
        delete style.tree.node.activeLink.background;

        this.state = {
            cursor: undefined,
            active: false,
            style: style
        }

        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled) {
        const {cursor} = this.state;
        if (cursor) {
            this.setState(() => ({cursor, active: false}));
        }
        node.active = true;
        if (node.children) { 
            node.toggled = toggled; 
        }
        this.setState(() => ({cursor: node}));
    }
    
    render(){
        const {style} = this.state;
        const data = this.props.element.paramController.getData();
        if (!data) { return null; }
        return (
            <Treebeard
                data={this.props.element.paramController.getData()}
                onToggle={this.onToggle}
                decorators={{...reactTreeBeard.decorators, ...this.getDecorators()}}
                style={style}
            />
        );
    }

    private getDecorators() {
        return {
            Header: (props) => {
                return (
                    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                        <div>{props.node.name}</div>
                        <input type="checkbox" checked={props.node.checked} onClick={(e) => this.onCheck(e, props.node)}/>
                    </div>
                );
            }
        }
    }

    onCheck(e: React.SyntheticEvent, node: any) {
        e.stopPropagation();
        node.checked = !node.checked;

        this.props.element.paramController.check(node);

        this.forceUpdate();
    }
}