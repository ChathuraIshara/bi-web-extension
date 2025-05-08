/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { Typography } from '@wso2-enterprise/ui-toolkit';
import styled from "@emotion/styled";
import { Parameter as P, ReferenceObject as R } from '../../../Definitions/ServiceDefinitions';
import { ReadOnlyParameter } from '../Parameter/ReadOnlyParameter';
import { ReadOnlyReferenceObject } from '../ReferenceObject/ReadOnlyReferenceObject';
import { useContext } from 'react';
import { APIDesignerContext } from '../../../APIDesignerContext';
import { VSCodeDataGrid } from '@vscode/webview-ui-toolkit/react';
import { ParameterGridCell, ParamGridRow } from './Parameters';

interface ReadOnlyParameterProps {
    parameters: (P | R)[];
    paramTypes?: string[];
    currentReferences?: R[];
    title?: string;
    type: "query" | "header" | "path" | "cookie";
}
export const ContentTypeWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`;

function isReferenceObject(obj: (P | R)): obj is R {
    return obj && typeof obj === 'object' && '$ref' in obj;
}

export function ReadOnlyParameters(props: ReadOnlyParameterProps) {
    const { parameters, title, type } = props;
    const {
        props: { openAPI },
    } = useContext(APIDesignerContext);

    const paramsToGivenType = parameters?.filter((param) => {
        if (isReferenceObject(param)) {
            const paramName = param.$ref.replace("#/components/parameters/", "");
            const parameterType = openAPI?.components?.parameters[paramName].in;
            return parameterType === type;
        } else {
            return param.in === type;
        }
    });

    return (
        <>
            <Typography sx={{ margin: 0 }} variant='h4'> {title} </Typography>
            {paramsToGivenType?.length > 0 ? (
                <VSCodeDataGrid>
                <ParamGridRow row-type="header">
                    <ParameterGridCell key="name" cell-type="columnheader" grid-column={`1`}>
                        Name
                    </ParameterGridCell>
                    <ParameterGridCell key="type" cell-type="columnheader" grid-column={`2`}>
                        Type
                    </ParameterGridCell>
                    <ParameterGridCell key="description" cell-type="columnheader" grid-column={`3`}>
                        Description
                    </ParameterGridCell>
                </ParamGridRow>
                {parameters?.map((parameter) => {
                    if (type === parameter.in || isReferenceObject(parameter)) {
                        if (isReferenceObject(parameter)) {
                            const paramName = parameter.$ref.replace("#/components/parameters/", "");
                            const parameterType = openAPI?.components?.parameters[paramName].in;
                            return (
                                <>
                                    {parameterType === type && <ReadOnlyReferenceObject referenceObject={parameter as R} type={type} />}
                                </>
                            );
                        } else {
                            return (
                                <>
                                    {parameter.in === type && <ReadOnlyParameter parameter={parameter as P} />}
                                </>
                            );
                        }
                    }
                })}
            </VSCodeDataGrid>
            ) : (
                <Typography sx={{ margin: 0, fontWeight: "lighter" }} variant='body3'>No {title}.</Typography>
            )}
        </>
    )
}
