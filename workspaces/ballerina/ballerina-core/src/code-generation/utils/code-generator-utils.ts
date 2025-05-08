// /**
//  * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//  *
//  * This software is the property of WSO2 LLC. and its suppliers, if any.
//  * Dissemination of any information or reproduction of any material contained
//  * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  * You may not alter or remove any copyright or other notice from copies of this content.
//  */

// import {
//     BalExpression,
//     CodeLocation,
//     CodeNodeProperties,
//     Flow,
//     HttpRequestNodeProperties,
//     InputPort,
//     Node,
//     OutputPort,
//     SwitchCaseBlock,
//     SwitchNodeProperties,
//     TransformNodeProperties,
// } from "../../interfaces/bi";
// import { getNodeMetadata } from "./metadata-utils";
// import { getComponentSource } from "./template-utils";

// // const defaultInput = "_ = check <- function;";
// let returnBlock: string = "";
// let startWorkerCall: string = "";

// interface TransformFunction {
//     code: string;
//     location: CodeLocation;
// }

// interface TransformNodeData {
//     transformNode: string;
//     transformFunction?: TransformFunction;
// }

// export interface CodeGeneartionData {
//     workerBlocks: string;
//     transformFunctions?: TransformFunction[];
// }


// export function workerCodeGen(model: Flow): CodeGeneartionData {
//     console.log("===model", model);
//     let workerBlocks: string = "";
//     let transformFunctions: TransformFunction[];
//     // use the util functions and generate the workerblocks
//     model?.nodes.forEach((node) => {
//         if (node.templateId === "SwitchNode") {
//             workerBlocks += generateSwitchNode(node);
//         } else if (node.templateId === "HttpRequestNode") {
//             workerBlocks += generateCallerNode(node);
//         } else if (node.templateId === "HttpResponseNode") {
//             workerBlocks += generateResponseNode(node);
//         } else if (node.templateId === "TransformNode") {
//             const transformNodeData: TransformNodeData = generateTransformNode(node);
//             if (transformNodeData.transformFunction) {
//                 if (!transformFunctions) {
//                     transformFunctions = [];
//                 }
//                 transformFunctions.push(transformNodeData.transformFunction);
//             }
//             workerBlocks += transformNodeData.transformNode;
//         } else if (node.templateId === "StartNode") {
//             workerBlocks += generateStartNode(node);
//         } else {
//             workerBlocks += generateBlockNode(node);
//         }
//     });

//     return {
//         workerBlocks: workerBlocks + startWorkerCall + returnBlock,
//         transformFunctions: transformFunctions || undefined,
//     };
// }

// function generateStartNode(node: Node): string {
//     const startNode: string = getComponentSource({
//         name: "START_NODE",
//         config: {
//             OUTPUT_PORTS: generateOutputPorts(node, "()"),
//         },
//     });

//     // node with annotation
//     const completeNode = `
//     ${generateDisplayNode(node)}
//     ${startNode}
//     `;

//     startWorkerCall = `
//     () -> StartNode;
//     `;

//     return completeNode;
// }

// function generateBlockNode(node: Node): string {
//     const nodeProperties = node.properties as CodeNodeProperties;
//     const inputPorts: string = generateInputPorts(node);
//     const outputPorts: string = generateOutputPorts(node);

//     const workerNode: string = getComponentSource({
//         name: "CODE_BLOCK_NODE",
//         config: {
//             NODE_NAME: node.name,
//             INPUT_PORTS: inputPorts,
//             CODE_BLOCK: nodeProperties?.codeBlock ? nodeProperties.codeBlock.code : undefined,
//             OUTPUT_PORTS: outputPorts,
//         },
//     });

//     // node with annotation
//     const completeNode = `
//     ${generateDisplayNode(node)}
//     ${workerNode}
//     `;

//     return completeNode;
// }

// function generateSwitchNode(node: Node): string {
//     const switchProperties: SwitchNodeProperties = node.properties as SwitchNodeProperties;
//     const inputVar = node?.inputPorts.length > 0 ? node.inputPorts[0]?.name : "()";
//     // generate switch case block
//     let switchCaseBlock: string = "";
//     switchProperties.cases.forEach((switchCase: SwitchCaseBlock) => {
//         // check the index of switchCase node
//         const index = switchProperties.cases.indexOf(switchCase);

//         let outputPorts: string = "";
//         switchCase.nodes.forEach((nodeId) => {
//             // find the port matching the nodeId from outputPorts
//             const port = node.outputPorts.find((port) => port.id === nodeId);
//             if (port) {
//                 outputPorts += generateOutport(port, inputVar);
//             }
//         });

