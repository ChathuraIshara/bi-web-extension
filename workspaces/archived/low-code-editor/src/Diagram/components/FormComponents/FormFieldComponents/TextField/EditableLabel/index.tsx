/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from "react";

import { FormHelperText, TextField } from "@material-ui/core";
import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import cn from "classnames";

import { deleteVariableNameSvg, editVariableNameSvg } from "../../../../../../assets";
import { useStyles as useFormStyles } from "../../../DynamicConnectorForm/style";
import { FormTextInput } from "../FormTextInput";

import "./style.scss";

export interface EditableLabelProps {
  validate: (value: any) => boolean;
  optional: boolean;
  disableValidation?: boolean;
}
export function EditableLabel(props: FormElementProps<EditableLabelProps>) {
  const formClasses = useFormStyles();

  const { model, customProps, onChange, defaultValue, label } = props;
  const { validate, optional, disableValidation } = customProps;

  const defaultText: string = defaultValue ? defaultValue : "";

  const isValidInput =
    (validate) &&
      ((customProps && disableValidation && !disableValidation) || (customProps && disableValidation)) ? validate(defaultValue) : true;

  const [editable, setEditable] = useState(false);
  const [inputValue, setInputValue] = useState(defaultText);
  const [isInvalid, setIsInvalid] = useState(!isValidInput);

  const handleNameChange = (event: any) => {
    setEditable(true);
    if (model) {
      model.value = event.target.value;
    }
    if (onChange) {
      onChange(event.target.value);
    }
    if (
      validate &&
      ((customProps &&
        disableValidation &&
        !disableValidation) ||
        (customProps && disableValidation === undefined))
    ) {
      setIsInvalid(!validate(event.target.value));
    }
    setInputValue(event.target.value);
  };

  const handleCancelClick = (event: any) => {
    setEditable(false);
  };

  const editEnabledState = (
    <div className="editable-label-wrapper">
      <div onChange={handleNameChange}>
        <FormTextInput defaultValue={defaultText} />
      </div>
      <img
        src={deleteVariableNameSvg}
        className="delete-icon"
        onClick={handleCancelClick}
      />
    </div>
  );

  const editDisabledState = (
    <div className="edit-disable-wrapper">
      <div className="disable-edit-wrapper" onClick={handleNameChange}>
        <TextField
          className="editable-label"
          defaultValue={defaultText}
          disabled={true}
        />
      </div>
      <img
        src={editVariableNameSvg}
        onClick={handleNameChange}
      />
    </div>
  );

  const optionalLabel = (
    <div className={formClasses.labelWrapper}>
      <FormHelperText className={formClasses.inputLabelForRequired}>{label}</FormHelperText>
    </div>
  );

  const requiredLabel = (
    <div className={formClasses.labelWrapper}><FormHelperText className={formClasses.inputLabelForRequired}>{label}
    </FormHelperText>
      <FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>
    </div>
  );

  const inputTitle = customProps && optional ? optionalLabel : requiredLabel;

  const inputTitleClass = editable ? cn("edit-input-title") : cn("default-input-title");

  return (
    <div className={inputTitleClass}>
      {label && inputTitle}
      {editable && editEnabledState}
      {!editable && editDisabledState}
    </div>
  );
}
