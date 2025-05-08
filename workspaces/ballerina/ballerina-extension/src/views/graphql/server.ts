/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import axios, { Method } from "axios";

interface Request {
  url: string;
  headers: string;
  method: Method;
  body?: string;
}
interface Response {
  status: number;
  statusText: string;
  data?: string;
  text?: string;
  body?: string;
  obj?: string;
  headers?: Record<string, string>;
}

const CONNECTION_REFUSED = 'ECONNREFUSED';
const EAI_AGAIN = 'EAI_AGAIN';
export class SwaggerServer {

  async sendRequest(data: Request, isOriginalResponse: boolean): Promise<Response | boolean> {
    const headers = data.headers as unknown as Record<string, string>;
    return new Promise<Response | boolean>((resolve, reject) => {
      axios({
        method: data.method,
        headers,
        url: data.url,
        data: data.body
      })
        .then(function (response) {
          const responseData = response.data;
          const res: Response = {
            status: response.status,
            statusText: response.statusText,
            data: responseData,
            body: JSON.stringify(responseData),
            text: JSON.stringify(responseData),
            obj: responseData,
            headers: response.headers as Record<string, string>
          };
          resolve(isOriginalResponse ? responseData : res);
        })
        .catch((error) => {
          let res: Response;
          if (error.response) {
            const responseData = error.response.data;
            // Request made and server responded
            res = {
              status: error.response.status,
              statusText: error.response.statusText,
              data: responseData,
              body: JSON.stringify(responseData),
              text: JSON.stringify(responseData),
              obj: responseData,
              headers: error.response.headers
            };
            resolve(res);
          } else {
            const errorCode = error.code;
            // Something happened in setting up the request that triggered an Error
            if (errorCode === CONNECTION_REFUSED || errorCode === EAI_AGAIN) {
              resolve(isOriginalResponse ? errorCode : false);
            }
            resolve(false);
          }
        });
    });
  }
}
