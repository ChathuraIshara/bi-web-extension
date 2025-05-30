/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React, { useState } from "react";

import { TypeField } from "@wso2-enterprise/ballerina-core";
import { Button } from "@wso2-enterprise/ui-toolkit";


import { useHelperPaneStyles } from "./styles";
import { isAnyFieldSelected, isRequiredParam } from "./utils";

import * as Types from "./Types";

export interface ParameterBranchProps {
    parameters: TypeField[];
    depth: number;
    onChange: () => void;
}

export interface TypeProps {
    param: TypeField;
    depth: number;
    onChange: () => void;
}

export function ParameterBranch(props: ParameterBranchProps) {
    const { parameters, depth, onChange } = props;
    const helperStyleClass = useHelperPaneStyles();

    const [showOptionalParams, setShowOptionalParams] = useState(isAnyFieldSelected(parameters));

    const requiredParams: JSX.Element[] = [];
    const optionalParams: JSX.Element[] = [];

    parameters?.forEach((param: TypeField, index: number) => {
        let TypeComponent = (Types as any)[param.typeName];
        const typeProps: TypeProps = {
            param,
            depth,
            onChange,
        };
        if (!TypeComponent) {
            TypeComponent = (Types as any).custom;
        }
        if (isRequiredParam(param)) {
            requiredParams.push(<TypeComponent key={index} {...typeProps} />);
        } else {
            optionalParams.push(<TypeComponent key={index} {...typeProps} />);
        }
    });

    function toggleOptionalParams(e: any) {
        setShowOptionalParams(!showOptionalParams);
    }

    return (
        <div data-testid="parameter-branch">
            {requiredParams}
            {(optionalParams.length > 0 && depth === 1) ? (
                optionalParams
            ) : (
                <>
                    {optionalParams.length > 0 && (
                        <div className={helperStyleClass.listOptionalWrapper}>
                            <div className={helperStyleClass.listOptionalHeader}>Optional fields </div>
                            <Button
                                data-testid="optional-toggle-button"
                                className={helperStyleClass.listOptionalBtn}
                                onClick={toggleOptionalParams}
                                appearance="secondary"
                            >
                                {showOptionalParams ? "Hide" : "Show"}
                            </Button>
                        </div>
                    )}
                    {showOptionalParams && optionalParams.length > 0 && optionalParams}
                </>
            )}
        </div>
    );
}

export const MemoizedParameterBranch = React.memo(ParameterBranch);
