/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect, useState } from "react";
import { NodePosition } from "@wso2-enterprise/syntax-tree";
import { Typography, Codicon } from '@wso2-enterprise/ui-toolkit';
import styled from '@emotion/styled';
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { Resource, Service } from "../../utils/definitions";
import ResourceAccordion from "../ResourceAccordion/ResourceAccordion";

interface ServiceDesignerProps {
    // Model of the service.
    model?: Service;
    // Callback to send the position of the resource to navigate to code
    goToSource?: (resource: Resource) => void;
    // Callback to add a new resource
    onResourceAdd?: () => void;
    // Callback to send the Resource back to the parent component
    onResourceDelete?: (resource: Resource, position?: NodePosition) => void;
    // Callback to send the resource back to the parent component
    onResourceEdit?: (resource: Resource) => void;
    // Callback to send the service back to the parent component
    onServiceEdit?: (service: Service) => void;
    // Callback to send the resource back for implementing
    onResourceImplement?: (resource: Resource) => void;
    // Callback to send the resource back upon clicking on it
    onResourceClick?: (resource: Resource) => void;
    // Disable service header
    disableServiceHeader?: boolean;
    customTitle?: string;
    customEmptyResourceMessage?: string;
}

const defaultService: Service = {
    path: "",
    port: 0,
    resources: []
}

const ServiceHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 40;
    width: 100%;
    box-shadow: inset 0 -1px 0 0 var(--vscode-foreground);
    align-items: center;
`;

const ResourceListHeader = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 40;
    width: 100%;
    align-items: center;
`;

export function ServiceView(props: ServiceDesignerProps) {

    const emptyView = (
        <Typography variant="h3" sx={{ textAlign: "center" }}>
            {props.customEmptyResourceMessage ?? "No resources found. Add a new resource."}
        </Typography>
    );

    const {
        model = defaultService,
        goToSource, onResourceAdd,
        onResourceEdit,
        onResourceDelete,
        onServiceEdit,
        onResourceImplement,
        onResourceClick,
        disableServiceHeader = false
    } = props;
    const [resources, setResources] = useState<JSX.Element[]>([]);

    const handleServiceEdit = () => {
        if (onServiceEdit) {
            onServiceEdit(model);
        }
    };

    useEffect(() => {
        const resourceList: JSX.Element[] = [];
        const fetchResources = async () => {
            model.resources.forEach((resource, i) => {
                resourceList.push(
                    <ResourceAccordion
                        key={i}
                        resource={resource}
                        onEditResource={onResourceEdit && onResourceEdit}
                        onDeleteResource={onResourceDelete && onResourceDelete}
                        goToSource={goToSource}
                        onResourceImplement={onResourceImplement}
                        onResourceClick={onResourceClick}
                    />
                );
            });
            setResources(resourceList);
        };
        fetchResources();
    }, [model]);

    return (
        <div data-testid="service-design-view">
            {!disableServiceHeader && (
                <ServiceHeader>
                    <Typography sx={{ marginBlockEnd: 10 }} variant="h3">Service {model.path} </Typography>
                    {model.port && <Typography sx={{ marginBlockEnd: 10 }} variant="h4">Listening {model.port}</Typography>}
                    {onServiceEdit && (
                        <VSCodeButton appearance="icon" title="Edit Service" onClick={handleServiceEdit}>
                            <Codicon name="settings-gear" />
                        </VSCodeButton>
                    )}
                </ServiceHeader>
            )}
            <ResourceListHeader>
                <Typography sx={{ marginBlockEnd: 10 }} variant="h3">{props.customTitle ?? "Available resources"}</Typography>
                {onResourceAdd && (
                    <VSCodeButton appearance="primary" title="Edit Service" onClick={onResourceAdd}>
                        <Codicon name="add" sx={{ marginRight: 5 }} /> Resource
                    </VSCodeButton>
                )}
            </ResourceListHeader>
            <>
                {resources?.length > 0 ? resources : emptyView}
            </>
        </div>
    )
}
