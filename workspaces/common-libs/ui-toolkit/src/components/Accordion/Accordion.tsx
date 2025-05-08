/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Button } from '../Button/Button';
import { Codicon } from '../Codicon/Codicon';
import { Typography } from '../Typography/Typography';

type ContainerProps = {
    borderColor?: string;
};

type ButtonSectionProps = {
    isExpanded?: boolean;
};

type HeaderProps = {
    expandable?: boolean;
}

const AccordionContainer = styled.div<ContainerProps>`
    margin-top: 10px;
    background-color: var(--vscode-editorHoverWidget-background);
    &:hover {
        background-color: var(--vscode-list-hoverBackground);
        cursor: pointer;
    }
`;

const AccordionHeader = styled.div<HeaderProps>`
    padding: 10px;
    cursor: pointer;
    display: grid;
    grid-template-columns: 3fr 1fr;
`;

const ButtonSection = styled.div<ButtonSectionProps>`
    display: flex;
    align-items: center;
    margin-left: auto;
    gap: ${(p: ButtonSectionProps) => p.isExpanded ? "8px" : "6px"};
`;

const AccordionContent = styled.div`
    padding: 10px;
`;

export interface AccordionProps {
    children?: React.ReactNode;
    header: string;
    isExpanded?: boolean;
}

export const Accordion = (params: AccordionProps) => {
    const expandable = true;
    const [isOpen, setIsOpen] = useState(params.isExpanded || false);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    const handleHeaderClick = (e: React.SyntheticEvent) => {
        e.stopPropagation();
        toggleAccordion();
    }

    return (
        <AccordionContainer>
            <AccordionHeader onClick={handleHeaderClick}>
                <Typography variant="h4">{params.header}</Typography>
                <ButtonSection isExpanded={expandable && isOpen}>
                    {expandable ?
                        isOpen ? (
                            <Button appearance='icon' onClick={toggleAccordion}>
                                <Codicon iconSx={{ marginTop: -3 }} name="chevron-up" />
                            </Button>
                        ) : (
                            <Button appearance='icon' onClick={toggleAccordion}>
                                <Codicon iconSx={{ marginTop: -3 }} name="chevron-down" />
                            </Button>
                        )
                        : undefined
                    }
                </ButtonSection>
            </AccordionHeader>
            {expandable && isOpen && (
                <AccordionContent>
                    {params.children}
                </AccordionContent>
            )}
        </AccordionContainer>
    );
};

