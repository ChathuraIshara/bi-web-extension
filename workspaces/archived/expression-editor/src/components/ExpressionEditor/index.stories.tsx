// import React from 'react';

// // tslint:disable-next-line: no-submodule-imports
// import { Story } from '@storybook/react/types-6-0';

// import { FormField, PrimitiveBalType } from '../../../../../../ConfigurationSpec/types';
// import { Provider as DiagramProvider } from "../../../../../../Contexts/Diagram";
// import { CompletionParams, CompletionResponse } from '../../../../../../Definitions';
// import { FormElementProps } from '../../types';

// import ExpressionEditor from './index';

// // also exported from '@storybook/react' if you can deal with breaking changes in 6.1
// // tslint:disable-next-line: no-submodule-imports

// export default {
//   title: 'Expression Editor',
//   component: ExpressionEditor,
// };

// const initialVal = '';
// const errorDiagnostic = [{
//     message: "undefined symbol",
//     severity: 1,
//     range: {start: {line: 4, character: 25}, end: {line: 4, character: 26}}
// }]

// const formField: FormField = {
//     name: 'ExpressionName',
//     displayName: "Expression Name",
//     type: PrimitiveBalType.Var,
// }

// const args: FormElementProps = {
//     model: formField,
//     customProps: {
//         // tslint:disable-next-line:no-empty
//         validate: () => {},
//         tooltipTitle: "Tooltip Title",
//         tooltipActionText: "Tooltip action text",
//         tooltipActionLink: "Tooltip action link",
//         interactive: true,
//     },
//     defaultValue: initialVal
// };

// // Hiding & disabling unused props
// const argTypes = {
//     defaultValue: { table: { disable: true } },
//     placeholder: { table: { disable: true } },
//     index: { table: { disable: true } },
//     label	: { table: { disable: true } },
//     rowsMax: { table: { disable: true } },
//     errorMessage: { table: { disable: true } },
//     validateEmptyField: { table: { disable: true } },
//     onFieldValueChange: { table: { disable: true } },
//     size: { table: { disable: true } },
//     type: { table: { disable: true } },
//     currentFile: { table: { disable: true } },
//     currentApp: { table: { disable: true } },
//     editorDiagnostics: { table: { disable: true } },
//     mainDiagnostics: { table: { disable: true } },
//     targetPositionDraft: { table: { disable: true } },
//     disabled: { table: { disable: true } },
//     dataTestId: { table: { disable: true } },
//     currentValue: { table: { disable: true } },
//     tooltip: { table: { disable: true } },
//     onClick: { table: { disable: true } },
//     dispatchExprEditorStart: { table: { disable: true } },
//     dispatchExprEditorContentChange: { table: { disable: true } },
//     dispatchExprEditorClose: { table: { disable: true } },
// }

// const initialContext = {
//     diagnostics:  [] as any,
//     targetPosition: {
//         endColumn: 22,
//         endLine: 10,
//         startColumn: 4,
//         startLine: 10,
//     },
//     currentFile: {
//         content: "CnB1YmxpYyBmdW5jdGlvbiBtYWluKCkgcmV0dXJucyBlcnJvcj8gewoKfQo=",
//     },
//     currentApp: {
//         workingFile: "/apps/username/apName/project/choreo.bal",
//     },
//     langServerURL: '',
//     getExpressionEditorLangClient: async () => ({
//         getCompletion: async (_completionParams: CompletionParams): Promise<CompletionResponse[]> => {
//             const completions: CompletionResponse[] = [];
//             return completions;
//         },
//         // tslint:disable-next-line:no-empty
//         didChange: async (): Promise<void> => {},
//         diagnostics: async (): Promise<any> => ([])
//     }),
//     syntaxTree: {
//         functionBody: {
//             position: {
//                 endColumn: 1,
//                 endLine: 3,
//                 startColumn: 38,
//                 startLine: 1
//             }
//         }
//     },
// }


// const Template: Story<FormElementProps> = (formArgs: FormElementProps) =>  (
//     <DiagramProvider initialState={initialContext} >
//         <ExpressionEditor {...formArgs}/>
//     </DiagramProvider>
// );
// export const ExpressionEditorStandard = Template.bind({});
// ExpressionEditorStandard.argTypes = argTypes;
// ExpressionEditorStandard.args = args;


// const TemplateWithError: Story<FormElementProps> = (formArgs: FormElementProps) =>  (
//     <DiagramProvider initialState={{...initialContext, diagnostics: errorDiagnostic}} >
//         <ExpressionEditor {...formArgs}/>
//     </DiagramProvider>
// );
// export const ExpressionEditorWithError = TemplateWithError.bind({});
// ExpressionEditorWithError.argTypes = argTypes;
// ExpressionEditorWithError.args = args;

// const TemplateWithDefaultValue: Story<FormElementProps> = (formArgs: FormElementProps) =>  (
//     <DiagramProvider initialState={initialContext} >
//         <ExpressionEditor {...formArgs} />
//     </DiagramProvider>
// );
// export const ExpressionEditorWithDefaultValue = TemplateWithDefaultValue.bind({});
// ExpressionEditorWithDefaultValue.argTypes = argTypes;
// ExpressionEditorWithDefaultValue.args = {
//     ...args,
//     model: {
//         ...args.model,
//         value: 'Default Value'
//     }
// };

