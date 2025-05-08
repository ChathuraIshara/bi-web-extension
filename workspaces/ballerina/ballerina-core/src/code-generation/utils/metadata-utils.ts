/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { NMD_Metadata as Metadata } from "../../interfaces/metadata-types";
// import { Node } from "../../interfaces/bi";

export function encodeMetadata(obj: Metadata): string {
    return btoa(encodeURIComponent(JSON.stringify(obj)));
}

export function decodeMetadata(str: string): Metadata {
    return JSON.parse(decodeURIComponent(atob(str)));
}

// export function getNodeMetadata(node: Node): Metadata | undefined {
//     if (!node.metadata) return undefined;
//     // if metadata is already encoded, decode it first
//     if (typeof node.metadata === "string") return decodeMetadata(node.metadata);
//     return node.metadata;
// }

// export function getEncodedNodeMetadata(node: Node): string | undefined {
//     if (!node.metadata) return undefined;
//     // if metadata is already encoded, return it
//     if (typeof node.metadata === "string") return node.metadata;
//     return encodeMetadata(node.metadata);
// }
