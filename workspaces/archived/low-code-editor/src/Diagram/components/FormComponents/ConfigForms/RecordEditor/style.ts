/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const recordStyles = makeStyles((theme: Theme) =>
    createStyles({
        recordEditorContainer: {
            display: "flex",
            flexDirection: "row"
        },
        recordConfigSeparator: {
            position: "absolute",
            right: 310,
            top: 0,
            height: "100%",
            width: 1,
            borderLeft: "1px solid #d8d8d8",
        },
        recordFieldWrapper: {
            height: "83vh",
            marginRight: 10,
            paddingRight: 10,
            overflowY: "scroll",
            '&::-webkit-scrollbar': {
                width: '3px',
                height: '3px'
            },
            '&::-webkit-scrollbar-thumb': {
                background: '#e6e7ec',
                borderRadius: 2
            },
            '&::-webkit-scrollbar-thumb:horizontal': {
                background: '#e6e7ec',
                borderRadius: 2
            },
            '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent'
            },
            '&::-webkit-scrollbar-corner': {
                backgroundColor: 'transparent'
            }
        },
        recordConfigTitleWrapper: {
            position: "absolute",
            width: "auto",
            height: 48,
            top: 0,
            display: "inline-flex",
            zIndex: 100
        },
        fieldEditorWrapper: {
            boxSizing: "border-box",
            width: "100%",
            border: "1px solid #EEEEEE",
            backgroundColor: "#F7F8FB",
            padding: `15.5px 24px`,
            marginTop: 15.5
        },
        itemContentWrapper: {
            margin: "5px 5px 5px 20px",
            flexDirection: 'row',
            display: 'flex',
            width: '100%',
        },
        editItemContentWrapper: {
            padding: "5px 10px 5px 0px",
            margin: "5px 5px 5px 22px",
            flexDirection: 'row',
            display: 'flex',
            width: '100%',
            backgroundColor: "#f1f1f5",
            borderRadius: 5
        },
        activeItemContentWrapper: {
            marginLeft: 10,
            marginRight: 10,
            backgroundColor: "#ededf1",
            margin: `5px 0`,
            flexDirection: 'row',
            display: 'flex',
            width: '100%'
        },
        itemWrapper: {
            display: 'flex',
            flexDirection: `row`,
            marginRight: 0,
            "&:hover": {
                "& $itemLabelWrapper": {
                    background: "#ededf1",
                },
                cursor: "pointer",
                "& $btnWrapper": {
                    display: "flex",
                    flex: "0 0 12%",
                    maxWidth: "12%",
                    marginTop: -6
                }
            }
        },
        itemLabelWrapper: {
            width: "100%",
            display: 'flex',
            paddingLeft: 5
        },
        editTypeWrapper: {
            width: 130,
            "& .MuiFormControl-marginNormal": {
                margin: '0',
            }
        },
        editNameWrapper: {
            width: "42%",
            marginLeft: 5,
            "& .MuiFormControl-marginNormal": {
                margin: '0',
            }
        },
        editSingleTokenWrapper: {
            width: 10,
            marginTop: "3px !important",
            marginLeft: 3
        },
        editFieldDelBtn: {
            marginTop: -2,
            width: 16
        },
        typeWrapper: {
            maxWidth: 80,
            color: '#00819C',
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        nameWrapper: {
            maxWidth: 80,
            color: "#000",
            marginLeft: 5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        },
        defaultValWrapper: {
            maxWidth: 40,
            color: '#B20002',
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
        },
        optionalNArray: {
            maxWidth: 15,
            color: "#000",
        },
        editOptionalNArray: {
            maxWidth: 15,
            marginTop: "3px !important",
            marginLeft: 5,
        },
        btnWrapper: {
            display: "none",
            flexDirection: "row",
            width: "20%",
            alignItems: "center"
        },
        actionBtnWrapper: {
            cursor: "pointer",
            width: 25
        },
        activeBtnWrapper: {
            paddingLeft: 2,
            marginLeft: 2,
            marginRight: 2,
            cursor: "pointer",
            width: 20,
            backgroundColor: "#C5EAFE"
        },
        inactiveBtnWrapper: {
            paddingLeft: 2,
            marginLeft: 2,
            marginRight: 2,
            cursor: "pointer",
            width: 20
        },
        iconBtn: {
            padding: 0
        },
        draftBtnWrapper: {
            width: "80%",
            display: "flex",
            flexDirection: "row",
            padding: 10,
            margin: "5px 10px",
        },
        addFieldBtn: {
            outline: "none",
            marginLeft: 24,
            marginTop: 10,
            color: "#5567D5",
            fontSize: 12,
            letterSpacing: 0,
            lineHeight: "16px",
            cursor: "pointer",
            background: "#fff",
            border: "1px solid #5567d55c",
            padding: "4px 8px",
            borderRadius: 8
        },
        addFieldBtnWrap: {
            margin: `10px 10px 10px 5px`,
            color: "#5567D5",
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            "& .MuiSvgIcon-root": {
                height: '18px !important',
            }
        },
        recordEditorWrapper: {
            minWidth: 270
        },
        activeRecordEditorWrapper: {
            minWidth: 270,
            boxSizing: "border-box",
            borderRadius: 4
        },
        recordHeader: {
            display: `flex`,
            flexDirection: `row`
        },
        recordHeading: {
            display: "flex",
            flexGrow: 1
        },
        typeNVisibilityWrapper: {
            marginTop: "3px !important",
            maxWidth: 70,
            fontFamily: "inherit",
            color: '#1E00FF'
        },
        typeDefNameWrapper: {
            maxWidth: 130,
            marginLeft: 5,
            marginTop: "3px !important",
            color: "#00819C",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            "& .MuiFormControl-marginNormal": {
                margin: '0',
            }
        },
        typeTextFieldWrapper: {
            width: 120,
            marginLeft: 5,
            "& .MuiFormControl-marginNormal": {
                margin: '0',
            }
        },
        recordKeywordWrapper: {
            width: 40,
            marginLeft: 5,
            marginTop: "3px !important",
            fontFamily: "inherit",
            color: '#1E00FF'
        },
        openBraceTokenWrapper: {
            width: 15,
            marginLeft: 5,
            marginTop: "3px !important",
            fontFamily: "inherit",
            color: '#000'
        },
        dotExpander: {
            marginLeft: 5,
            marginTop: 3,
            cursor: "pointer"
        },
        endRecordCode: {
            maxWidth: 200,
            marginLeft: 5,
            marginTop: 3,
            fontFamily: "inherit",
            color: '#000'
        },
        closeBraceTokenWrapper: {
            maxWidth: 40,
            marginTop: "3px !important",
            fontFamily: "inherit",
            color: '#000'
        },
        endRecordCodeWrapper: {
            display: "flex",
            flexDirection: "row",
            marginTop: "3px !important",
            marginLeft: 20,
        },
        singleTokenWrapper: {
            width: 10,
            color: "#000"
        },
        singleTokenWrapperWithMargin: {
            width: 10,
            color: "#000",
            marginTop: "3px !important",
        },
        recordEndSemicolonWrapper: {
            width: 10,
            marginTop: "3px !important",
            color: "#000"
        },
        editRecordEndSemicolonWrapper: {
            width: 10,
            marginTop: "3px !important",
            marginLeft: 5
        },
        equalTokenWrapper: {
            margin: "0 5px",
            width: 10,
            color: "#000"
        },
        fieldEditorEqualsTokenWrapper: {
            marginTop: "5px !important",
            marginLeft: "5px !important",
            marginRight: "5px !important",
            width: 10,
            color: "#000"
        },
        recordHeaderBtnWrapper: {
            display: "flex",
            flexDirection: "row",
            flex: "0 0 30%",
            maxWidth: "30%",
            marginTop: -2,
            alignItems: "center",
            cursor: "pointer"
        },
        recordExpandBtnWrapper: {
            flex: "0 0 36px",
            maxWidth: `25px`,
            marginTop: `10px`,
            marginLeft: `15px`
        },
        typeDefEditBtnWrapper: {
            cursor: "pointer",
            display: "flex",
            flexDirection: "row",
            width: "15%",
            justifyContent: "flex-end",
            alignItems: "center"
        },
        buttonWrapper: {
            height: 'auto',
            display: 'flex',
            justifyContent: 'flex-end',
            width: '100%',
            zIndex: 100,
            paddingTop: '2rem',
            paddingRight: 24
        },
        configButtonWrapper: {
            width: "auto",
            marginRight: 20,
        },
        fieldAddButtonWrapper: {
            height: 'auto',
            display: 'flex',
            marginTop: 10,
            justifyContent: 'flex-end',
            width: '100%',
            zIndex: 100,
        },
        jsonButtonWrapper: {
            marginRight: 20,
        },
        recordSubFieldWrapper: {
            display: `flex`,
            marginLeft: `25px`,
            flexDirection: `column`,
            borderLeft: `1px solid #e8e8e8`
        },
        activeRecordSubFieldWrapper: {
            display: `flex`,
            marginLeft: `25px`,
            flexDirection: `column`,
            borderLeft: `1px solid #cdcdcd`
        },
        createButton: {
            textTransform: 'initial'
        },
        createButtonWrapper: {
            display: "flex",
            margin: 16,
            flexDirection: "column",
            "& button": {
                marginBottom: 16
            }
        },
        headerWrapper: {
            background: "white",
            padding: 10,
            borderRadius: 5,
            cursor: "pointer",
            border: "1px solid #dee0e7",
            marginTop: 15,
            marginLeft: 20,
            marginRight: 10,
            justifyContent: "space-between",
            display: "flex",
            flexDirection: 'row',
            height: 40,
            alignItems: 'center'
        },
        contentSection: {
            display: "flex",
            width: "75%",
            justifyContent: "flex-start"
        },
        iconSection: {
            display: "flex",
            flexDirection: "row",
            width: "25%",
            justifyContent: "flex-end"
        },
        editIconWrapper: {
            cursor: "pointer",
            height: 14,
            width: 14
        },
        deleteIconWrapper: {
            cursor: "pointer",
            marginLeft: 10,
            marginTop: -1,
            height: 14,
            width: 14
        },
        doneButtonWrapper: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginRight: 20,
            marginTop: 16,
        },
        inputLabelWrapper: {
            marginLeft: 20,
            marginTop: 10,
            height: 50
        },
        inputLabel: {
            color: '#1D2028',
            fontSize: 15,
            textTransform: 'capitalize',
            lineHeight: '35px',
            fontWeight: 400,
            margin: 0
        },
        inputLabelDetail: {
            color: '#4a4d55',
            fontSize: 13,
            textTransform: 'capitalize',
            fontWeight: 300
        },
        ballerinLabel: {
            color: '#4a4d55',
            fontSize: 13,
            textTransform: 'capitalize',
            fontWeight: 300,
            textAlign: 'end'
        },
        inputSuccessTick: {
            color: "#08d608",
            marginBottom: -5
        },
        inputLink: {
            color: 'blue',
            cursor: 'pointer',
            marginLeft: 5,
            marginRight: 5,
            fontSize: 13,
            textTransform: 'capitalize',
            lineHeight: '35px',
            fontWeight: 400,
            "&:hover": {
                textDecoration: 'underline'
            }
        },
        recordOptions: {
            padding: 10,
            display: "inline-flex",
            alignItems: "center",
            "& a": {
                cursor: "pointer",
                color: "#5567D5"
            },
            "& a:hover": {
                textDecoration: "none",
            }
        },
        deleteRecord: {
            display: "flex",
            alignItems: "center",
            color: "#FE523C",
            cursor: "pointer",
            "& svg": {
                marginRight: 8
            }
        },
        undoButton: {
            padding: 2
        },
        marginSpace: {
            marginLeft: 15,
            marginRight: 15
        }
    }),
);
