/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import styled from "@emotion/styled";
import { Typography, ThemeColors } from "@wso2-enterprise/ui-toolkit";

export const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    flex-direction: column;
`;

export const Container = styled.div({
    display: "flex",
    flexDirection: "column",
    gap: 10,
});

export const AddPanel = styled.div({
    position: "relative", // Add this line to position the close button absolutely
    display: "flex",
    flexDirection: "column",
    gap: 32,
    padding: 16,
});

export const PanelViewMore = styled.div<{ disabled?: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 10px;
    opacity: ${(props: { disabled: boolean }) => (props.disabled ? 0.5 : 1)};
    pointer-events: ${(props: { disabled: boolean }) => (props.disabled ? "none" : "auto")};
`;

export const CardGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 12px;
    width: 100%;
`;

export const Title = styled(Typography)`
    margin: 4px 0;
    font-size: 16px;
`;

export const Card = styled.div`
    border: 2px solid ${(props: { active: boolean }) => (props.active ? ThemeColors.PRIMARY : ThemeColors.OUTLINE_VARIANT)};
    background-color: ${(props: { active: boolean }) => (props.active ? ThemeColors.PRIMARY_CONTAINER : ThemeColors.SURFACE_DIM)};
    cursor: pointer;
    &:hover {
        background-color: ${ThemeColors.PRIMARY_CONTAINER};
        border: 2px solid ${ThemeColors.PRIMARY};
    }
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    max-width: 42rem;
    padding: 16px;
    border-radius: 4px;
    cursor: pointer;
`;

export const TitleWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;
