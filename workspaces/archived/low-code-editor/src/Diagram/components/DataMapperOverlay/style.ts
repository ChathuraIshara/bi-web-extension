/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const dataMapperStyles = makeStyles((theme: Theme) =>
    createStyles({
        dataMapperContainer: {
            height: "100%",
            width: "100%",
            position: "absolute"
        },
        overlay: {
            height: "100%",
            width: "100%"
        }
    }),
);
