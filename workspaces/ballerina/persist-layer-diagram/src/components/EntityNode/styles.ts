/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    isSelected?: boolean;
    isClickable?: boolean;
    isCollapsed?: boolean;
    isFocused?: boolean;
}

export const EntityNode: React.FC<any> = styled.div`
    background-color: ${(props: StyleProps) => props.isSelected ? ThemeColors.SURFACE_DIM_2 :
        props.isAnonymous ? ThemeColors.SURFACE_BRIGHT : ThemeColors.SURFACE_DIM};
    border: ${(props: StyleProps) => `1px solid ${props.isSelected ? ThemeColors.SECONDARY :
        props.isAnonymous ? ThemeColors.PRIMARY : props.isFocused ? ThemeColors.ON_PRIMARY : ThemeColors.PRIMARY}`};
    border-radius: 6px !important;
    color: ${(props: StyleProps) => props.isAnonymous ? ThemeColors.PRIMARY : ThemeColors.ON_SURFACE};
    display: flex;
    flex-direction: column;
    padding: 10px;
`;

export const EntityHead: React.FC<any> = styled.div`
    align-items: center;
    display: flex;
    font-family: GilmerMedium;
    font-size: 13px;
    height: 30px;
    justify-content: center;
    line-height: 20px;
    min-width:  ${(props: StyleProps) => props.isCollapsed ? `calc(100% - 40px)` : `calc(100% - 100px)`};
    padding: ${(props: StyleProps) => props.isCollapsed ? `0px 20px` : `0px 50px`};
    text-align: center;
`;

export const EntityName: React.FC<any> = styled.span`
    cursor: pointer;
    &:hover {
        color: ${(props: StyleProps) => props.isClickable ? ThemeColors.ON_SURFACE : ``};
        cursor: ${(props: StyleProps) => props.isClickable ? `grabbing` : ``};
        text-decoration: ${(props: StyleProps) => props.isClickable ? `underline` : ``};
    }
`;

export const AttributeContainer: React.FC<any> = styled.div`
    align-items: center;
    background-color: ${(props: { isSelected: boolean }) => props.isSelected ? ThemeColors.SURFACE_DIM_2 : ThemeColors.SURFACE_DIM};
    border: 0.5px solid ${ThemeColors.OUTLINE_VARIANT};
    display: flex;
    flex-direction: row;
    font-size: 12px;
    gap: 15px;
    height: 35px;
    justify-content: space-between;
    min-width: calc(100% - 40px);
    padding: 8px 8px 8px 32px;
`;

export const AttributeName = styled.span`
    align-items: center;
    color: ${ThemeColors.ON_SURFACE};
    display: flex;
    flex: 1;
    font-family: GilmerRegular;
    font-size: 12px;
    line-height: 16px;
    text-align: left;
`;

export const AttributeType: React.FC<any> = styled.span`
    background-color: ${ThemeColors.SURFACE_CONTAINER};
    border-radius: 3px;
    color: ${ThemeColors.ON_SURFACE};
    font-family: GilmerRegular;
    font-size: 12px;
    height: 20px;
    gap: 10px;
    line-height: 20px;
    min-width: 50px;
    padding-inline: 8px;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
`;

export const InclusionPortsContainer = styled.div`
    display: flex;
    justify-content: center;
`;
