/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export interface PerformanceForecastProps {
    name: String,
    data: PerformanceAnalyzerAdvancedResponse
}

export interface PerformanceAnalyzerAdvancedResponse {
    criticalPath: number;
    pathmaps: Record<string, string[]>;
    paths: Record<string, PathData>;
    positions: Record<string, ConnectorPosition>;
}

interface PathData {
    graphData: GraphPoint[];
    sequenceDiagramData: SequenceDiagramData;
}

export interface GraphPoint {
    concurrency: number;
    latency: number;
    tps: number;
}

export interface ConnectorPosition {
    name: string;
    pkgID: string;
    pos: string;
}

export interface Values {
    min?: number;
    max: number;
}

interface SequenceDiagramData {
    concurrency: Values;
    latency: Values;
    tps: Values;
    connectorLatencies: Record<string, Values>;
}

export interface VSCode {
    postMessage(message: any): void;
}
