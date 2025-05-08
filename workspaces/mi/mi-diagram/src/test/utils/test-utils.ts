/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { promises as fs } from 'fs';
import { parseString } from 'xml2js';
import deepEqual from 'deep-equal';
import { getNodeDescription } from '../../utils/node';
import Mustache from 'mustache';
import { escapeXml } from '../../utils/commons';

Mustache.escape = escapeXml;

/**
 * Reads the content of an XML file.
 * @param filePath The path to the XML file.
 * @returns A promise that resolves to the content of the XML file.
 */
export async function readXMLFile(filePath: string): Promise<string> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content;
    } catch (error) {
        throw new Error(`Failed to read XML file: ${error}`);
    }
}

export async function writeXMLFile(filePath: string, content: string) {
    try {
        await fs.writeFile(filePath, content, 'utf-8');
    }
    catch (error) {
        throw new Error(`Failed to write XML file: ${error}`);
    }
}

/**
 * Parses an XML string to a JavaScript object.
 * @param xmlString The XML string to parse.
 * @returns A promise that resolves to the parsed object.
 */
export function parseXML(xmlString: string): Promise<any> {
    return new Promise((resolve, reject) => {
        parseString(xmlString, { explicitArray: false, trim: true }, (err: any, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

export async function areXMLsEqual(xml1: string, xml2: string): Promise<boolean> {
    try {
        const obj1 = await parseXML(xml1);
        const obj2 = await parseXML(xml2);

        // Accessing the child element in XML1
        const childValue = obj1.root.child;

        return deepEqual(obj1, obj2);
    } catch (error) {
        console.error('Error parsing XML:', error);
        return false;
    }
}

/**
 * Normalizes an XML string by removing unnecessary whitespace.
 * @param xml The XML string to normalize.
 * @returns The normalized XML string.
 */
export function normalizeXML(xml: string): string {
    return xml
        .replace(/>\s+</g, '><')  // Remove spaces between tags
        .replace(/\s{2,}/g, ' ')  // Replace multiple spaces with a single space
        .replace(/"\s+/g, '"')    // Remove space after opening quote in attribute
        .replace(/\s+"/g, '"')    // Remove space before closing quote in attribute
        .trim();
}

/**
 * Function to test the description of a mediator.
 * @param mediatorType The type of the mediator.
 * @param st The syntax tree of the mediator.
 * @param expectedDescription The expected description of the mediator.
 */
export async function getMediatorDescription(mediatorType: string, st: any) {
    const mediatorST = st.syntaxTree.api.resource[0].inSequence.mediatorList[0];
    const description = getNodeDescription(mediatorST);
    return description;
}
