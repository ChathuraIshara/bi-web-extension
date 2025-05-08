/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: no-empty jsx-no-multiline-js
import React, { useState } from 'react';

export interface ToolbarCtx {
    toolbarMoreExp: boolean,
    onClickMoreExp: (value: boolean) => void
}

export const ToolbarContext = React.createContext<ToolbarCtx>({
    toolbarMoreExp: false,
    onClickMoreExp: (value: boolean) => {}
});

export const ToolbarContextProvider: React.FC = (props) => {
    const [toolbarMoreExp, setToolbarMoreExp] = useState(false);

    const onClickMoreExp = (value: boolean) => {
        setToolbarMoreExp(value);
    };

    return (
        <ToolbarContext.Provider
            value={{
                toolbarMoreExp,
                onClickMoreExp
            }}
        >
            {props.children}
        </ToolbarContext.Provider>
    );
};
