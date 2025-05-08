/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { css } from "@emotion/css";

export const tooltipBaseStyles = {
  tooltip: {
      color: "#8d91a3",
      backgroundColor: "#fdfdfd",
      border: "1px solid #e6e7ec",
      borderRadius: 6,
      padding: "1rem"
  },
  arrow: {
      color: "#fdfdfd"
  }
};

export const useStyles = () => ({
  element: css({
    backgroundColor: "var(--vscode-input-background)",
    padding: "10px",
    cursor: "pointer",
    transitionDuration: "0.2s",
    userSelect: "none",
    pointerEvents: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
      filter: "brightness(0.95)",
    }
  }),
  lightBulbWrapper: css({
    height: "22px",
    width: "22px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }),
  iconButton: css({
    padding: "10px 14px",
  }),
  menu: css({
    '& .MuiMenuItem-root': {
      fontSize: '11px',
      paddingBottom: "1px",
      paddingTop: "1px"
    }
  }),
  pre: css({
    margin: 0,
    overflowX: "auto",
    whiteSpace: "pre-wrap",
    wordWrap: "break-word",
    backgroundColor: "white"
  })
});
