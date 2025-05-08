/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { MarkDownEditor } from "./MarkDownEditor";
import styled from "@emotion/styled";

export default {
    component: MarkDownEditor,
    title: 'MarkDownEditor',
};

const Container = styled.div`
    min-height: 500px;
`;

export const MarkDownStory = () => {
    const handleChange = (params: string) => {
        console.log(params);
    }
    return (
        <Container>
            <MarkDownEditor key="Test" value={'`This is an example description First second`'} onChange={handleChange}/>
        </Container>
    );
};
