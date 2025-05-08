/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";

import { Button, Icon } from "@wso2-enterprise/ui-toolkit";
import { css } from "@emotion/css";

import { ImportType } from "./ImportDataForm";

const useStyles = () => ({
    importButton: css({
        "& > vscode-button": {
            width: "100%",
            height: "30px",
            margin: "10px 0px"
        }
    }),
});

const importTypes: ImportType[] = [
    { type: "JSON", label: "JSON" },
    { type: "JSONSCHEMA", label: "JSON Schema" },
    { type: "XML", label: "XML" },
    { type: "CSV", label: "CSV" }
];

interface ImportDataButtonsProps {
    onImportTypeChange: (importType: ImportType) => void;
}

export function ImportDataButtons(props: ImportDataButtonsProps) {
    const { onImportTypeChange } = props;
    const classes = useStyles();

    const handleImportTypeChange = (importType: ImportType) => {
        onImportTypeChange(importType);
    };

    const createImportButton = (importType: ImportType) => (
        <Button
            key={importType.type}
            appearance="primary"
            onClick={() => handleImportTypeChange(importType)}
            disabled={false}
            className={classes.importButton}
            sx={{ width: "100%" }}
        >
            <Icon
                sx={{ height: "18px", width: "18px", marginRight: "4px" }}
                iconSx={{ fontSize: "18px" }}
                name="import"
            />
            Import from {importType.label}
        </Button>
    );

    return (
        <>
            {importTypes.map(importType => createImportButton(importType))}
        </>
    );
}
