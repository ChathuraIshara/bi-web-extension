/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";

export interface FormContainerProps {
    sx?: any;
    width?: number;
}

export const FormContainer = styled.div<FormContainerProps>`
    display: flex;
    flex-direction: column;
    margin: auto; /* Center vertically and horizontally */
    min-width: 600px;
    ${(props: FormContainerProps) => props.sx};
`;
