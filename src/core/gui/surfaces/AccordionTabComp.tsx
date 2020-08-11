import * as React from 'react';
import { UI_ComponentProps } from '../UI_ComponentProps';
import { UI_Accordion } from '../../ui_regions/elements/surfaces/UI_Accordion';
import { Accordion, Card, Button } from 'react-bootstrap';
import { ArrowDownIconComponent } from '../icons/ArrowDownIconComponent';
import { colors } from '../styles';
import styled from 'styled-components';

const CardBodyStyled = styled(Card.Body)`
    background: ${colors.panelBackground};
    color: ${colors.textColor};
    display: flex;
    flex-direction: column;

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

export class AccordionTabComp extends React.Component<UI_ComponentProps<UI_Accordion>> {
    render() {
        const level: 'primary' = 'primary';

        return (
            <Accordion defaultActiveKey={this.props.element.title}>
                <CardStyled>
                    <CardHeaderStyled level={level}>
                        <Accordion.Toggle as={Button} variant="link" eventKey={this.props.element.title} style={{ width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                            <div>{this.props.element.title}</div>
                            <ArrowDownIconComponent color={level === 'primary' ? colors.textColor : colors.textColorDark}/>
                        </Accordion.Toggle>
                    </CardHeaderStyled>
                    <Accordion.Collapse eventKey={this.props.element.title}>
                        <CardBodyStyled>
                            {this.props.children}
                        </CardBodyStyled>
                    </Accordion.Collapse>
                </CardStyled>
            </Accordion>
        )
    }
}