/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { createContext } from "react"
import { APIDesignerContext as APIDesignerContextDef } from "../Definitions/Context";
import { PathID } from "../constants";

const defaultContext: APIDesignerContextDef = {
    props: {
        openAPIVersion: "3.0.1",
        openAPI: {
            openapi: "",
            info: {
                title: "",
                version: ""
            },
            paths: {}
        },
        selectedComponentID: PathID.OVERVIEW,
    },
    api: {
        onCurrentViewChange: () => {},
        onSelectedComponentIDChange: () => {}
    }
}

export const APIDesignerContext = createContext<APIDesignerContextDef>(defaultContext);
