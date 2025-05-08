import { createElement } from "react";
import { render } from "react-dom";

import { BalleriaLanguageClient, WSConnection } from "@wso2-enterprise/ballerina-languageclient";
import { ANALYZE_TYPE, LibraryDataResponse, LibraryDocResponse, LibraryKind, LibrarySearchResponse } from "@wso2-enterprise/ballerina-low-code-edtior-commons";
import { Uri } from "monaco-editor";
import { WorkspaceEdit } from "vscode-languageserver-protocol";

import { DiagramGeneratorProps } from "../DiagramGenerator";
import { PerformanceAnalyzerAdvancedResponse, PerformanceAnalyzerRealtimeResponse, Values } from "../DiagramGenerator/performanceUtil";

import balDist from "./data/baldist.json";
import { StandaloneDiagramApp } from "./StandaloneDiagramApp";

export const MOCK_SERVER_URL = "http://localhost:3000"
export const LANG_SERVER_URL = "ws://localhost:9095"

export const langClientPromise = WSConnection.initialize(LANG_SERVER_URL).then((wsConnection: WSConnection) => {
  return new BalleriaLanguageClient(wsConnection);
});

export async function getFileContent(filePath: string): Promise<string> {
  return fetch(MOCK_SERVER_URL + "/file/" + encodeURIComponent(filePath))
    .then(response => {
      return response.text()
    })
}

export async function updateFileContent(filePath: string, text: string): Promise<boolean> {
  return fetch(MOCK_SERVER_URL + "/file/" + encodeURIComponent(filePath),
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ text })
    })
    .then(response => {
      return response.json()
    }).then(result => result.success);
}

export function getDiagramGeneratorProps(filePath: string, enableSave: boolean = false): DiagramGeneratorProps {
  return {
    langClientPromise,
    scale: "1",
    panX: "0",
    panY: "0",
    filePath,
    startColumn: 0,
    startLine: 0,
    getFileContent,
    getPerfDataFromChoreo: generatePerfData,
    gotoSource: () => Promise.resolve(false),
    lastUpdatedAt: (new Date()).toISOString(),
    resolveMissingDependency: async () => {
      const langClient = await langClientPromise;
      return langClient.resolveMissingDependencies({
        documentIdentifier: {
          uri: Uri.file(filePath).toString()
        }
      });
    },
    resolveMissingDependencyByCodeAction: () => Promise.resolve(false),
    runCommand: () => Promise.resolve(false),
    runBackgroundTerminalCommand: () => Promise.resolve({ error: false, message: "" }),
    openArchitectureView: () => Promise.resolve(false),
    sendTelemetryEvent: () => Promise.resolve(undefined),
    showMessage: () => Promise.resolve(false),
    showPerformanceGraph: () => Promise.resolve(false),
    updateFileContent: enableSave ? updateFileContent : () => Promise.resolve(undefined),
    getLibrariesList,
    getLibrariesData,
    getLibraryData,
    getSentryConfig: () => Promise.resolve(undefined),
    getBallerinaVersion: () => Promise.resolve("2201.3.1 (swan lake update 3)"), // Test will check only latest forms
    getEnv: (name: string) => Promise.resolve(undefined),
    experimentalEnabled: true,
    openExternalUrl: () => Promise.resolve(undefined),
    renameSymbol: (workspaceEdits: WorkspaceEdit) => Promise.resolve(undefined),
    projectPaths: undefined,
    openInDiagram: undefined,
    diagramFocus: undefined,
    workspaceName: ''
  }
}


export function renderStandaloneMockedEditor(container: string) {
  const element = createElement(StandaloneDiagramApp);
  render(element, document.getElementById(container));
}

export function getProjectRoot() {
  const balDistObj = balDist as any;
  return balDistObj.projectRoot;
}

export async function getLibrariesList(kind?: LibraryKind): Promise<LibraryDocResponse> {
  return fetch(MOCK_SERVER_URL + "/libs/list" + (kind ? "?kind=" + kind : ""))
    .then(response => {
      return response.json()
    });
}

