/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import CardWrapper from "./CardWrapper";
import Endpoint from "./Endpoint";
import EndpointList from "./EndpointList";
import InlineButtonGroup from "./InlineButtonGroup";
import ParamField from "./ParamField";
import PropertiesTable from "./PropertiesTable";
import { Button, Codicon, Badge } from "@wso2-enterprise/ui-toolkit";

export const SectionWrapper: any = styled.div`
    // Flex Props
    display: flex;
    height: 65vh;
    flex-direction: column;
    justify-content: flex-start;
    position: relative;
    gap: 30px;
    margin: auto 0;
    min-width: 350px;
    // End Flex Props
    // Sizing Props
    padding: 40px 120px;
    // End Sizing Props
    // Border Props
    border-radius: 10px;
    border-style: solid;
    border-width: 1px;
    border-color: transparent;
    overflow: auto;
    &.active {
        border-color: var(--vscode-focusBorder);
    }
`;

export const FieldGroup: any = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export { CardWrapper, Endpoint, EndpointList, InlineButtonGroup, ParamField, PropertiesTable };

const ButtonWrapper: any = styled.div({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
});
const TitleWrapper: any = styled.div({
    marginLeft: 10,
    whiteSpace: 'nowrap',
    width: '100%'
});
const BadgeWrapper: any = styled.div({
    display: "flex",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
});
type TypeChipProps = { 
    type: string,
    onClick: (type: string) => void, 
    showButton: boolean,
    title?: string, 
    id?: string
};
export function TypeChip(props: TypeChipProps) {
    return (
        <ButtonWrapper>
            <BadgeWrapper>
                <span>{props.id ?? "Type:"}</span>
                <Badge color="#4d4d4d" sx={{
                    color: "#fff",
                    padding: 5,
                    borderRadius: 5,
                }}>
                    {props.type ?? 'HTTP'}
                </Badge>
            </BadgeWrapper>
            {props.showButton && <Button
                appearance="secondary"
                onClick={() => props.onClick("")}
                sx={{ display: "flex", gap: 10 }}
            >
                <Codicon iconSx={{ fontWeight: "bold", fontSize: 15 }} name='arrow-left' />
                <TitleWrapper>{props.title ?? "Change Type"}</TitleWrapper>
            </Button>}
        </ButtonWrapper>
    )
}
