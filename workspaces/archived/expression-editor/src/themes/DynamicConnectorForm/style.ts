/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: ordered-imports
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import { formCreateSvg } from "../../assets";

export const useStyles = makeStyles((theme: Theme) =>
        createStyles({
            wizardFormControl: {
                width: 300,
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                },
            },
            wizardFormControlExtended: {
                width: 500,
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                },
            },
            ".MuiFormControl-root": {
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                }
            },
            formContentWrapper: {
                width: '100%',
                flexDirection: "row",
                padding: '15px 20px',
            },
            formDeclarationWrapper: {
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                }
            },
            formNameWrapper: {
                width: '100%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
                marginTop: theme.spacing(0),
                '&:last-child': {
                    marginRight: 0
                }
            },
            formNameNValueWrapper: {
                width: '50%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
                marginTop: theme.spacing(1.5),
                '&:last-child': {
                    marginRight: 0
                }
            },
            formEqualWrapper: {
                width: '100%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
            },
            formCodeExpressionLargeField: {
                width: '87%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
            },
            formCodeExpressionField: {
                width: '80%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
            },
            formCodeExpressionValueField: {
                width: '55%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
                '&:last-child': {
                    marginRight: 0
                }
            },
            formCodeExpressionValueRegularField: {
                width: '75%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
                '&:last-child': {
                    marginRight: 0
                }
            },
            formCodeExpressionSmallField: {
                width: '43%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
                top: '-30px'
            },
            formCodeExpressionExtraSmallField: {
                width: '35%',
                position: 'relative',
            },
            formEqualContainer: {
                display: 'inline-flex',
                width: '100%',
                marginTop: theme.spacing(1)
            },
            equalCode: {
                paddingTop: theme.spacing(1.5),
            },
            equalContainer: {
                paddingTop: theme.spacing(5),
                width: theme.spacing(1.5),
            },
            valueContainer: {
                width: '100%',
                paddingRight: theme.spacing(1),
                position: 'relative',
                marginTop: theme.spacing(1.5)
            },
            formCodeBlockWrapper: {
                width: '100%',
                display: 'flex',
                flexDirection: 'column'
            },
            formCodeWrapper: {
                width: '100%',
                display: 'inline-flex'
            },
            formCodeExpressionWrapper: {
                display: 'inline-flex',
            },
            elseIfExpressionWrapper: {
                display: 'inline-flex',
                paddingTop: '25px'
            },
            formCodeExpressionEndWrapper: {
                display: 'inline-flex',
                alignItems: 'flex-end',
                paddingTop: theme.spacing(1),
            },
            formCodeExpressionCenterWrapper: {
                display: 'inline-flex',
                alignContent: 'center',
            },
            formCodePlusWrapper: {
                paddingRight: theme.spacing(1)
            },
            formCodeMinusWrapper: {
                paddingBottom: theme.spacing(1.25)
            },
            fullWidth: {
                width: "100%",
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                }
            },
            marginTop: {
                marginTop: '3rem'
            },
            topMargin: {
                marginTop: '1rem'
            },
            marginTB: {
                margin: '1rem 0'
            },
            configPanel: {
            },
            createConfigPanel: {
                margin: 0,
            },
            typographyMargin: {
                margin: '0 1rem',
            },
            inputLabelWrapper: {
                padding: 0,
                color: "#1D2028 !important",
                fontSize: "13px !important",
                textTransform: 'capitalize',
                lineHeight: '40px',
            },
            titleIcon: {
                display: 'flex',
                padding: theme.spacing(1),
            },
            inputLabelWrapperText: {
                textTransform: 'none'
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
                lineHeight: '35px',
                fontWeight: 300,
            },
            starLabelForRequired: {
                padding: 0,
                color: '#DC143C',
                fontSize: "13px",
                textTransform: 'capitalize',
                display: 'inline-block'
            },
            optionalLabel: {
                paddingRight: '5px',
                color: '#CBCEDB',
                fontSize: '12px',
                textTransform: 'capitalize',
                display: 'inline-block',
                lineHeight: '40px',
                marginBottom: '0.06rem',
                marginLeft: '0.25rem',
                marginTop: '0.094375rem'
            },
            groupedForm: {
                boxSizing: "border-box",
                height: "auto",
                width: "100%",
                border: "1px solid #DEE0E7",
                borderRadius: "6px",
                backgroundColor: "#FFF",
                padding: "0.5rem 1rem 1rem",
                "& .MuiInputBase-root": {
                    width: '100% !important',
                },
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                },
            },
            groupedFormUnion: {
                boxSizing: "border-box",
                height: "auto",
                width: "100%",
                border: "1px solid #DEE0E7",
                borderRadius: "6px",
                backgroundColor: "#FFF",
                padding: "0.5rem 1rem 1rem",
                marginTop: "0.5rem !important",
                "& .MuiInputBase-root": {
                    width: '100% !important',
                },
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                },
            },
            buttonHolder: {
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "0.5rem",
            },
            addElementButton: {
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 10
            },
            wizardBtnHolder: {
                display: "flex",
                justifyContent: "flex-end",
                height: "auto",
                marginTop: "2.5rem",
            },
            wizardCreateBtnHolder: {
                display: "flex",
                justifyContent: "space-between",
                height: "auto",
                marginTop: "2.5rem",
            },
            saveBtnHolder: {
                display: "flex",
            },
            saveConnectorBtnHolder: {
                display: "flex",
                width: "100%",
                height: 80,
                flexDirection: 'column',
                justifyContent: "space-between"
            },
            formCreate: {
                width: 191.2,
                height: 191.2,
                backgroundImage: `url('${formCreateSvg}')`,
                margin: '10% auto',
            },
            helperText: {
                fontSize: "13px !important",
                marginBottom: "0.5rem",
                color: `#1D2028 !important`,
                padding: 0,
                marginTop: `1.25rem !important`,
                textTransform: 'capitalize',
            },
            formTitle: {
                display: 'flex',
                alignItems: 'center',
                backgroundColor: "#fff",
                // position: 'absolute',
                // zIndex: 900
            },
            formIcon: {
                width: 32,
                height: 28,
                "& svg": {
                    transform: "scale(0.5, 0.5)",
                    transformOrigin: "top left"
                }
            },
            smallInputWrapper: {
                display: 'flex',
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                },
                '& inputLabelWrapper': {
                    margin: '1rem 0 !important'
                }
            },
            smallInput: {
                width: '50%',
                justifyContent: 'spaceBetween',
                "& .MuiFormControl-fullWidth": {
                    "& .MuiInputBase-root": {
                        width: '90% !important',
                    }
                }
            },
            formTitleTag: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                padding: '0',
                width: 164
            },
            inputHelpTips: {
                padding: 0,
                color: "#1D2028 !important",
                fontSize: "13px !important",
                marginTop: '1.25rem !important',
            },
            inActiveWrapper: {
                opacity: 0.5,
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                },
            },
            activeWrapper: {
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                }
            },
            customCode: {
                "& .MuiFormControl-marginNormal": {
                    margin: '0 !important',
                }
            },
            isArrayCheck: {
                margin: 0,
                paddingTop: 10,
                "& .MuiFormControl-root": {
                    margin: '0 !important',
                    "& .MuiFormLabel-root.Mui-error": {
                        display: 'none !important'
                    }
                },
            },
            titleWrapper: {
                height: 26,
                display: 'flex'
            },
            subtitle: {
                marginTop: '1.25rem',
                fontSize: 14,
                color: '#1D2028',
                letterSpacing: 0,
                textTransform: 'capitalize'
            },
            mainTitleWrapper: {
                display: 'inline-flex',
                alignItems: 'center',
                width: 'auto'
            },
            iconWrapper: {
                marginRight: '1rem'
            },
            divider: {
                height: 1,
                border: '1px dashed #DEE0E7',
                margin: '1.5rem 0 1.5rem 0.5rem'
            },
            arraySubWrapper: {
                width: '100%',
            },
            addIconButton: {
                margin: '0 !important',
                padding: '0 !important',
                color: '#5567d5',
            },
            iconButton: {
                height: 16.5,
                width: 16.5,
                borderRadius: '50%',
                border: '1.75px solid #5667d5',
                color: '#5667d5',
                fontSize: 12,
            },
            emailFormTo: {
                marginTop: "0px"
            },
            emailFormSubject: {
                marginTop: "24px"
            },
            unionDropdown: {
                marginTop: '0 !important',
            },
            arrayWrapper: {
                width: '80%',
                height: 'auto',
                marginTop: "-1rem",
            },
            arrayWrapperContent: {
                width: '100%',
                height: 'auto',
            },
            addContainer: {
                display: 'flex',
                flexDirection: 'column',
            },
            labelInsideWapper: {
                width: '100%',
                marginBottom: '0.5rem'
            },
            addWrapperBtn: {
                display: 'flex',
                justifyTtems: "right",
                color: '#5567d5!important',
                marginTop: '0.5rem',
            },
            addBtnWrapper: {
                borderRadius: '0 5px 5px 0',
                display: 'block',
                height: 'auto',
                marginTop: '2.85rem',
                padding: 0,
            },
            valueWrapper: {
                display: 'flex',
                flexDirection: 'column',
            },
            elementValueWrapper: {
                margin: '0 0 1rem 0',
                width: 'auto',
                display: 'flex',
                border: '1px solid #dee0e7',
                borderRadius: 5,
            },
            componentGap: {
                marginBottom: 4,
            },
            textlabel: {
                fontSize: '13px !important',
                width: '215px !important',
                padding: 8,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            },
            deleteBtn: {
                backgroundColor: '#fff !important',
                width: '12px !important',
                height: '12px !important',
                padding: '13px',
                marginLeft: '1rem',
                marginTop: '0.25rem'
            },
            overlayDeleteBtn: {
                backgroundColor: '#fff !important',
                width: '12px !important',
                height: '12px !important',
                padding: '13px',
                marginLeft: '1rem',
                position: 'relative',
                top: -18,
                left: 190,
                "& svg": {
                    fontSize: 16,
                    strokeWidth: 1,
                    stroke: '#cbcedb',
                    opacity: 1,
                    fill: '#cbcedb'
                }
            },
            overlayAPIDeleteBtn: {
                backgroundColor: '#fff !important',
                width: '12px !important',
                height: '12px !important',
                padding: '13px',
                marginLeft: '1rem',
                position: 'relative',
                top: -18,
                left: 229,
                "& svg": {
                    fontSize: 16,
                    strokeWidth: 1,
                    stroke: '#cbcedb',
                    opacity: 1,
                    fill: '#cbcedb'
                }
            },
            inputWrapper: {
                marginTop: '1rem'
            },
            formTitleWrapper: {
                width: "100%",
                zIndex: 100,
                height: theme.spacing(6),
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingLeft: theme.spacing(1.25),
            },
            oauthWrapper: {
                paddingTop: "5rem"
            },
            headerWrapper: {
                display: 'flex',
            },
            headerLabel: {
                background: 'white',
                padding: 10,
                borderRadius: 5,
                border: '1px solid #dee0e7',
                margin: '1rem 0 0.25rem',
                justifyContent: 'space-between',
                display: 'flex',
                width: '100%',
                alignItems: 'center',
            },
            invalidCode: {
                fontSize: '11px !important',
                color: '#ea4c4d !important',
                "&:first-letter": {
                    textTransform: 'capitalize',
                }
            },
            suggestionsWrapper: {
                display: 'flex',
                marginTop: '4px'
            },
            suggestionsIcon: {
                marginRight: '6px',
                marginTop: '3px',
                height: '20px',
                width: '20px'
            },
            suggestionsText: {
                fontSize: '13px !important',
                color: '#8d91a3 !important',
                marginTop: '0 !important',
                "&:first-letter": {
                    textTransform: 'capitalize',
                }
            },
            suggestionsTextError: {
                color: '#ea4c4d !important',
                "&:hover": {
                    cursor: 'pointer',
                    textDecoration: 'underline'
                }
            },
            suggestionsTextInfo: {
                color: '#526acf !important',
                "&:hover": {
                    cursor: 'pointer',
                    textDecoration: 'underline'
                }
            },
            suggestionsTextCodeSnippet: {
                backgroundColor: "#eff1f5",
                color: "#526acf",
                fontSize: "12px",
                padding: "5px"
            },
            pre: {
                margin: 0,
                display: "contents",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word"
            },
            toFieldTooltipWrapper: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%"
            },
            toFieldTooltipIconWrapper: {
                display: "flex",
                justifyContent: "space-between",
                marginTop: '-1.5rem !important'
            },
            removeInnerMargin: {
                margin: '0.5rem 0 0 0 !important',
                "& div": {
                    margin: '0 !important',
                    "& div": {
                        margin: '0 !important',
                        "& div": {
                            margin: '0 !important',
                        }
                    }
                }
            },
            addPropertyBtn: {
                outline: "none",
                width: "max-content",
                color: "#5567D5",
                fontSize: 12,
                letterSpacing: 0,
                cursor: "pointer",
                background: "#fff",
                padding: "4px 8px 4px 8px",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                "& .MuiSvgIcon-root": {
                    height: '18px !important',
                },
                marginTop: 6,
            },
            addParameterBtn: {
                paddingLeft: 0,
                marginTop: 6,
                textTransform: 'initial'
            },
            sectionSeperatorHR: {
                margin: "1.5rem 0"
            },
            sectionSeparator: {
                borderBottom: "1px solid #D8D8D8",
                marginBottom: "15px",
                padding: "5px 0"
            },
            formWrapper: {
                width: '100%',
                flexDirection: "row",
                padding: '15px 20px',
            },
            formFeilds: {
                marginBottom: theme.spacing(2.5),
                width: '100%',
            },
            codeWrapper: {
                width: '100%',
                display: 'inline-flex'
            },
            code: {
                display: 'flex',
                alignItems: 'flex-end',
                height: '100%',
                paddingBottom: theme.spacing(0.375),
                paddingLeft: theme.spacing(1)
            },
            startTitleCode: {
                color: '#0095FF',
                width: 'max-content',
                paddingTop: theme.spacing(5),
                paddingRight: theme.spacing(1),
            },
            startCode: {
                color: '#0095FF',
                width: 'max-content',
                paddingBottom: theme.spacing(0.5),
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
            },
            middleDottedwrapper: {
                display: 'flex',
                paddingBottom: theme.spacing(1.25)
            },
            middleCode: {
                color: '#8D91A3',
                marginLeft: theme.spacing(3),
                cursor: 'default'
            },
            endCode: {
                color: '#1D2028',
                paddingBottom: theme.spacing(1),
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
            },
            elseBlockWrapper: {
                width: '100%',
                display: 'inline-block'
            },
            statementEditor: {
                alignItems: 'center',
                display: 'inline-flex',
                justifyContent: 'flex-end',
                paddingRight: theme.spacing(1),
                width: '100%'
            },
            start: {
                height: 'fit-content',
                paddingTop: theme.spacing(3.625),
                width: '15%'
            },
            middle: {
                width: '80%'
            },
            end: {
                height: 'fit-content',
                paddingTop: theme.spacing(3.625),
                width: '5%'
            },
            expFieldWrapper: {
                display: 'flex',
                width: '100%',
                flexDirection: 'column',
                position: 'relative'
            },
            blockWrapper: {
                display: 'flex',
                width: '100%',
                flexDirection: 'column'
            },
            inlineBlockWrapper: {
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
            },
            dropdownWrapper: {
                minWidth: `92px !important`
            },
            codeText: {
                paddingTop: theme.spacing(1.25),
                paddingRight: theme.spacing(1)
            },
            codeTitleText: {
                paddingRight: theme.spacing(1)
            },
            equalWrapper: {
                paddingTop: theme.spacing(5),
                width: theme.spacing(1.5),
            },
            inWrapper: {
                paddingTop: theme.spacing(6.25),
                width: theme.spacing(4),
                textAlign: 'center'
            },
            editorWrapper: {
                minWidth: `110px !important`,
                '& .MuiInputBase-root': {
                    marginBottom: theme.spacing(0.625)
                }
            },
            scrollableArea: {
                overflow: 'scroll',
                '&::-webkit-scrollbar': {
                    width: '3px'
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#e6e7ec',
                    borderRadius: '2px'
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'transparent'
                },
                '&::-webkit-scrollbar-corner': {
                    backgroundColor: 'transparent'
                }
            },
            nameInput: {
                height: theme.spacing(5)
            },
            expEditorWrapper: {
                minWidth: `164px !important`,
                paddingTop: theme.spacing(1.25),
                position: 'relative'
            },
            typeContainer: {
                width: '50%'
            },
            returnWrapper: {
                width: "82%"
            },
            fitContent: {
                width: 'fit-content'
            },
            foreachWrapper: {
                width: '100%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
                marginTop: theme.spacing(-2),
            },
            stmtEditorWrapper: {
                width: '100%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
            },
            nameExpEditorWrapper: {
                width: '50%',
                marginRight: theme.spacing(0.625),
                position: 'relative',
                marginTop: theme.spacing(1.5),
                '&:last-child': {
                    marginRight: 0
                }
            },
            variableExpEditorWrapper: {
                width: '100%',
                paddingRight: theme.spacing(1),
                position: 'relative',
                '&:last-child': {
                    paddingRight: 0,
                },
            },
            ifEditorWrapper: {
                minWidth: `220px !important`,
                paddingRight: theme.spacing(1),
                paddingTop: theme.spacing(1.25),
                position: 'relative'
            },
            buttonWrapper: {
                display: 'inline-flex',
                width: '100%',
                alignItems: 'center'
            },
            button: {
                '&.MuiIconButton-root': {
                    padding: 0,
                }
            },
            elseIfEditorWrapper: {
                minWidth: `180px !important`,
                paddingRight: theme.spacing(1),
                paddingTop: theme.spacing(1.25),
                position: 'relative'
            },
            resourceMethodPathWrapper: {
                display: 'flex',
                flexDirection: 'row',
                padding: '15px 5px'
            },
            resourceMethodTitle: {
                width: '100%',
                marginRight: 5,
            },
            resourcePathWrapper: {
                width: '63%',
                marginLeft: theme.spacing(1.25)
            },
            methodTypeContainer: {
                display: 'block',
                width: '35%',
            },
            advancedSwitchText: {
                textAlign: 'right',
                padding: '0 5px 15px'
            },
            toggle: {
                display: 'inline-flex',
                alignItems: 'center',
                gap: theme.spacing(1)
            },
            inlineWrapper: {
                display: 'inline-flex',
                width: '100%',
                marginTop: theme.spacing(1)
            },
            tooltipContainer: {
                marginLeft: 'auto',
                marginRight: '0'
            },
            operationTitle: {
                display: 'inline-flex',
                alignItems: 'center',
                width: '100%'
            },
            buttonLink: {
                color: theme.palette.primary.main,
                cursor: "pointer",
                "&:hover": {
                    textDecoration: "underline"
                }
            },
            componentWrapper: {
                display: "flex",
                justifyContent: "space-between",
            },
            docButton : {
                marginLeft: theme.spacing(15.75)
            },
            recordCreate: {
                textTransform: 'none',
                minWidth: '32px',
                color: theme.palette.primary.main,
                marginLeft: theme.spacing(0.5),
                cursor: 'pointer',
            }
        }),
    { index: 1 }
);
