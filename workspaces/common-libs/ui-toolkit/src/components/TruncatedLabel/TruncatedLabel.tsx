/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from '@emotion/styled';
import React, { CSSProperties, PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';

export interface TruncatedLabelProps {
    style?: CSSProperties;
    className?: string;
}

const TruncatedLabelContainer = styled.span`
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const TruncatedLabel: React.FC<PropsWithChildren<TruncatedLabelProps>> = ({ children, ...props }) => {

    const containerRef = useRef(null);
    const [isTruncated, setIsTruncated] = useState(false);

    const title = useMemo(() => {
        const getTextContent = (children: React.ReactNode): string => {
            if (typeof children === 'string') return children;
            if (typeof children === 'number') return children.toString();
            if (!children) return '';

            if (Array.isArray(children)) {
                return children.map(child => getTextContent(child)).join(' ');
            }

            if (React.isValidElement(children)) {
                return getTextContent(children.props.children);
            }

            return '';
        };

        return getTextContent(children);
    }, [children]);

    useEffect(() => {
        if (containerRef.current) {
            setIsTruncated(containerRef.current.scrollWidth > containerRef.current.clientWidth);
        }
    }, [children]);

    return (
        <TruncatedLabelContainer {...props} title={isTruncated ? title : ''} ref={containerRef}>
            {children}
        </TruncatedLabelContainer>
    );
}