//         // check if the switchcase.expression is a string or a bal expression
//         let expression: string;
//         if (typeof switchCase.expression === "string") {
//             expression = switchCase.expression;
//         } else {
//             expression = (switchCase.expression as BalExpression).expression;
//         }

//         if (index === 0) {
//             switchCaseBlock += getComponentSource({
//                 name: "IF_BLOCK",
//                 config: {
//                     CONDITION: expression,
//                     OUTPORTS: outputPorts,
//                 },
//             });
//         } else {
//             switchCaseBlock += getComponentSource({
//                 name: "ELSEIF_BLOCK",
//                 config: {
//                     CONDITION: expression,
//                     OUTPORTS: outputPorts,
//                 },
//             });
//         }
//     });

//     // default case block
//     let outputPorts: string = "";
//     switchProperties.defaultCase?.nodes.forEach((nodeId) => {
//         // find the port matching the nodeId from outputPorts
//         const port = node.outputPorts.find((port) => port.id === nodeId);
//         if (port) {
//             outputPorts += generateOutport(port, inputVar);
//         }
//     });

//     switchCaseBlock += getComponentSource({
//         name: "ELSE_BLOCK",
//         config: {
//             OUTPORTS: outputPorts,
//         },
//     });

//     // generate switch node
//     const switchNode: string = getComponentSource({
//         name: "SWITCH_NODE",
//         config: {
//             NODE_NAME: node.name,
//             INPUT_PORTS: generateInputPorts(node),
//             SWITCH_BLOCK: switchCaseBlock,
//         },
//     });

//     // node with annotation
//     const completeNode = `
//     ${generateDisplayNode(node)}
//     ${switchNode}
//     `;

//     return completeNode;
// }

// function generateCallerNode(node: Node): string {
//     const callerProps = node.properties as HttpRequestNodeProperties;
//     const callerEp: string = callerProps.endpoint?.name;
//     const callerVariable: string = node.name.toLowerCase() + "_response";

//     const callerAction: string = getComponentSource({
//         name: "CALLER_ACTION",
//         config: {
//             TYPE: callerProps.outputType,
//             VARIABLE: callerVariable,
//             CALLER: callerEp,
//             PATH: callerProps?.path ? removeLeadingSlash(callerProps.path) : undefined,
//             ACTION: callerProps.action,
//             PAYLOAD:
//                 callerProps.action === "post"
//                     ? node?.inputPorts[0]?.name
//                         ? node.inputPorts[0].name
//                         : "{}"
//                     : undefined,
//         },
//     });

//     const inputPorts: string = generateInputPorts(node);
//     const outputPorts: string = generateOutputPorts(node, callerVariable);

//     const workerNode: string = getComponentSource({
//         name: "CALLER_BLOCK",
//         config: {
//             NODE_NAME: node.name,
//             INPUT_PORTS: inputPorts,
//             CALLER_ACTION: callerAction,
//             OUTPUT_PORTS: outputPorts,
//         },
//     });

//     // node with annotation
//     const completeNode = `
//     ${generateDisplayNode(node)}
//     ${workerNode}
//     `;
//     return completeNode;
// }

// function generateResponseNode(node: Node): string {
//     const inputPort = node?.inputPorts[0];
//     const varType = inputPort?.type ? sanitizeType(inputPort.type) : undefined;
//     const varName = inputPort?.name;

//     // TODO: fix the correct type and name when there are multiple types of the input ports
//     let genInport;

//     // TODO: Remove once the BE supports only one inputPort
//     if (node.inputPorts?.length > 1) {
//         const responseList = generateAlternateResponse(node);
//         genInport = getComponentSource({
//             name: "ASYNC_RECEIVE_ACTION",
//             config: {
//                 TYPE: varType,
//                 VAR_NAME: varName,
//                 SENDER_WORKER: responseList,
//             },
//         });
//     } else {
//         if (inputPort) {
//             const responseList = generateAlternateReceive(inputPort);
//             genInport = getComponentSource({
//                 name: "ASYNC_RECEIVE_ACTION",
//                 config: {
//                     TYPE: varType,
//                     VAR_NAME: varName,
//                     SENDER_WORKER: responseList,
//                 },
//             });
//         } else {
//             genInport = undefined;
//         }

//     }

//     const workerNode: string = getComponentSource({
//         name: "RESPOND",
//         config: {
//             NODE_NAME: node.name,
//             INPUT_PORTS: genInport ? genInport : undefined,
//             VAR_NAME: varName ? varName : undefined,
//         },
//     });

