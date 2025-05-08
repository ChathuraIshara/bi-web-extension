/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js jsx-no-lambda no-empty
import React, { useContext, useEffect } from "react";

import { STKindChecker, STNode } from "@wso2-enterprise/syntax-tree";
import { Codicon, MultiSelect } from "@wso2-enterprise/ui-toolkit";

import { StatementEditorContext } from "../../../store/statement-editor-context";
import {
    getFilteredQualifiers,
    getQualifierPosition,
    getQualifierUpdateModelPosition,
    getSupportedQualifiers
} from "../../../utils";
import { useStatementEditorToolbarStyles } from "../../styles";

export default function StatementQualifiers() {
    const {
        modelCtx: {
            statementModel,
            updateModel,
        }
    } = useContext(StatementEditorContext);

    const statementEditorClasses = useStatementEditorToolbarStyles();

    const [supportedQualifiers, setSupportedQualifiers] = React.useState([]);
    const [checked, setChecked] = React.useState([]);


    useEffect(() => {
        const newChecked: string[] = [];
        // check if the qualifiers are checked
        if (statementModel?.visibilityQualifier) {
            newChecked.push(statementModel.visibilityQualifier.value)
        } else if (statementModel?.finalKeyword) {
            newChecked.push(statementModel.finalKeyword.value)
        }
        if (statementModel?.qualifiers) {
            statementModel.qualifiers.map((qualifier: STNode) => {
                newChecked.push(qualifier.value)
            });
        }
        let qualifierList = getSupportedQualifiers(statementModel);
        if (STKindChecker.isModuleVarDecl(statementModel)) {
            qualifierList = getFilteredQualifiers(statementModel, qualifierList, newChecked);
        }
        setSupportedQualifiers(qualifierList);
        setChecked(newChecked);
    }, [statementModel]);

    const handleCheckboxClick = (qualifier: string) => () => {
        const currentIndex = checked.indexOf(qualifier);
        if (currentIndex === -1) {
            updateModel(` ${qualifier} `, getQualifierUpdateModelPosition(statementModel, qualifier));
        } else {
            updateModel(``, getQualifierPosition(statementModel, qualifier));
        }

    }

    const onChangeValues = (currentChecked: string[]) => {
        currentChecked.map((qualifier) => {
            handleCheckboxClick(qualifier)();
        });

        if (currentChecked.length === 0) {
            // get the checked qualifier and remove them
            checked.map((qualifier) => {
                handleCheckboxClick(qualifier)();
            });
        }
    };

    const displayValue = (
        <div className={statementEditorClasses.toolbarStatementQualifier}>
            <Codicon name="globe" />
            <Codicon name="chevron-down" />
        </div>
    );

    return (
        <div style={{ display: "flex", alignItems: "center" }}>
            <MultiSelect options={supportedQualifiers} values={checked} displayValue={displayValue} onChange={onChangeValues} />
        </div>
    );
}
