/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const enumStyles = makeStyles((theme: Theme) =>
    createStyles({
        enumEditorContainer: {
            display: "flex",
            flexDirection: "row"
        },
        enumConfigSeparator: {
            position: "absolute",
            right: 310,
            top: 0,
            height: "100%",
            width: 1,
            borderLeft: "1px solid #d8d8d8",
        },
        enumFieldWrapper: {
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
        enumConfigTitleWrapper: {
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
            margin: 5,
            flexDirection: 'row',
            display: 'flex',
            width: '100%',
        },
        editItemContentWrapper: {
            padding: "5px 20px 5px 0px",
            margin: 5,
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
            justifyContent: "space-between"
        },
        fieldItem: {
            display: 'flex'
        },
        editTypeWrapper: {
            width: 130,
            "& .MuiFormControl-marginNormal": {
                margin: '0',
            }
        },
        editNameWrapper: {
            width: "50%",
            marginLeft: 5,
            "& .MuiFormControl-marginNormal": {
                margin: '0',
            },
            display: "flex"
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
            maxWidth: 150,
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
            alignItems: "center"
        },
        actionBtnWrapper: {
            cursor: "pointer",
            width: 25
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
        enumEditorWrapper: {
            minWidth: 270
        },
        activeEnumEditorWrapper: {
            minWidth: 270,
            boxSizing: "border-box",
            borderRadius: 4
        },
        enumHeader: {
            display: `flex`,
            flexDirection: `row`,
            "&:hover": {
                "& $enumHeaderBtnWrapper": {
                    display: "flex",
                    flexDirection: "row",
                    width: "25%",
                    alignItems: "center"
                },
                "& $enumExpandBtnWrapper": {
                    marginTop: 13,
                    marginLeft: 0
                },
                "& $typeDefEditBtnWrapper": {
                    display: "flex",
                    marginTop: -2,
                    flexDirection: "row",
                    width: "10%",
                    justifyContent: "flex-end"
                }
            }
        },
        enumHeading: {
            display: "flex",
            marginLeft: 20
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
        enumKeywordWrapper: {
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
        endEnumCode: {
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
        endEnumCodeWrapper: {
            display: "flex",
            flexDirection: "row",
            marginTop: "3px !important",
            marginLeft: 20,
        },
        singleTokenWrapper: {
            width: 10,
            color: "#000"
        },
        enumEndSemicolonWrapper: {
            width: 10,
            marginTop: "3px !important",
            color: "#000"
        },
        editEnumEndSemicolonWrapper: {
            width: 10,
            marginTop: "3px !important",
            marginLeft: 5
        },
        equalTokenWrapper: {
            margin: "0 5px",
            width: 10,
            color: "#000"
        },
        enumHeaderBtnWrapper: {
            display: "none",
            flexDirection: "row",
            width: "15%",
            alignItems: "center"
        },
        enumExpandBtnWrapper: {
            width: 20,
            marginTop: 13
        },
        typeDefEditBtnWrapper: {
            display: "none",
            cursor: "pointer",
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
        enumSubFieldWrapper: {
            display: `flex`,
            marginLeft: 20,
            flexDirection: `column`,
            borderLeft: `1px solid #e8e8e8`
        },
        activeEnumSubFieldWrapper: {
            display: `flex`,
            marginLeft: 20,
            flexDirection: `column`,
            borderLeft: `1px solid #cdcdcd`
        },
    }),
);
