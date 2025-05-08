/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import * as https from "https";
import { LibrariesListResponse, LibraryDataResponse, LibraryKind, LibrarySearchResponse } from "./model";

export const cachedLibrariesList = new Map<string, LibrariesListResponse>();
export const cachedSearchList = new Map<string, LibrarySearchResponse>();
export const cachedLibraryData = new Map<string, LibraryDataResponse>();
export const DIST_LIB_LIST_CACHE = "DISTRIBUTION_LIB_LIST_CACHE";
export const LANG_LIB_LIST_CACHE = "LANG_LIB_LIST_CACHE";
export const STD_LIB_LIST_CACHE = "STD_LIB_LIST_CACHE";
export const LIBRARY_SEARCH_CACHE = "LIBRARY_SEARCH_CACHE";

const options = {
    hostname: 'api.central.ballerina.io',
    port: 443,
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};
const balVersion = '2201.4.0'; // This will overwrite if the ballerina version can be derived from the ballerina home (Cannot be derived when using the custom packs).
const DOC_API_PATH = '/2.0/docs';
const LIBRARIES_LIST_ENDPOINT = DOC_API_PATH + '/stdlib/' + balVersion;
const LIBRARIES_SEARCH_ENDPOINT = LIBRARIES_LIST_ENDPOINT + '/search';

export function getLibrariesList(kind?: LibraryKind): Promise<LibrariesListResponse | undefined> {

    return new Promise((resolve, reject) => {

        if (kind === LibraryKind.langLib && cachedLibrariesList.has(LANG_LIB_LIST_CACHE)) {
            return resolve(cachedLibrariesList.get(LANG_LIB_LIST_CACHE));
        } else if (kind === LibraryKind.stdLib && cachedLibrariesList.has(STD_LIB_LIST_CACHE)) {
            return resolve(cachedLibrariesList.get(STD_LIB_LIST_CACHE));
        } else if (cachedLibrariesList.has(DIST_LIB_LIST_CACHE)) {
            return resolve(cachedLibrariesList.get(DIST_LIB_LIST_CACHE));
        }

        let body = '';
        const req = https.request({ path: LIBRARIES_LIST_ENDPOINT, ...options }, res => {
            res.on('data', (chunk: any) => {
                body = body + chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return null;
                } else {
                    let responseJson;
                    const payload = JSON.parse(body);
                    if (kind) {
                        responseJson = {
                            'librariesList': payload[kind]
                        };
                    } else {
                        responseJson = {
                            'librariesList': [...payload[LibraryKind.langLib], ...payload[LibraryKind.stdLib]]
                        };
                    }

                    return resolve(responseJson);
                }
            });
        });

        req.on('error', error => {
            reject();
        });

        req.end();
    });
}

export function getAllResources(): Promise<LibrarySearchResponse | undefined> {

    return new Promise((resolve, reject) => {

        if (cachedSearchList.has(LIBRARY_SEARCH_CACHE)) {
            return resolve(cachedSearchList.get(LIBRARY_SEARCH_CACHE));
        }

        let body = '';
        const req = https.request({ path: LIBRARIES_SEARCH_ENDPOINT, ...options }, res => {
            res.on('data', (chunk: any) => {
                body = body + chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return null;
                } else {
                    return resolve(JSON.parse(body));
                }
            });
        });

        req.on('error', error => {
            reject();
        });

        req.end();
    });
}

export function getLibraryData(orgName: string, moduleName: string, version: string)
    : Promise<LibraryDataResponse | undefined> {

    return new Promise((resolve, reject) => {

        if (cachedLibraryData.has(`${orgName}_${moduleName}_${version}`)) {
            return resolve(cachedLibraryData.get(`${orgName}_${moduleName}_${version}`));
        }

        let body = '';
        const req = https.request({ path: `${DOC_API_PATH}/${orgName}/${moduleName}/${version}`, ...options }, res => {
            res.on('data', (chunk) => {
                body = body + chunk;
            });

            res.on('end', () => {
                if (res.statusCode !== 200) {
                    return null;
                } else {
                    const libraryData = JSON.parse(body);
                    cachedLibraryData.set(`${orgName}_${moduleName}_${version}`, libraryData);
                    return resolve(libraryData);
                }
            });
        });

        req.on('error', error => {
            reject();
        });

        req.end();
    });
}
