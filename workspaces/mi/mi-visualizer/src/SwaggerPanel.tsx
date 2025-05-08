/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import SwaggerUI from "swagger-ui-react";
import { parse } from "yaml";
import { View } from "./components/View";
import '@wso2-enterprise/ui-toolkit/src/styles/swagger/main.scss';
import { SwaggerData, Request, Response } from "@wso2-enterprise/mi-core";
import { useVisualizerContext } from "@wso2-enterprise/mi-rpc-client";
import styled from "@emotion/styled";

interface SwaggerPanelProps {
    swaggerData?: SwaggerData
}

const ViewWrapper = styled.div({
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'scroll',
});

export function SwaggerPanel(props: SwaggerPanelProps) {
    const { rpcClient } = useVisualizerContext();
    const { generatedSwagger, port } = props?.swaggerData;

    const proxy = `http://localhost:${port}/`;

    const openapiSpec = parse(generatedSwagger);
    let response: Response;

    async function requestInterceptor(req: any) {
        const request: Request = {
            url: req.url,
            method: req.method,
            headers: req.headers,
            body: req.body,
        }

        const proxyResponse = await rpcClient.getMiVisualizerRpcClient()
            .sendSwaggerProxyRequest({ command: 'swaggerRequest', request: request }).then((swaggerReponse) => {
                if (swaggerReponse?.isResponse && swaggerReponse?.response !== undefined) {
                    response = swaggerReponse.response;
                    req.url = proxy;
                    return req;
                }
            });

        if (proxyResponse) {
            req.url = proxy;
            return req;
        }
    }

    function responseInterceptor(res: any) {
        res.ok = true;
        res.status = response.status;
        res.statusText = response.statusText;
        res.text = response.text;
        res.data = response.data;
        res.body = response.body;
        res.obj = response.obj;
        res.headers = response.headers;
        delete res.parseError
        return res;
    }

    return (
        <ViewWrapper>
            <div style={{ padding:'20px', height: '100%' }}>
                <SwaggerUI requestInterceptor={requestInterceptor}
                    responseInterceptor={responseInterceptor} spec={openapiSpec} showMutatedRequest={false} />
            </div>
        </ViewWrapper>
    );
}
