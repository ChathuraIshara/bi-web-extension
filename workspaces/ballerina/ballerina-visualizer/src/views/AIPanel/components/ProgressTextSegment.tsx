/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 *
 * THIS FILE INCLUDES AUTO GENERATED CODE
 */

import { keyframes } from "@emotion/css";
import styled from "@emotion/styled";

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

export const Spinner = styled.span`
    display: inline-block;
    margin-right: 8px;
    font-size: 14px;
    animation: ${spin} 1s linear infinite;
`;

const CheckIcon = styled.span`
    display: inline-block;
    margin-right: 8px;
    font-size: 14px;
`;

const ProgressContainer = styled.div`
    display: flex;
    align-items: center;
    padding-left: 16px;
    padding-top: 2px;
    padding-bottom: 2px;
`;

interface ProgressTextSegmentProps {
    text: string;
    loading: boolean;
    failed?: boolean;
}

const ProgressTextSegment: React.FC<ProgressTextSegmentProps> = ({ text, loading, failed }) => {
    return (
        <ProgressContainer>
            {loading ? (
                <Spinner
                    className="codicon codicon-loading spin"
                    role="img"
                ></Spinner>
            ) : (
                <CheckIcon
                    className={`codicon ${failed ? 'codicon-chrome-close' : 'codicon-check'}`}
                    role="img"
                ></CheckIcon>
            )}
            <span>{text}</span>
        </ProgressContainer>
    );
};

export default ProgressTextSegment;
