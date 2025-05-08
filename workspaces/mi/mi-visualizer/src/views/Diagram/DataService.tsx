/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from "react";
import { Diagnostic } from "vscode-languageserver-types";
import { Query } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import { Diagram } from "@wso2-enterprise/mi-diagram";
import { View, ViewContent, ViewHeader } from "../../components/View";


export interface DataServiceViewProps {
    model: any;
    href: string;
    documentUri: string;
    diagnostics: Diagnostic[];
}

export const DataServiceView = (props: DataServiceViewProps) => {

    const model = props.model?.data?.queries?.find((query: any) => query.id === props.href) as Query;
    const [isFormOpen, setFormOpen] = React.useState(false);

    const ResourceTitle = (
        <React.Fragment>
            <span>Query:</span>
            <span>{model?.id}</span>
        </React.Fragment>
    )

    return (
        <View>
            <ViewHeader title={ResourceTitle}>
            </ViewHeader>
            <ViewContent>
                <Diagram
                    model={model}
                    documentUri={props.documentUri}
                    diagnostics={props.diagnostics}
                    isFormOpen={isFormOpen}
                />
            </ViewContent>
        </View>
    )
}

