/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React, { SyntheticEvent } from "react";
import { FormattedMessage } from "react-intl";

import { FormHelperText, MenuItem, Select } from "@material-ui/core";
import { default as AddIcon } from "@material-ui/icons/Add";
import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import classNames from "classnames";

import { dynamicConnectorStyles as useFormStyles } from "../../dynamicConnectorStyles";
import { useStyles as useTextInputStyles } from "../style";

export interface SelectDropdownProps {
    values?: string[];
    enabledValues?: string[];
    disableCreateNew?: boolean;
    optional?: boolean;
    className?: string;
    clearSelection?: boolean;
    onOpenSelect?: () => void;
    onCloseSelect?: () => void;
    tooltipTitle?: any;
    tooltipActionText?: string;
    tooltipActionLink?: string;
    interactive?: boolean;
    autoFocus?: boolean;
}

export function SelectDropdownWithButton(props: FormElementProps<SelectDropdownProps>) {
    const formClasses = useFormStyles();
    const dropDownClasses = useTextInputStyles();
    const textFieldClasses = useTextInputStyles();
    const {
        onChange, onClick, defaultValue, label, hideLabel, placeholder, customProps = {}, disabled, dataTestId = ''
    } = props;
    const {
        autoFocus, values, disableCreateNew, optional, className, enabledValues, clearSelection, onOpenSelect, onCloseSelect
    } = customProps;

    const handleChange = (event: any) => {
        if (onChange && (optional || event.target.value)) {
            onChange(event.target.value);
        }
    };

    const enabled = enabledValues ? enabledValues : values;

    const menuItems: React.ReactNode[] = [];
    if (values) {
        const items: string[] = values;
        items.forEach((value) => {
            menuItems.push(
                <MenuItem disabled={!enabled?.includes(value)} key={value} value={value} className={`product-tour-payload-${value.toLowerCase()}`} data-testid={`connector-payload-${value.toLowerCase()}`}>
                    <span className="TextSpan">{value}</span>
                </MenuItem>
            );
        });
    }

    if (clearSelection) {
        customProps.clearSelection = false;
    }

    const preventDiagramScrolling = (e: SyntheticEvent) => {
        e.stopPropagation();
    }

    const EmptyChevronIcon = () => <span />;

    return (
        <div data-testid="select-drop-down" data-field-name={dataTestId}>
            {label && !hideLabel ?
                (customProps && optional ?
                    (
                        <div className={textFieldClasses.selectOperationTextWrapper}>
                            <div className={formClasses.labelWrapper}>
                                <FormHelperText className={formClasses.inputLabelForRequired}>{label}</FormHelperText>
                                <FormHelperText className={formClasses.optionalLabel}><FormattedMessage id="lowcode.develop.elements.dropDown.selectDropDownWithButton.optional.label" defaultMessage="Optional" /></FormHelperText>
                            </div>
                        </div>
                    ) : (
                        <div className={textFieldClasses.selectOperationTextWrapper}>
                            <div className={formClasses.labelWrapper}>
                                <FormHelperText className={formClasses.inputLabelForRequired}>{label}</FormHelperText>
                                <FormHelperText className={formClasses.starLabelForRequired}>*</FormHelperText>
                            </div>
                        </div>
                    )
                ) : null
            }

            <Select
                data-testid={placeholder + values[0]}
                value={defaultValue}
                autoFocus={autoFocus}
                disableUnderline={true}
                onChange={handleChange}
                onOpen={onOpenSelect}
                onWheel={preventDiagramScrolling}
                onClose={onCloseSelect}
                displayEmpty={true}
                disabled={!(values?.length > 0) || disabled}
                className={classNames(dropDownClasses.selectDropDownSm, className)}
                inputProps={{ 'aria-label': 'Without label' }}
                MenuProps={{
                    getContentAnchorEl: null,
                    classes: { paper: dropDownClasses.dropdownStyle },
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                    },
                    disableScrollLock: true
                }}
                IconComponent={disabled ? EmptyChevronIcon : undefined}
            >
                {
                    values?.length > 0 ? (
                        <MenuItem value="" disabled={!optional}>
                            <span className="TextSpan">{placeholder ? placeholder : "Select"}</span>
                        </MenuItem>
                    ) : (
                        <MenuItem value="" disabled={true}>
                            <span className="TextSpan"><FormattedMessage id="lowcode.develop.elements.dropDown.selectDropDownWithButton.menuItem.noItems.text" defaultMessage="No items to select" /></span>
                        </MenuItem>
                    )
                }
                {menuItems}
                {!disableCreateNew
                    &&
                    (
                        <MenuItem value="Create New">
                            {defaultValue === "Create New" ? null : <AddIcon />}
                            <span className="TextSpan">Create New</span>
                        </MenuItem>
                    )
                }
            </Select>
        </div>
    );
}
