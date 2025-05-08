/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from '@emotion/styled';
import { ThemeColors } from '@wso2-enterprise/ui-toolkit';

interface StyleProps {
    isAnonymous: boolean;
    isEditMode?: boolean;
    isSelected?: boolean;
    isClickable?: boolean;
    shouldShade?: boolean;
    isFocused?: boolean;
}

export const EntityNode: React.FC<any> = styled.div`
    background-color: ${(props: StyleProps) => props.isSelected ? ThemeColors.SURFACE_DIM_2 :
        props.isAnonymous ? ThemeColors.SURFACE_BRIGHT : ThemeColors.SURFACE_BRIGHT};
    border: ${(props: StyleProps) => `1.8px solid ${props.isSelected ? ThemeColors.HIGHLIGHT :
        props.isAnonymous ? ThemeColors.PRIMARY : props.isFocused ? ThemeColors.HIGHLIGHT : ThemeColors.OUTLINE_VARIANT}`};
    border-radius: 6px !important;
    color: ${(props: StyleProps) => props.isAnonymous ? ThemeColors.PRIMARY : ThemeColors.ON_SURFACE};
    cursor: ${(props: StyleProps) => props.isEditMode ? `pointer` : `auto`};
    display: flex;
    flex-direction: column;
    min-height: 40px;
    opacity: ${(props: StyleProps) => props.shouldShade ? 0.85 : 1};
    overflow: hidden;
`;

export const EntityHead: React.FC<any> = styled.div`
    align-items: center;
     border-bottom: ${(props: StyleProps) =>
        `1px solid ${props.isSelected ? ThemeColors.HIGHLIGHT : ThemeColors.OUTLINE_VARIANT}`};
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 40px;
    justify-content: center;
    line-height: 20px;
    min-width: calc(100% - 32px);
    padding: 0 8px;
    text-align: center;
`;

export const EntityName: React.FC<any> = styled.span`
    font-family: "GilmerMedium";
    font-size: 14px;
    &:hover {
        color: ${(props: StyleProps) => props.isClickable ? ThemeColors.HIGHLIGHT : ``};
        cursor: ${(props: StyleProps) => props.isClickable ? `pointer` : ``};
    }
`;

export const AttributeContainer: React.FC<any> = styled.div`
    align-items: center;
    background-color: ${(props: { isSelected: boolean }) => props.isSelected ? ThemeColors.SURFACE_DIM_2 : ThemeColors.SURFACE_BRIGHT};
    border-top: 0.5px solid ${ThemeColors.OUTLINE_VARIANT};
    display: flex;
    flex-direction: row;
    font-size: 12px;
    height: 30px;
    justify-content: space-between;
    min-width: calc(100% - 20px);
    padding: 8px 8px 8px 12px;

    &:last-of-type {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
    }
`;

export const OperationSection: React.FC<any> = styled.div`
    border-bottom: 0.5px solid ${ThemeColors.OUTLINE_VARIANT};

    &:last-child {
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        overflow: hidden;
    }
`;

export const AttributeName: React.FC<any> = styled.span`
    align-items: center;
    color: ${ThemeColors.ON_SURFACE};
    display: flex;
    flex: 1;
    font-family: GilmerRegular;
    font-size: 12px;
    line-height: 30px;
    padding-right: 8px;
    text-align: left;
`;

export const AttributeType: React.FC<any> = styled.span`
    background-color: ${ThemeColors.SURFACE_CONTAINER};
    border-radius: 3px;
    color: ${ThemeColors.ON_SURFACE};
    font-family: GilmerRegular;
    font-size: 12px;
    height: 24px;
    line-height: 24px;
    min-width: 60px;
    padding-inline: 6px;
    text-align: center;
    cursor: pointer;
    white-space: nowrap;
`;

export const InclusionPortsContainer: React.FC<any> = styled.div`
    display: flex;
    justify-content: center;
`;
