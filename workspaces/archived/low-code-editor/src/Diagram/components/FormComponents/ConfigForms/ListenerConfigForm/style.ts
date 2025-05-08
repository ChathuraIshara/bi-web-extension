/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        wizardFormControl: {
            width: 300,
            "& .MuiFormControl-marginNormal": {
                margin: '0',
            },
        },
        labelWrapper: {
            display: 'flex',
        },
        inputLabelForRequired: {
            padding: 0,
            color: '#1D2028',
            fontSize: 13,
            textTransform: 'capitalize',
            display: 'inline-block',
            lineHeight: 4,
            fontWeight: 300,
        },
        wizardBtnHolder: {
            display: "flex",
            justifyContent: "flex-end",
            height: "auto",
            marginTop: "2.5rem",
        },
        mainTitleWrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            margin: '-2.25rem 0.55rem 0 0',
            "& img": {
                marginRight: '1rem'
            }
        },
        formTitleWrapper: {
            width: "auto",
            zIndex: 100,
        },
        formWrapper: {
            width: '100%',
            flexDirection: "row",
            padding: theme.spacing(1.25),
        },
    }),
);
