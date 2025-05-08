/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import { ThemeColors } from "@wso2-enterprise/ui-toolkit";

export const FieldType: React.FC<any> = styled.span`
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
`;

export const FieldName: React.FC<any> = styled.span`
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

export const HeaderName: React.FC<any> = styled.span`
  margin-left: 8px;
  margin-right: 15px;
`;

interface StyleProps {
    isSelected?: boolean;
}

export const NodeContainer: React.FC<any> = styled.div`
  background-color: ${ThemeColors.SURFACE_DIM};
  border: ${(props: StyleProps) => `1px solid ${props.isSelected ? ThemeColors.SECONDARY : ThemeColors.PRIMARY}`};
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  color: ${ThemeColors.ON_SURFACE};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  min-height: 32px;
  min-width: 160px;
`;

export const NodeHeader: React.FC<any> = styled.div`
  align-items: center;
  border-bottom: ${(props: StyleProps) =>
          `1px solid ${props.isSelected ? ThemeColors.SECONDARY : ThemeColors.PRIMARY}`};
  display: flex;
  font-family: GilmerRegular;
  font-size: 13px;
  height: 32px;
  justify-content: center;
  line-height: 24px;
  padding-inline: 8px;
  min-width: calc(100% - 16px);
  text-align: center;
  white-space: nowrap;
`;

export const InterfaceSubHeader: React.FC<any> = styled.div`
  align-items: center;
  display: flex;
  font-family: GilmerRegular;
  font-size: 13px;
  justify-content: center;
  line-height: 24px;
  min-width: 160px;
  text-align: center;
  white-space: nowrap;
`;

export const NodeFieldContainer: React.FC<any> = styled.div`
   align-items: center;
  background-color: ${(props: StyleProps) => props.isSelected ? ThemeColors.ON_SECONDARY : ThemeColors.SURFACE_DIM};
  border-bottom: 0.5px solid ${ThemeColors.OUTLINE_VARIANT};
  color:${ThemeColors.ON_SURFACE};
  display: flex;
  flex-direction: row;
  font-family: GilmerRegular;
  font-size: 12px;
  height: 30px;
  justify-content: center;
  line-height: 16px;
  min-width: calc(100% - 16px);
  padding: 8px 0px 8px 8px;
  text-align: center;
`;
