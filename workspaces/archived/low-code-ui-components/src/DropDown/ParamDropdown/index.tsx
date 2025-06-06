/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { FormElementProps } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import classNames from "classnames";

import { SelectDropdownProps, TooltipIcon } from "../..";
import { dynamicConnectorStyles as useFormStyles } from "../../dynamicConnectorStyles";
import { ParamIcons } from "../../ParamEditor/ParamIcon";
import { useStyles as useTextInputStyles } from "../style";

export function ParamDropDown(props: FormElementProps<SelectDropdownProps>) {
    const formClasses = useFormStyles();
    const dropDownClasses = useTextInputStyles();
    const textFieldClasses = useTextInputStyles();
    const { onChange, onClick, defaultValue, label, hideLabel, placeholder, customProps = {}, disabled } = props;
    const { values, optional, className, enabledValues,
            clearSelection, onOpenSelect, onCloseSelect } = customProps;

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
                <MenuItem
                    disabled={!enabled?.includes(value)}
                    key={value}
                    value={value}
                    data-testid={`connector-payload-${value.toLowerCase()}`}
                >
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

    const renderValue = (value: any) => {
        const icon = (<ParamIcons type={value} />);
        return (
            <div className={dropDownClasses.renderValueWrapper}>
                <div className={dropDownClasses.itemWrapper}>
                    <div className={dropDownClasses.iconWrapper}>
                        {icon}
                    </div>
                    <div className={dropDownClasses.iconTextWrapper}>
                        {value}
                    </div>
                </div>
            </div>
        );
    }

    const EmptyChevronIcon = () => <span />;

    return (
        <div data-testid="select-drop-down" data-field-name={label}>
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
                disableUnderline={true}
                onChange={handleChange}
                onOpen={onOpenSelect}
                onWheel={preventDiagramScrolling}
                onClose={onCloseSelect}
                displayEmpty={true}
                disabled={!(values?.length > 0) || disabled}
                className={classNames(dropDownClasses.paramDropDown, className)}
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
                    values?.length === 0 && (
                        <MenuItem value="" disabled={true}>
                            <span className="TextSpan"><FormattedMessage id="lowcode.develop.elements.dropDown.selectDropDownWithButton.menuItem.noItems.text" defaultMessage="No items to select" /></span>
                        </MenuItem>
                    )
                }
                {menuItems}
            </Select>
        </div>
    );
}
