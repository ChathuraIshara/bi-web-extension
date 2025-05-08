/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

import { Button } from "@material-ui/core";
import { FileUploadIcon } from "@wso2-enterprise/ballerina-low-code-edtior-commons";

import "../../style.scss";
import { useStyles } from "../FormComponents/DynamicConnectorForm/style";

export interface FileSelectorProps {
    label: string;
    extension: 'json' | 'yaml' | 'xml'; // TODO: support for yaml js-yaml library
    onReadFile: (text: string) => void;
}

export function FileSelector(props: FileSelectorProps) {
    const classes = useStyles();

    const { extension, label, onReadFile } = props;

    const hiddenFileInput = React.useRef(null);

    const handleClick = (event?: any) => {
        hiddenFileInput.current.click();
    };

    const showFile = async (e: any) => {
        e.preventDefault()
        const reader = new FileReader()
        const ext = e.target.files[0].name.split('.').pop().toLowerCase();
        reader.readAsText(e.target.files[0]);
        reader.onload = async (loadEvent: any) => {
            if (ext === extension) {
                const text = (loadEvent.target.result) as string;
                onReadFile(text);
            }
          };
    }

    return (
        <div>
            <input
                hidden={true}
                accept={`.${extension}`}
                type="file"
                onChange={showFile}
                ref={hiddenFileInput}
            />
            <Button
                onClick={handleClick}
                variant="text"
                startIcon={<FileUploadIcon />}
                className={classes.jsonUpload}
            >
                {`Upload ${extension.toUpperCase()} File`}
            </Button>
        </div>
    )

}