//     returnBlock = getComponentSource({
//         name: "RETURN_BLOCK",
//         config: {
//             NODE_NAME: node.name,
//             TYPE: varType ? varType : undefined,
//             VAR_NAME: varName ? varName : undefined,
//         },
//     });

//     // node with annotation
//     const completeNode = `
//     ${generateDisplayNode(node)}
//     ${workerNode}
//     `;
//     return completeNode;
// }

// function generateAlternateReceive(inport: InputPort): string {
//     const alternateReceive: string = getComponentSource({
//         name: "UNION_EXPRESSION",
//         config: {
//             UNION_FIELDS: inport?.alternateSender,
//         },
//     });
//     return alternateReceive;
// }

// // TODO: Remove once the BE model agreed on the alterante sender
// function generateAlternateResponse(node: Node): string {
//     // get the inputPorts list and get the receiver name and generate in the form of receiverName1 | recieverName1
//     let inputPorts = "";
//     node.inputPorts.forEach((port: InputPort) => {
//         const receiver = port.sender;
//         inputPorts += receiver;
//         // if the receiver is not the last element add a comma
//         if (node.inputPorts.indexOf(port) !== node.inputPorts.length - 1) {
//             inputPorts += " | ";
//         }
//     });
//     return inputPorts;
// }

// function generateTransformNode(node: Node): TransformNodeData {
//     const nodeProperties = node.properties as TransformNodeProperties;
//     const inputPorts: string = generateInputPorts(node);
//     const outputVar: string = node.name.toLowerCase() + "_transformed";
//     const outputPorts: string = generateOutputPorts(node, outputVar);
//     const metadata = getNodeMetadata(node);

//     // create the transform_Function
//     if (!nodeProperties?.expression?.expression || nodeProperties?.resetFuncBody) {
//         const outputType = metadata?.outputs[0]?.type;
//         const inputPortNames: string[] = [];
//         const inputPortTypes: string[] = [];

//         if (node.inputPorts.length > 0) {
//             node.inputPorts.forEach((input) => {
//                 inputPortNames.push(input.name);
//                 inputPortTypes.push(input.type);
//             });
//         } else {
//             metadata?.inputs.forEach((input) => {
//                 inputPortNames.push(input.name);
//                 inputPortTypes.push(input.type);
//             });
//         }

//         const functionParams = inputPortTypes
//             .map((type, index) => {
//                 return type + " " + inputPortNames[index];
//             })
//             .join(", ");

//         const funcArgs = inputPortNames.join(", ");

//         const functionReturn = getComponentSource({
//             name: "FUNCTION_RETURN",
//             config: {
//                 TYPE: outputType
//             },
//         });

//         const transFunName = (node.name + "_transform").toLocaleLowerCase();

//         const transFunction = getComponentSource({
//             name: "TRANSFORM_FUNCTION",
//             config: {
//                 FUNCTION_NAME: transFunName,
//                 PARAMETERS: functionParams,
//                 FUNCTION_RETURN: functionReturn,
//             },
//         });

//         const transFunctionCall = getComponentSource({
//             name: "TRANSFORM_FUNCTION_CALL",
//             config: {
//                 TYPE: outputType,
//                 VAR_NAME: outputVar,
//                 FUNCTION_NAME: transFunName,
//                 PARAMETERS: funcArgs,
//             },
//         });

//         // generate the worker node
//         const workerNode: string = getComponentSource({
//             name: "TRANSFORM_NODE",
//             config: {
//                 NODE_NAME: node.name,
//                 INPUT_PORTS: inputPorts,
//                 TRANSFORM_FUNCTION: transFunctionCall,
//                 OUTPUT_PORTS: outputPorts,
//             },
//         });

//         // node with annotation
//         const completeNode = `
//             ${generateDisplayNode(node)}
//             ${workerNode}
//             `;

//         return {
//             transformFunction: {
//                 code: transFunction,
//                 location: nodeProperties?.transformFunctionLocation ? nodeProperties.transformFunctionLocation : undefined,
//             },
//             transformNode: completeNode,
//         };
//     } else if (nodeProperties?.expression?.expression && nodeProperties.updateFuncSignature) {
//         const outputType = metadata?.outputs[0]?.type;
//         const inputPortNames: string[] = [];
//         const inputPortTypes: string[] = [];

//         if (node.inputPorts.length > 0) {
//             node.inputPorts.forEach((input) => {
//                 inputPortNames.push(input.name);
//                 inputPortTypes.push(input.type);
//             });
//         } else {
//             metadata?.inputs.forEach((input) => {
//                 inputPortNames.push(input.name);
//                 inputPortTypes.push(input.type);
//             });
//         }

