import * as React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { colors } from '../styles';
import { CanvasToolsProps } from '../canvases/canvasFactory';
import { ArrowDownIconComponent } from '../icons/ArrowDownIconComponent';

export interface AccordionProps {
    elements: CanvasToolsProps[];
    expanded?: boolean;
    level?: 'primary' | 'secondary';
    onClick?: () => void;
}

const CardBodyStyled = styled(Card.Body)`
    background: ${colors.panelBackground};
    color: ${colors.textColor};

    padding: 5px 5px;

    table {
        color: ${colors.textColor};
    }
`;

const CardHeaderStyled = styled(Card.Header)`
    background: ${(props: {level: 'primary' | 'secondary'}) => props.level === 'primary' ? colors.panelBackgroundLight : colors.grey4};
    padding: 0;

    button, button:active, button:hover {
        color: ${(props: {level: 'primary' | 'secondary'}) => props.level === 'primary' ? colors.textColor : colors.textColorDark};
    }

    .btn {
        padding: 0 5px;
    }
`;

const CardStyled = styled(Card)`
    border-radius: 0px;
    border: none;
    border-bottom: 1px solid ${colors.panelBackgroundLight};
`;

export class AccordionComponent extends React.Component<AccordionProps> {

    static defaultProps: Partial<AccordionProps> = {
        expanded: true,
        level: 'primary',
        onClick: () => null
    }

    render() {
        const accordions = this.props.elements.map((element, index) => (
            <Accordion defaultActiveKey={this.props.expanded ? index + '' : undefined} onClick={this.props.onClick}>
                <CardStyled>
                    <CardHeaderStyled level={this.props.level}>
                        <Accordion.Toggle as={Button} variant="link" eventKey={index + ''} style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <div>{element.title}</div>
                            <ArrowDownIconComponent color={this.props.level === 'primary' ? colors.textColor : colors.textColorDark}/>
                        </Accordion.Toggle>
                    </CardHeaderStyled>
                    <Accordion.Collapse eventKey={index + ''}>
                        <CardBodyStyled>
                            {element.body}
                        </CardBodyStyled>
                    </Accordion.Collapse>
                </CardStyled>
            </Accordion>
        ));
        return <div>{accordions}</div>
    }
}