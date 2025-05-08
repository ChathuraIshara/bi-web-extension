/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
// tslint:disable: jsx-no-lambda
// tslint:disable: no-unused-expression
import React, { ReactNode, SyntheticEvent, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { FormHelperText, TextField } from "@material-ui/core";
import { AddRounded, CloseRounded } from "@material-ui/icons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ButtonWithIcon, IconBtnWithText } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import classNames from "classnames";

import { useStyles } from "../../../DynamicConnectorForm/style";
import { SwitchToggle } from "../../../FormFieldComponents/SwitchToggle";
import '../style.scss'

import { useStyles as headerStyles } from "./style";

export interface HeaderObjectConfig {
    requestName?: string;
    objectKey: string;
    objectValue: string;
}
export interface HeaderConfig {
    headerObject: HeaderObjectConfig[];
}

export function HTTPHeaders(props: HeaderConfig) {
    const { headerObject } = props;
    const classes = useStyles();
    const headerClasses = headerStyles();
    const intl = useIntl();

    const [headerLength, setHeaderLength] = useState(headerObject.length);
    const [isHeaderChecked, setHeaderChecked] = useState(headerObject.length > 0);

    const [objectKey, setObjectKey] = React.useState("");
    const [objectValue, setObjectValue] = React.useState("");

    const [isInvalid, setIsInvalid] = useState(true);


    const handleKeyChange = (value: string) => {
        setObjectKey(value);
        if (value !== "" && value !== null && objectValue) {
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
        }
    };

    const handleValueChange = (value: string) => {
        setObjectValue(value);
        if (objectKey && value !== null && value !== "") {
            setIsInvalid(false);
        } else {
            setIsInvalid(true);
        }
    };

    const addValue = () => {
        const header: HeaderObjectConfig = {
            objectKey,
            objectValue
        }
        if (objectKey !== "" && objectValue !== "") {
            headerObject.push(header);
        }
        setObjectKey("");
        setObjectValue("");
    }

    const handleKeyOnChange = (event: any) => {
        handleKeyChange(event.target.value);
    }

    const handleValueOnChange = (event: any) => {
        handleValueChange(event.target.value);
    }

    const deleteItem = (index: number) => {
        if (headerObject && headerObject.length > 0) {
            headerObject.splice(index, 1);
            setHeaderLength(headerLength - 1);
        }
    };

    const headerValues: ReactNode[] = [];
    headerObject.map((element, index) => {
        const getDelete = () => {
            return () => deleteItem(index);
        };
        headerValues.push(
            <div key={index} className={classes.headerWrapper}>
                <div className={classes.headerLabel}>
                    {element.objectKey} : {element.objectValue}

                    <ButtonWithIcon
                        className={classes.deleteBtn}
                        onClick={getDelete()}
                        icon={<CloseRounded fontSize="small" />}
                    />
                </div>
            </div>
        )
    });

    const handleSwictToggleChange = () => {
        headerObject.splice(0, headerObject.length);
        setHeaderChecked((prev) => !prev);
    };

    const preventDiagramScrolling = (e: SyntheticEvent) => {
        e.stopPropagation();
    };

    const headerNameExamplePlaceholder = intl.formatMessage({
        id: "lowcode.develop.configForms.HTTP.headers.name.example.placeholder",
        defaultMessage: "eg: Content-Type"
    });

    const headerValueExamplePlaceholder = intl.formatMessage({
        id: "lowcode.develop.configForms.HTTP.headers.value.example.placeholder",
        defaultMessage: "eg: application/json"
    });

    const addHeaderText = intl.formatMessage({
        id: "lowcode.develop.configForms.HTTP.headers.addHeader.text",
        defaultMessage: "Add Header"
    });

    const headerComponent = (
        <div className={classNames(classes.groupedForm, classes.marginTB)}>
            <FormHelperText className={classes.inputLabelForRequired}><FormattedMessage id="lowcode.develop.connectorForms.HTTP.headers.name" defaultMessage="Header Name"/></FormHelperText>
            <FormHelperText className={classes.starLabelForRequired}>*</FormHelperText>
            <div
                onWheel={preventDiagramScrolling}
            >
                <Autocomplete
                    className={headerClasses.autocompleteDropdown}
                    options={httpHeaderKeys}
                    freeSolo={true}
                    clearOnBlur={false}
                    closeIcon={false}
                    openOnFocus={true}
                    inputValue={objectKey}
                    onChange={(e: React.ChangeEvent<{}>, value: string) => {
                        handleKeyChange(value)
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            className={headerClasses.outline}
                            defaultValue={objectKey}
                            placeholder={headerNameExamplePlaceholder}
                            onChange={handleKeyOnChange}
                        />
                    )}
                />
            </div>

            <FormHelperText className={classes.inputLabelForRequired}><FormattedMessage id="lowcode.develop.connectorForms.HTTP.headers.value" defaultMessage="Header Value"/></FormHelperText>
            <FormHelperText className={classes.starLabelForRequired}>*</FormHelperText>
            <div
                onWheel={preventDiagramScrolling}
            >
                <Autocomplete
                    className={headerClasses.autocompleteDropdown}
                    options={httpHeaderValues}
                    freeSolo={true}
                    clearOnBlur={false}
                    closeIcon={false}
                    openOnFocus={true}
                    inputValue={objectValue}
                    onChange={(e: React.ChangeEvent<{}>, value: string) => {
                        handleValueChange(value);
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            className={headerClasses.outline}
                            defaultValue={objectValue}
                            placeholder={headerValueExamplePlaceholder}
                            onChange={handleValueOnChange}
                        />
                    )}
                />
            </div>
            <div className={classes.addWrapperBtn} data-testid="add-btn">
                <IconBtnWithText
                    onClick={addValue}
                    text={addHeaderText}
                    icon={<AddRounded fontSize="small" className={classes.iconButton} />}
                    disabled={isInvalid}
                />
            </div>
            {headerValues}
        </div>
    );
    return (
        <div>
            <div>
                <SwitchToggle text="Http Headers" onChange={handleSwictToggleChange} initSwitch={headerObject.length > 0} />
            </div>
            {isHeaderChecked && headerComponent}
        </div>
    );
}

export const httpHeaderKeys = [ "Accept",
    "Accept-Charset",
    "Accept-Datetime",
    "Accept-Encoding",
    "Accept-Language",
    "Access-Control-Request-Method",
    "Access-Control-Request-Headers",
    "Authorization",
    "Cache-Control",
    "Connection",
    "Permanent",
    "Content-Encoding",
    "Content-Length",
    "Content-MD5",
    "Content-Type",
    "Cookie",
    "Date",
    "Expect",
    "Forwarded",
    "From",
    "Host",
];

export const httpHeaderValues = [
    "audio/aac",
    "application/x-abiword",
    "application/x-freearc",
    "video/x-msvideo",
    "application/vnd.amazon.ebook",
    "application/octet-stream",
    "image/bmp",
    "application/x-bzip",
    "application/x-bzip2",
    "application/x-csh",
    "text/css",
    "text/csv",
    "application/msword",
    "application/epub+zip",
    "application/gzip",
    "image/gif",
    "text/html",
    "text/calendar",
    "application/java-archive",
    "image/jpeg",
    "text/javascript",
    "application/json",
    "application/ld+json",
    "audio/mpeg",
    "video/mpeg",
    "image/png",
    "application/pdf",
    "image/svg+xml",
    "application/x-shockwave-flash",
    "application/x-tar",
    "image/tiff",
    "font/ttf",
    "text/plain",
    "font/woff",
    "font/woff2",
    "application/xml",
    "text/xml",
];
