/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from 'react';
import SwaggerUI from "swagger-ui-react";
import Dropdown, { Option } from 'react-dropdown';

import "./style.css";
import "swagger-ui-react/swagger-ui.css";
import 'react-dropdown/style.css';
interface OASpec {
    file: string;
    serviceName: string;
    spec: any;
    diagnostics: OADiagnostic[];
}

interface OADiagnostic {
    message: string;
    serverity: string;
    location?: LineRange;
}
interface LineRange {
    startLine: LinePosition;
    endLine: LinePosition;
}

interface LinePosition {
    line: number;
    offset: number;
}

declare const vscode: vscode;
interface vscode {
    postMessage(message: any): void;
}

interface Request {
    url: string,
    headers: string,
    method: string,
    body?: string,
}

interface Response {
    status: number,
    statusText: string,
    data?: string,
    text?: string,
    body?: string,
    obj?: string,
    headers?: Record<string, string>,
}

export const SwaggerView = (props: any) => {
    const services: Option[] = [];
    const specs: OASpec[] = props.data.specs;
    const file: string | undefined = props.data.file;
    const serviceName: string | undefined = props.data.serviceName;
    const proxy: string | undefined = props.data.proxy;
    let response: Response;

    let selectedService = 0;
    specs.forEach((spec, index) => {
        services.push({
            value: String(index),
            label: `${spec.file} - /${spec.serviceName}`
        });

        if (file && serviceName && file === spec.file &&
            serviceName.toLocaleLowerCase() === spec.serviceName.trim().replaceAll(" ", "_").toLocaleLowerCase()) {
            selectedService = index;
        }
    });

    const [spec, setSpec] = useState(specs[selectedService].spec);
    const [selectedOption, setSelectedOption] = useState(services[selectedService]);

    function selectService(option: Option) {
        const index = Number(option.value);
        setSpec(specs[index].spec);
        setSelectedOption(services[index]);
    }

    async function requestInterceptor(req: any) {
        const request: Request = {
            url: req.url,
            method: req.method,
            headers: req.headers,
            body: req.body,
        }

        vscode.postMessage({
            command: 'swaggerRequest',
            req: request
        });

        const res = await new Promise(resolve => {
            window.addEventListener('message', event => {
                const message = event.data;
                switch (message.command) {
                    case 'swaggerResponse':
                        if (!message.res) {
                            resolve(false);
                        }
                        response = message.res;
                        resolve(response);
                }
            })
        });
        if (res) {
            req.url = proxy;
        }
        return req;
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
        <div>
            <div className='dropdown-container'>
                <Dropdown options={services} onChange={selectService} value={selectedOption} placeholder="Select a service" />
            </div>
            <SwaggerUI requestInterceptor={requestInterceptor}
                responseInterceptor={responseInterceptor} spec={spec} showMutatedRequest={false} />
        </div>);
};
