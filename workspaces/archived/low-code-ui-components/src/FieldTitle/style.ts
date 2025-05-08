/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

// Copy of the styles is maintained in low-code-commons
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textFeild: {
      marginTop: "0",
      height: 35,
      width: "100%",
      borderRadius: 5,
      backgroundColor: "#ffffff",
      boxShadow: "inset 0 0 0 1px #dee0e7, inset 0 2px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 0 rgba(50, 50, 77, 0.07)",
      cursor: "pointer",
      padding: "0 1rem",
      "&:hover": {
        boxShadow: "inset 0 0 0 1px rgba(85,103,213,0.4), inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)",
      },
      "&:focus": {
        boxShadow: "inset 0 0 0 1px rgba(85,103,213,0.4), inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)",
      },
      "&:active": {
        boxShadow: "inset 0 0 0 1px rgba(85,103,213,0.4), inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)",
      },
      "&.Mui-focused": {
        boxShadow: "inset 0 0 0 1px rgba(85,103,213,0.4), inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07)",
      },
    },
    underline: {
      "&&&:before": {
        borderBottom: "0 !Important "
      },
      "&&:after": {
        borderBottom: "0 !Important"
      }
    },
    inputlabel: {
      padding: 0,
      color: "#1D2028 !important",
      fontSize: "13px !important",
      margin: '0 !important',
      textTransform: 'capitalize',
      "& .MuiFormControl-marginNormal": {
        margin: '0 !important',
      },
    },
    textArea: {
      backgroundColor: '#F8F9FA',
      padding: "0.75rem",
      borderRadius: "5px",
      boxShadow: "inset 0 2px 2px 0 rgba(0,0,0,0.07), 0 0 1px 0 rgba(50,50,77,0.07)",
      boxSizing: 'border-box',
      minHeight: 104,
      width: '100%',
      border: '1px solid #DEE0E7',
      fontFamily: 'inherit',
      color: '#1D2028',
      // marginTop: '0.5rem',
      lineHeight: '22px',
      '&::placeholder': {
        color: '#8D91A3',
        fontSize: 13,
        fontWeight: 100,
        marginTop: '0.5rem',
      }
    },
    ".MuiInput-root": {
      '& .MuiInput-underline:before': {
        border: '1px solid #e03997'
      }
    },
    errorField: {
      bordeRadius: "5px",
      background: 'rgba(234,76,77,0.05)',
      boxShadow: 'inset 0 0 0 1px #EA4C4D, inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07) !important',
      color: "#1d202882",
      '& .MuiOutlinedInput-input': {
        borderRadius: 5,
        borderColor: "#trasnparent !important",
        boxShadow: "inset 0 0 0 1px #EA4C4D, inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07) !important",
      },
      "&:hover": {
        boxShadow: "inset 0 0 0 1px #EA4C4D, inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07) !important",
      },
      "&:focus": {
        boxShadow: "inset 0 0 0 1px #EA4C4D, inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07) !important",
      },
    },
    error: {
      "&.MuiFormHelperText-root.Mui-error": {
        fontSize: '13px !important',
      },
      "MuiInputBase-input": {
        "&:hover": {
          boxShadow: "inset 0 0 0 1px #EA4C4D, inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07) !important",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px #EA4C4D, inset 0 1px 1px 0 rgba(0,0,0,0.07), 0 0 0 0 rgba(50,50,77,0.07) !important",
        },
      },
    },
    "&.MuiFormHelperText-root.Mui-error": {
      fontSize: '13px !important'
    },
    chipContainer: {
      width: "100%",
    },
    chipRoot: {
      marginTop: "15px",
      width: "100%"
    },
    chipLabel: {
      textTransform: 'capitalize',
      fontSize: "13px",
      color: "#1D2028",
      transform: "scale(1, 1)"
    },
    chip: {
      color: "#32324D",
      fontSize: 10,
      background: "#F7F8FB"
    },
    chipHelperText: {
      fontSize: "13px !important",
    },
    notchedRoot: {
      width: "100%",
      flexWrap: "wrap",
      padding: "0.75rem 1rem",
    },
    notchedOutline: {
      width: "100%",
      border: "0 !important",
    },
    content: {
      color: theme.palette.grey[700],
      fontWeight: 400,
    },
    inputField: {
      marginTop: "0",
      height: "48px",
      width: "296px",
      backgroundColor: "#ffffff",
      boxShadow: "inset 0 0 0 1px #dee0e7, inset 0 2px 1px 0 rgba(0, 0, 0, 0.07), 0 0 0 0 rgba(50, 50, 77, 0.07)",
      cursor: "pointer",
      padding: "0 1rem",
    },
    editableLabelWrapper: {
      display: "block"
    },
    deleteIcon: {
      width: 3,
      position: 'relative'
    },
    labelWrapper: {
      width: "auto"
    },
    inputWrapper: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%"
    },
    infoIcon: {
      marginTop: '0.9rem'
    },
    whiteToolTip: {
      background: 'red'
    },
    code: {
      fontSize: 10,
      border: '1px solid #36B475',
      borderRadius: '3px',
      padding: '2px 3px'
    },
    codeWrapper: {
      margin: '-5px 0 7px !important'
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
    }
  }),
  { index: 1 }
);
