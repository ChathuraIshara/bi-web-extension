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
import { Template } from "@wso2-enterprise/mi-syntax-tree/lib/src";
import { Diagram } from "@wso2-enterprise/mi-diagram";
import { View, ViewContent, ViewHeader } from "../../components/View";
import { TemplateWizard } from "../Forms/TemplateForm";

export interface SequenceViewProps {
    model: Template;
    documentUri: string;
    diagnostics: Diagnostic[];
}

export const SequenceTemplateView = ({ model: SequenceModel, documentUri, diagnostics }: SequenceViewProps) => {
    const model = SequenceModel as Template;
    // const data = generateSequenceData(model) as EditSequenceFields
    const [isFormOpen, setFormOpen] = React.useState(false);

    const handleEditSequence = () => {
        setFormOpen(true);
    }

    return (
        <View>
            {isFormOpen ?
                <TemplateWizard
                    path={documentUri}
                    type="Sequence Template"
                    onCancel={() => setFormOpen(false)}
                    model={model}
                /> :
                <>
                    <ViewHeader title={`Sequence: ${model.name}`} icon="sequence-template" onEdit={handleEditSequence} />
                    <ViewContent>
                        <Diagram
                            model={model}
                            documentUri={documentUri}
                            diagnostics={diagnostics}
                            isFormOpen={isFormOpen}
                        />
                    </ViewContent>
                </>
            }
        </View>
    )
}

