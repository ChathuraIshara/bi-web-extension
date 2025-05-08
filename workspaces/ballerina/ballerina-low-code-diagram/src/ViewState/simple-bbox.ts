import { DefaultConfig } from "../Visitors/default";

/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
export class SimpleBBox {
    public x: number = 0;
    public y: number = 0;
    public r: number = 0;
    public w: number = 0;
    public rw: number = 0;
    public lw: number = 0;
    public h: number = 0;
    public rx: number = 0;
    public ry: number = 0;
    public cx: number = 0;
    public cy: number = 0;
    public length: number = 0;
    public label: string = "";
    public labelWidth: number = 0;
    public offsetFromBottom: number = DefaultConfig.offSet;
    public offsetFromTop: number = DefaultConfig.offSet;
}
