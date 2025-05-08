// /**
//  * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//  *
//  * This software is the property of WSO2 LLC. and its suppliers, if any.
//  * Dissemination of any information or reproduction of any material contained
//  * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  * You may not alter or remove any copyright or other notice from copies of this content.
//  */
// import * as React from 'react';

// import { render, RenderResult } from "../../../../../../../../tests/utils/test-utils";
// import { EndConfig } from "../../../../Portals/ConfigForm/types";

// import { AddReturnForm, DEFINE_RETURN_EXR, EXISTING_PROPERTY } from "./index";

// describe('Return form test suite', () => {
//     it.skip("renders properly.", async () => {
//         const mockEndConfig: EndConfig = {
//             scopeSymbols: ["a", "b", "c"],
//             expression : "e",
//             type: "Return"
//         };
//         const logForm: RenderResult = render(
//             <svg>
//                 <AddReturnForm onCancel={null} onSave={null} config={mockEndConfig} />
//             </svg>
//         );
//         const resultForm = logForm.getByTestId("return-form");
//         expect(resultForm).toBeInTheDocument();
//         expect(resultForm).toHaveTextContent("Cancel");
//         expect(resultForm).toHaveTextContent("Save");
//     });

//     it.skip("radio buttons render properly for scope symbols.", async () => {
//         const mockEndConfig: EndConfig = {
//             scopeSymbols: ["a", "b", "c"],
//             expression: "e",
//             type: "Return"
//         };
//         const logForm: RenderResult = render(
//             <svg>
//                 <AddReturnForm onCancel={null} onSave={null} config={mockEndConfig} />
//             </svg>
//         );
//         const resultForm = logForm.getByTestId("return-form");
//         expect(resultForm).toHaveTextContent(DEFINE_RETURN_EXR);
//         expect(resultForm).toHaveTextContent(EXISTING_PROPERTY);
//     });

//     it.skip("radio buttons render denied without scope symbols.", async () => {
//         const mockEndConfig: EndConfig = {
//             scopeSymbols: [],
//             expression: "e",
//             type: "Return"
//         };
//         const logForm: RenderResult = render(
//             <svg>
//                 <AddReturnForm onCancel={null} onSave={null} config={mockEndConfig} />
//             </svg>
//         );
//         const resultForm = logForm.getByTestId("return-form");
//         expect(resultForm).toHaveTextContent("No Items to Select");
//     });
// });
