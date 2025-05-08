/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js

// NOTE: This component contains three updates in the language server extension.
//      phase one - simple visibleEndpoint object ( GA Release)
//      phase two - update the visibleEndpoint object with package names and versions ( RC 1 patch)
//      phase three - update visibleEndpoint object with position and add visibleEndpoints to every blockStatement
// We need to remove these extra code blocks once VS Code plugin sync with latests changes.

import React, { ReactNode, useContext } from "react";
import { FormattedMessage } from "react-intl";

import { Box, FormControl, List, ListItem, Typography } from "@material-ui/core";
import { ModuleIcon } from "@wso2-enterprise/ballerina-low-code-diagram";
import { BallerinaConnectorInfo } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { FormHeaderSection, PrimaryButton } from "@wso2-enterprise/ballerina-low-code-edtior-ui-components";
import { STKindChecker, STNode, VisibleEndpoint } from "@wso2-enterprise/syntax-tree";

import { Context } from "../../../../../../Contexts/Diagram";
import { TextPreLoader } from "../../../../../../PreLoader/TextPreLoader";
import { FormGeneratorProps } from "../../../FormGenerator";
import { wizardStyles as useFormStyles } from "../../style";
import useStyles from "../style";
import { getConnectorFromVisibleEp, getMatchingConnector, getTargetBlock } from "../util";

export interface EndpointListProps {
    functionNode: STNode;
    onSelect: (connector: BallerinaConnectorInfo, endpointName: string, classField?: boolean) => void;
    addNewEndpoint: () => void;
}

const DEFAULT_ICON_SCALE = 0.35;
const ICON_WIDTH_SMALL = 16;

export function EndpointList(props: FormGeneratorProps) {
    const classes = useStyles();
    const formClasses = useFormStyles();
    const {
        props: {
            stSymbolInfo: { moduleEndpoints, localEndpoints },
        },
    } = useContext(Context);
    const { targetPosition, onCancel, configOverlayFormStatus } = props;
    const { isLoading, formArgs } = configOverlayFormStatus;
    const { functionNode, onSelect, addNewEndpoint } = formArgs as EndpointListProps;

    const endpointElementList: ReactNode[] = [];
    const visitedEndpoints: string[] = [];
    let isEndpointExists = false;
    let executePhaseOne = false;

    const getListComponent = (connector: BallerinaConnectorInfo, name: string, isClassField?: boolean) => {
        const handleOnSelect = () => {
            onSelect(connector, name, (isClassField ?? false));
        };
        return (
            <ListItem
                key={`endpoint-${name.toLowerCase()}`}
                data-testid={`${name.toLowerCase().replaceAll(" ", "-")}`}
                button={true}
                onClick={handleOnSelect}
                className={classes.endpointItem}
            >
                <div className={classes.iconWrapper}>
                    <ModuleIcon module={connector} scale={DEFAULT_ICON_SCALE} width={ICON_WIDTH_SMALL}/>
                </div>
                <Typography>{name}</Typography>
            </ListItem>
        );
    };

    if (
        targetPosition &&
        functionNode &&
        (STKindChecker.isFunctionDefinition(functionNode) ||
            STKindChecker.isResourceAccessorDefinition(functionNode) ||
            STKindChecker.isObjectMethodDefinition(functionNode)) &&
        STKindChecker.isFunctionBodyBlock(functionNode.functionBody)
    ) {
        const targetBlock = getTargetBlock(targetPosition, functionNode.functionBody);

        if (
            targetBlock.VisibleEndpoints &&
            targetBlock.VisibleEndpoints.length > 0 &&
            targetBlock.VisibleEndpoints[0].position
        ) {
            const blockVisibleEndpoints: VisibleEndpoint[] = targetBlock?.VisibleEndpoints;
            blockVisibleEndpoints?.forEach((endpoint) => {
                const isTopLevelEndpoint = endpoint.isModuleVar || endpoint.isClassField;
                const isAboveTarget = endpoint.position && endpoint.position.endLine < targetPosition.startLine;
                if (isTopLevelEndpoint || isAboveTarget) {
                    const connector = getConnectorFromVisibleEp(endpoint);
                    endpointElementList.push(getListComponent(connector, endpoint.name, endpoint.isClassField));
                    isEndpointExists = true;
                }
            });
        }
    }

    // INFO: this code block use to work with phase two.
    if (STKindChecker.isFunctionDefinition(functionNode) || STKindChecker.isResourceAccessorDefinition(functionNode)) {
        functionNode.functionBody.VisibleEndpoints?.forEach((endpoint) => {
            if (endpoint.position) {
                // INFO: This is a phase three visible endpoint. This endpoint has already rendered by above code section
                return;
            }
            if (!(endpoint.packageName && endpoint.version)) {
                // INFO: enable phase one. phase two need package name and version information.
                executePhaseOne = true;
                return;
            }
            if (visitedEndpoints.indexOf(endpoint.name) < 0) {
                const connector = getConnectorFromVisibleEp(endpoint);
                endpointElementList.push(getListComponent(connector, endpoint.name, endpoint.isClassField));
            }
            visitedEndpoints.push(endpoint.name);
            isEndpointExists = true;
        });
    }

    // INFO: this code block use to work with phase one.
    if (executePhaseOne) {
        const getListComponentFromNode = (node: STNode, epName: string) => {
            const connector = getMatchingConnector(node);
            if (!connector) {
                return <></>;
            }
            return getListComponent(connector, epName);
        };

        moduleEndpoints?.forEach((node, name) => {
            endpointElementList.push(getListComponentFromNode(node, name));
            isEndpointExists = true;
        });

        localEndpoints?.forEach((node, name) => {
            if (
                functionNode.position &&
                node.position &&
                targetPosition &&
                functionNode.position.startLine < node.position.startLine &&
                node.position.endLine < targetPosition.startLine
            ) {
                endpointElementList.push(getListComponentFromNode(node, name));
                isEndpointExists = true;
            }
        });
    }

    return (
        <FormControl data-testid="endpoint-list-form" className={formClasses.wizardFormControl}>
            <FormHeaderSection
                onCancel={onCancel}
                formTitle={"lowcode.develop.configForms.endpointList.title"}
                defaultMessage={"Action"}
            />
            <div className={formClasses.formWrapper}>
                <div className={formClasses.formFeilds}>
                    <div className={classes.container}>
                        {isLoading && (
                            <Box display="flex" justifyContent="center">
                                <TextPreLoader position="absolute" text="Fetching endpoints..." />
                            </Box>
                        )}
                        {!isLoading && !isEndpointExists && (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                height="80vh"
                            >
                                <Typography className={classes.subTitle}>
                                    <FormattedMessage
                                        id="lowcode.develop.configForms.endpoint.empty"
                                        defaultMessage="No existing connectors found"
                                    />
                                </Typography>
                                <Box marginY={2}>
                                    <PrimaryButton text="Add Connector" fullWidth={false} onClick={addNewEndpoint} />
                                </Box>
                            </Box>
                        )}
                        {!isLoading && isEndpointExists && (
                            <>
                                <Typography>
                                    <FormattedMessage
                                        id="lowcode.develop.configForms.endpointList.subtitle"
                                        defaultMessage="Select an existing connector endpoint"
                                    />
                                </Typography>
                                <List>{endpointElementList}</List>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </FormControl>
    );
}
