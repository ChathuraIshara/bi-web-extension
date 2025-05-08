/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useEffect } from "react";
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-sql';

import styled from "@emotion/styled";
import { StyledCode, StyledPre } from "./Styles";

interface ContainerProps {
    sx?: any;
}

const Container = styled.div<ContainerProps>`
    ${(props: ContainerProps) => props.sx};
`;

export interface SyntaxHighlighterProps {
    id?: string;
    code: string;
    language?: string;
    className?: string;
    sx?: any;
}

export const SyntaxHighlighter: React.FC<SyntaxHighlighterProps> = (props: SyntaxHighlighterProps) => {
    const { id, className, sx, code, language } = props;

    useEffect(() => {
        Prism.highlightAll();
    }, [code]);
    
    return (
        <Container id={id} className={className} sx={sx}>
            <StyledPre>
                <StyledCode className={`language-${language}`}>
                    {code}
                </StyledCode>
            </StyledPre>
        </Container>
    );
};
