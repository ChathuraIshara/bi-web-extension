/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import React from "react";
import { useIntl } from "react-intl";

import { Button } from "@material-ui/core";
import { default as AddIcon } from "@material-ui/icons/Add";
import { FileUploadIcon } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormHeaderSection, LinePrimaryButton } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";

import { wizardStyles } from "../../style";
import { recordStyles } from "../style";

export interface RecordConfigTypeProps {
    isDataMapper?: boolean;
    onImportFromJson: () => void;
    onImportFromXml: () => void;
    onCreateNew: () => void;
    onCancel: () => void;
}

export function RecordConfigTypeSelector(props: RecordConfigTypeProps) {
    const { isDataMapper, onImportFromJson, onImportFromXml, onCreateNew, onCancel } = props;

    const overlayClasses = wizardStyles();
    const recordClasses = recordStyles();
    const intl = useIntl();

    const createNewButtonText = intl.formatMessage({
        id: "lowcode.develop.configForms.recordEditor.option.createNew",
        defaultMessage: "Create New",
    });
    const importJsonButtonText = intl.formatMessage({
        id: "lowcode.develop.configForms.recordEditor.option.importJson",
        defaultMessage: "Import a JSON",
    });
    const importXmlButtonText = intl.formatMessage({
        id: "lowcode.develop.configForms.recordEditor.option.importXml",
        defaultMessage: "Import an XML",
    });

    return (
        <>
            {!isDataMapper && (
                <FormHeaderSection
                    formTitle={"lowcode.develop.configForms.recordEditor.codePanel.title"}
                    defaultMessage={"Record"}
                    onCancel={onCancel}
                />
            )}
            <div className={overlayClasses.recordFormWrapper}>
                <div className={recordClasses.createButtonWrapper}>
                    <LinePrimaryButton
                        text={createNewButtonText}
                        fullWidth={true}
                        onClick={onCreateNew}
                        dataTestId="create-new-btn"
                        startIcon={<AddIcon />}
                    />

                    <LinePrimaryButton
                        text={importJsonButtonText}
                        fullWidth={true}
                        onClick={onImportFromJson}
                        dataTestId="import-json"
                        startIcon={<FileUploadIcon />}
                    />

                    <LinePrimaryButton
                        text={importXmlButtonText}
                        fullWidth={true}
                        onClick={onImportFromXml}
                        dataTestId="import-xml"
                        disabled={onImportFromXml === null}
                        startIcon={<FileUploadIcon />}
                    />
                    {onImportFromXml === null && <p className={recordClasses.ballerinLabel}>To enable XML import, update the Ballerina version to 2201.7.2 or later.</p>}
                </div>
            </div>
        </>
    );
}
