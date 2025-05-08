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
// import { FormField } from "../../../../../../ConfigurationSpec/types";

// import { Array } from "./index";

// describe('Array element test suite', () => {
//     it("renders properly.", async () => {
//         const mockFormField: FormField = {
//             type: "string",
//             name: "name",
//             collectionDataType: "string"
//         };
//         const form: RenderResult = render(
//             <svg>
//                 <Array model={mockFormField} />
//             </svg>
//         );
//         const resultForm = form.getByTestId("array");
//         expect(resultForm).toBeInTheDocument();
//     });

//     it("renders string type array properly.", async () => {
//         const mockFormField: FormField = {
//             type: "string",
//             name: "name",
//             collectionDataType: "string"
//         };
//         const form: RenderResult = render(
//             <svg>
//                 <Array model={mockFormField} />
//             </svg>
//         );
//         const resultFormArray = form.getByText("Add Value");
//     });

//     it("renders json type array properly.", async () => {
//         const mockFormField: FormField = {
//             type: "json",
//             name: "name",
//             collectionDataType: "json"
//         };
//         const form: RenderResult = render(
//             <svg>
//                 <Array model={mockFormField} />
//             </svg>
//         );
//         const resultFormArray = form.getByTestId("ison-add-btn");
//         expect(resultFormArray).toHaveTextContent("Add");
//     });
// });