export async function getLibrariesData(): Promise<LibrarySearchResponse> {
  return fetch(MOCK_SERVER_URL + "/libs/data")
    .then(response => {
      return response.json()
    });
}

export async function getLibraryData(orgName: string, moduleName: string, version: string): Promise<LibraryDataResponse> {
  return fetch(MOCK_SERVER_URL + `/lib/data`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({ orgName, moduleName, version })
    })
    .then(response => {
      return response.json()
    });
}

export function generatePerfData(data: any, analyzeType: ANALYZE_TYPE): Promise<PerformanceAnalyzerRealtimeResponse | PerformanceAnalyzerAdvancedResponse> {
  if (analyzeType === ANALYZE_TYPE.REALTIME) {
    if (data.resourcePos.start.line === 24) {
      return Promise.resolve({
        concurrency: { max: 1, min: 1 },
        latency: { max: 3738, min: 46 },
        tps: { max: 21.66, min: 8.28 },
        connectorLatencies: { "0": { "max": 18, "min": 19 }, "1": { "max": 7258.92, "min": 106 }, "2": { "max": 7258.92, "min": 116 } },
        positions: {
          "0": {
            "name": "Client",
            "pkgID": "ballerina/http",
            "pos": "main.bal/(26:33,26:67)"
          },
          "1": {
            "name": "Client",
            "pkgID": "ballerina/http",
            "pos": "main.bal/(28:34,28:68)"
          },
          "2": {
            "name": "Client",
            "pkgID": "ballerina/http",
            "pos": "main.bal/(29:34,29:68)"
          }
        },
        message: undefined, type: undefined
      });
    }
    return Promise.resolve({
      "concurrency": { "max": 50, "min": 1 },
      "connectorLatencies": { "0": { "max": 5276.18, "min": 256 } },
      "latency": { "max": 7276, "min": 107 },
      "positions": {
        "0": { "name": "Client", "pkgID": "ballerina/http", "pos": "main.bal/(40:42,40:88)" },
        "1": { "name": "Client", "pkgID": "ballerina/http", "pos": "main.bal/(43:42,43:88)" }
      },
      "tps": { "max": 9.39, "min": 4.56 }
    });

  } else {
    return Promise.resolve({
      "criticalPath": 1,
      "pathmaps": { "0": ["0"], "1": ["1"] },
      "paths": {
        "0": {
          "graphData": [
            { "concurrency": 1, "latency": 107, "tps": 9.39 },
            { "concurrency": 25, "latency": 4001, "tps": 6.25 },
            { "concurrency": 50, "latency": 7276, "tps": 6.87 },
            { "concurrency": 75, "latency": 10878, "tps": 6.89 },
            { "concurrency": 100, "latency": 14807, "tps": 6.75 }
          ],
          "sequenceDiagramData": {
            "concurrency": { "max": 50, "min": 1 },
            "connectorLatencies": { "0": { "max": 7276.18, "min": 106 } },
            "latency": { "max": 7276, "min": 107 }, "tps": { "max": 9.39, "min": 6.25 }
          }
        },
        "1": {
          "graphData": [
            { "concurrency": 1, "latency": 107, "tps": 9.39 },
            { "concurrency": 25, "latency": 4001, "tps": 6.25 },
            { "concurrency": 50, "latency": 7276, "tps": 6.87 },
            { "concurrency": 75, "latency": 10878, "tps": 6.89 },
            { "concurrency": 100, "latency": 14807, "tps": 6.75 }],
          "sequenceDiagramData": {
            "concurrency": { "max": 50, "min": 1 },
            "connectorLatencies": { "1": { "max": 7276.18, "min": 106 } },
            "latency": { "max": 7276, "min": 107 }, "tps": { "max": 9.39, "min": 6.25 }
          }
        }
      },
      "positions": {
        "0": { "name": "Client", "pkgID": "ballerina/http", "pos": "main.bal/(40:42,40:88)" },
        "1": { "name": "Client", "pkgID": "ballerina/http", "pos": "main.bal/(43:42,43:88)" }
      }
    });
  }
}
