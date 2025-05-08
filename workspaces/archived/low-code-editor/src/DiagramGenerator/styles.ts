/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: ordered-imports
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useGeneratorStyles = makeStyles((theme: Theme) =>
    createStyles({
        loader: {
            border: "16px solid #f3f3f3",
            borderTop: "16px solid #dadada",
            borderRadius: "50%",
            width: "150px",
            height: "150px",
            animation: "spin 2s linear infinite",
            margin: "auto",
        },
        lowCodeContainer: {
            backgroundColor: "transparent",
            height: "100%",
        },
        loaderContainer: {
            marginRight: theme.spacing(1),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            height: "100vh",
        },
        errorMessageDialog: {
            paddingLeft: "30px",
        }
    })
);
