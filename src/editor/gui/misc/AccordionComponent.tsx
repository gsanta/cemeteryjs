import * as React from 'react';
import { Accordion, Card, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { colors } from '../styles';

export interface AccordionProps {
    elements: {
        title: string;
        body: JSX.Element | JSX.Element[];
    }[]
}

const CardBodyStyled = styled(Card.Body)`
    background: ${colors.panelBackground};
    color: ${colors.textColor};

    padding: 15px 5px;

    table {
        color: ${colors.textColor};
    }
`;

const CardHeaderStyled = styled(Card.Header)`
    background: ${colors.panelBackgroundLight};
    padding: 0;

    button, button:active, button:hover {
        color: ${colors.textColor};
    }

    .btn {
        padding: 0 5px;
    }
`;

const CardStyled = styled(Card)`
    border-radius: 0px;
`;

export class AccordionComponent extends React.Component<AccordionProps> {

    render() {
        const accordions = this.props.elements.map((element, index) => (
            <Accordion defaultActiveKey="0">
                <CardStyled>
                    <CardHeaderStyled>
                        <Accordion.Toggle as={Button} variant="link" eventKey={index + ''}>
                            {element.title}
                        </Accordion.Toggle>
                    </CardHeaderStyled>
                    <Accordion.Collapse eventKey="0">
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