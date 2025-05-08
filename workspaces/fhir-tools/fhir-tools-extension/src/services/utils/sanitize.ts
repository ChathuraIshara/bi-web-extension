/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

/**
 * @description gets the HL7v2 input message and sanitizes it
 *
 * @param hl7v2Message - HL7v2 input message
 * @returns sanitized HL7v2 input message
 */
export function sanitizeHL7v2(hl7v2Message: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const window = new JSDOM("").window;
      const purify = DOMPurify(window);
      let cleanedInput: string = purify.sanitize(hl7v2Message);
      resolve(cleanedInput); // Resolve the promise with the sanitized input
    } catch (error) {
      reject(error); // Reject the promise if there's an error
    }
  });
}