//         const functionParams = inputPortTypes
//             .map((type, index) => {
//                 return type + " " + inputPortNames[index];
//             })
//             .join(", ");

//         const funcArgs = inputPortNames.join(", ");

//         const functionReturn = getComponentSource({
//             name: "FUNCTION_RETURN",
//             config: {
//                 TYPE: outputType
//             },
//         });

//         const transFunName = (node.name + "_transform").toLocaleLowerCase();

//         const transFunction = getComponentSource({
//             name: "TRANSFORM_FUNCTION_WITH_BODY",
//             config: {
//                 FUNCTION_NAME: transFunName,
//                 PARAMETERS: functionParams,
//                 FUNCTION_RETURN: functionReturn,
//                 FUNCTION_BODY: nodeProperties.transformFunctionBody?.code
//             },
//         });

//         const transFunctionCall = getComponentSource({
//             name: "TRANSFORM_FUNCTION_CALL",
//             config: {
//                 TYPE: outputType,
//                 VAR_NAME: outputVar,
//                 FUNCTION_NAME: transFunName,
//                 PARAMETERS: funcArgs,
//             },
//         });

//         // generate the worker node
//         const workerNode: string = getComponentSource({
//             name: "TRANSFORM_NODE",
//             config: {
//                 NODE_NAME: node.name,
//                 INPUT_PORTS: inputPorts,
//                 TRANSFORM_FUNCTION: transFunctionCall,
//                 OUTPUT_PORTS: outputPorts,
//             },
//         });

//         // node with annotation
//         const completeNode = `
//             ${generateDisplayNode(node)}
//             ${workerNode}
//             `;

//         return {
//             transformFunction: {
//                 code: transFunction,
//                 location: nodeProperties?.transformFunctionLocation ? nodeProperties.transformFunctionLocation : undefined,
//             },
//             transformNode: completeNode,
//         };
//     } else {
//         const workerNode: string = getComponentSource({
//             name: "TRANSFORM_NODE",
//             config: {
//                 NODE_NAME: node.name,
//                 INPUT_PORTS: inputPorts,
//                 TRANSFORM_FUNCTION: nodeProperties.expression?.expression,
//                 OUTPUT_PORTS: outputPorts,
//             },
//         });

//         const completeNode = `
//             ${generateDisplayNode(node)}
//             ${workerNode}
//             `;

//         return {
//             transformNode: completeNode,
//         };
//     }
// }

// function generateOutport(port: OutputPort, expression?: string): string {
//     return getComponentSource({
//         name: "ASYNC_SEND_ACTION",
//         config: {
//             EXPRESSION: expression ? expression : port?.name,
//             TARGET_WORKER: port?.receiver,
//         },
//     });
// }

// function generateInport(port: InputPort): string {
//     return getComponentSource({
//         name: "ASYNC_RECEIVE_ACTION",
//         config: {
//             TYPE: sanitizeType(port.type),
//             VAR_NAME: port.name,
//             SENDER_WORKER: port?.sender,
//         },
//     });
// }

// function generateInputPorts(node: Node): string {
//     if (!node.inputPorts || node.inputPorts.length === 0) {
//         return undefined;
//     }
//     let inputPorts: string = "";
//     node.inputPorts?.forEach((port) => {
//         // int x1 = <- A;
//         inputPorts += generateInport(port);
//     });

//     return inputPorts;
// }

// function generateOutputPorts(node: Node, expression?: string): string {
//     if (!node.outputPorts || node.outputPorts.length === 0) {
//         return undefined;
//     }
//     let outputPorts: string = "";
//     node.outputPorts?.forEach((port) => {
//         // x1 -> B;
//         if (expression) {
//             outputPorts += generateOutport(port, expression);
//         } else {
//             outputPorts += generateOutport(port);
//         }
//     });

//     return outputPorts;
// }

// function generateDisplayNode(node: Node): string {
//     return getComponentSource({
//         name: "ANNOTATION",
//         config: {
//             NODE: "Node",
//             TEMPLATE_ID: node.templateId,
//             X_CODE: node.canvasPosition?.x,
//             Y_CODE: node.canvasPosition?.y,
//             METADATA: node.metadata,
//         },
//     });
// }

// // TODO: remove once the backend model sends the correct type
// function sanitizeType(type: string): string {
//     const typeParts = type.split(":");
//     return typeParts[typeParts.length - 1];
// }

// function removeLeadingSlash(path: string): string {
//     if (path.startsWith("/")) {
//         return path.substring(1);
//     }
//     return path;
// }
