/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { css } from "@emotion/css";

export const useStyles = () => ({
    textVerticalPreloaderWrapperRelative: css({
        position: "relative",
        height: "50px",
        width: "55px",
        margin: "50% auto",
    }),
    textVerticalPreloaderWrapperAbsolute: css({
        position: "absolute",
        height: "110px",
        width: "110px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    }),
});

