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

interface StyleProps {
    isSelected?: boolean;
}

export const RecordFieldContainer: React.FC<any> = styled.div`
  align-items: center;
  background-color: ${(props: StyleProps) => props.isSelected ? ThemeColors.ON_SECONDARY : ThemeColors.SURFACE_DIM};
  border-bottom: 0.5px solid ${ThemeColors.OUTLINE_VARIANT};
  color:${ThemeColors.ON_SURFACE};
  display: flex;
  flex-direction: row;
  font-family: GilmerRegular;
  font-size: 12px;
  height: 30px;
  justify-content: flex-start;
  line-height: 16px;
  min-width: calc(100% - 16px);
  padding: 8px 8px 8px 8px;
  text-align: center;
`;
