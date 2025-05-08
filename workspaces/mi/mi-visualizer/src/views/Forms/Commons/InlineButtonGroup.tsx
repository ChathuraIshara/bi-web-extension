/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import styled from "@emotion/styled";
import { Button } from "@wso2-enterprise/ui-toolkit";

const Container = styled.div({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
});

const ButtonContainer = styled.div({
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10
});

const InlineButtonGroup = ({ label, isHide, onShowHideToggle, addNewFunction, required }: any) => {
    return (
        <Container>
            <b>{label}{required && <span style={{ color: "red" }}>*</span>}</b>
            <ButtonContainer>
                <Button
                    appearance="secondary"
                    onClick={onShowHideToggle}
                >
                    {isHide ? `Hide ${label}` : `Show ${label}`}
                </Button>
                <Button
                    appearance="primary"
                    onClick={addNewFunction}
                >
                    {`Add new ${label.slice(0, label.length - 1)}`}
                </Button>
            </ButtonContainer>
        </Container>
    )
}

export default InlineButtonGroup;
