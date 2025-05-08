/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-no-lambda
import React, { useEffect, useState } from "react";

import { Box, List, ListItem, ListItemText } from "@material-ui/core";
import { FileListEntry } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormHeaderSection } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { ModulePart, NodePosition } from "@wso2-enterprise/syntax-tree";

import { useDiagramContext } from "../../../../../Contexts/Diagram";
import { TextPreLoader } from "../../../../../PreLoader/TextPreLoader";
import { FormGeneratorProps } from "../../FormGenerator";

import { PlusOptionsSelector } from "./PlusOptionsSelector";

export function TopLevelOptionRenderer(props: FormGeneratorProps) {
    const { onCancel } = props;
    const {
        kind, targetPosition, isTriggerType, showCategorized, fileList
    } = props.configOverlayFormStatus.formArgs;

    const {
        api: {
            navigation: { updateActiveFile },
        },
        props: { currentFile, fullST },
    } = useDiagramContext();

    const [position, setPosition] = useState<NodePosition>(targetPosition);

    useEffect(() => {
        if (fullST) {
            setPosition({
                startLine: (fullST as ModulePart).eofToken.position.endLine,
                startColumn: (fullST as ModulePart).eofToken.position.endColumn,
                endLine: (fullST as ModulePart).eofToken.position.endLine,
                endColumn: (fullST as ModulePart).eofToken.position.endColumn,
            });
        }
    }, [fullST]);

    const handleFileSelect = (entry: FileListEntry) => {
        updateActiveFile(entry);
    };

    const handleGoBack = () => {
        // setShowFileList(true);
    }

    const showFileList = !currentFile.path.endsWith('.bal');

    return (
        <>
            {showFileList && (
                <>
                    <FormHeaderSection
                        onCancel={onCancel}
                        formTitle={"lowcode.develop.configForms.plusholder.selectFiles"}
                        defaultMessage={"Select a file to add a component"}
                    />
                    <List component="nav" style={{ width: 315 }}>
                        {fileList.map((file: any, index: any) => (
                            <ListItem button={true} key={index} onClick={() => handleFileSelect(file)}>
                                <ListItemText primary={file.fileName} secondary={file.uri.path} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
            {!showFileList && fullST && (
                <PlusOptionsSelector
                    kind={kind}
                    onClose={onCancel}
                    goBack={handleGoBack}
                    targetPosition={position}
                    isTriggerType={isTriggerType}
                    isLastMember={true}
                    showCategorized={showCategorized}
                />
            )}
            {!showFileList && !fullST && (
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh" width="315px">
                    <TextPreLoader position="absolute" text="Loading..." />
                </Box>
            )}
        </>
    );
}
