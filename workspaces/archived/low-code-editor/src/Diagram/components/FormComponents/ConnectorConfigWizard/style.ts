/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const wizardStyles = makeStyles((theme: Theme) =>
    createStyles({
        configWizardContainer: {
            width: 350,
            paddingBottom: 24,
            paddingLeft: 24,
            paddingRight: 24,
            backgroundColor: "#fff",
            borderRadius: 5,
            boxShadow: "0 5px 10px 0 rgba(102, 103, 133, 0.27)",
            zIndex: 200
        },
        configWizardAPIContainer: {
            backgroundColor: "#fff",
            width: '100%',
            borderRadius: 5,
        },
        configWizardAPIContainerAuto: {
            backgroundColor: "#fff",
            width: '100%',
        },
        panelBackgroundNone: {
            display: 'none'
        },
        fullWidth: {
            width: "100%",
            "& .MuiFormControl-marginNormal": {
                margin: '0 !important',
            }
        },
        configTitle: {
            fontWeight: 500,
            fontSize: 13,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0.2rem 0.5rem',
            width: 350
        },
        deleteBtn: {
            top: -19,
            left: 182,
            backgroundColor: '#fff !important',
            width: '12px !important',
            height: '12px !important',
            padding: '13px',
            marginLeft: '1rem',
            position: 'relative'
        },
        closeBtnAutoGen: {
            top: 4,
            left: 283,
            backgroundColor: '#fff !important',
            width: '12px !important',
            height: '12px !important',
            padding: '13px',
            marginLeft: '1rem',
            position: 'relative'
        },
        titleWrapper: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
        },
        title: {
            marginBottom: 12,
            fontSize: 13,
            letterSpacing: 0,
            fontWeight: 500,
            color: "#222228",
        },
        subTitle: {
            color: "#1D2028",
            fontSize: 15,
            textTransform: "capitalize",
            fontWeight: 500,
        },
        manualConnectionTitle: {
            color: "#1D2028",
            fontSize: 13,
            textTransform: "capitalize",
            fontWeight: 500,
        },
        connectorIconWrapper: {
            width: 32,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        buttonSm: {
            height: "35px !important",
            marginTop: "2rem"
        },

        userDetailWrapper: {
            display: "flex",
            margin: '1rem 0 0.5rem 0',
        },
        userIconWrapper: {
            width: "10%",
            paddingRight: "1rem"
        },
        userNameWrapper: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 0.5rem',
            width: 165,
        },
        operationLabel: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '0 0.5rem 0.5rem 1rem',
            width: 184,
        },
        changeSelection: {
            width: 'auto',
            color: '#5567D5',
            opacity: 0.5,
            textDecoration: 'underline',
            marginTop: '0.2rem',
            '&:hover': {
                cursor: "pointer",
                textDecoration: "none",
                opacity: 1
            }
        },
        marginTB: {
            margin: '1rem 0'
        },
        mainOauthBtnWrapper: {
            display: 'flex',
            flexDirection: 'column'
        },
        oauthBtnWrapper: {
            display: "flex",
            flexDirection: "column"
        },
        connectBackBtn: {
            display: "flex",
            height: "auto",
            marginTop: "1rem"
        },
        wizardFormAPIControl: {
            // width: 300,
        },
        APIbtnWrapper: {
            position: 'fixed',
            top: 650,
            marginLeft: 110,
        },
        mainApiWrapper: {
            maxWidth: 301
        },
        marginLR: {
            margin: "0 1rem"
        },
        marginBottom: {
            marginBottom: "1rem"
        },
        marginTop: {
            marginTop: "3rem"
        },
        mainWrapper: {
            width: '100%',
            background: "none"
        },
        topTitleWrapper: {
            background: "#fff",
            borderRadius: "5px 5px 0 0",
            marginBottom: 16,
        },
        bottomBtnWrapper: {
            background: "#fff",
            borderRadius: "0 0 5px 5px",
        },
        bottomPadding: {
            paddingBottom: "1.5rem"
        },
        bottomRadius: {
            borderRadius: "0 0 5px 5px"
        },
        formWrapper: {
            '& .exp-container .exp-absolute-wrapper .exp-editor': {
                marginBottom: 0,
                height: 40,
            },
            '& .monaco-editor .view-lines': {
                lineHeight: '31px !important',
            }
        },
        box: {
            width: "auto",
            height: 45,
            borderRadius: 5,
            marginBottom: theme.spacing(1),
            borderColor: theme.palette.secondary.main,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '& h6.MuiTypography-root.MuiTypography-subtitle2': {
                paddingLeft: theme.spacing(2.5),
            }
        },
        changeConnectionBtn: {
            padding: 3,
        },
        loaderWrapper: {
            height: "100%",
            width: 301,
            display: 'flex',
        },
        connectionNameWrapper: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%"
        },
        saveBtnWrapper: {
            display: "flex",
            justifyContent: "flex-end",
            height: "auto",
            marginTop: "2.5rem",
        },
        section: {
            marginBottom: theme.spacing(2)
        },
        saveConnectorBtnHolder: {
            display: "flex",
            width: "100%",
            height: 80,
            flexDirection: 'column',
            justifyContent: "space-between"
        },
        manualBtnWrapper: {
            display: "flex",
            flexDirection: "column",
            marginTop: '1rem',
            position: "relative"
        },
        authBtnHolder: {
            display: "flex",
            width: "100%",
            height: 100,
            flexDirection: 'column',
            justifyContent: "space-between",
            paddingTop: theme.spacing(2.5)
        },
        titleLabelRequired: {
            padding: 0,
            color: '#DC143C',
            fontSize: "13px",
            textTransform: 'capitalize',
            display: 'inline-block',
            paddingTop: '0.25rem'
          }
    }),
);
