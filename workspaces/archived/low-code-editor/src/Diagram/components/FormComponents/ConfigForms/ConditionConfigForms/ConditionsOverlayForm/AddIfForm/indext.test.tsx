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
// import { ConditionConfig } from "../../../../Portals/ConfigForm/types";

// import { AddIfForm, DEFINE_CONDITION, EXISTING_PROPERTY } from "./index";

// describe('If form test suite', () => {
//     it("renders properly.", async () => {
//         const mockConditionConfig: ConditionConfig = {
//             scopeSymbols: ["a", "b", "c"],
//             conditionExpression: "",
//             type: "If"
//         };
//         const form: RenderResult = render(
//             <svg>
//                 <AddIfForm
//                     onCancel={null}
//                     onSave={null}
//                     condition={mockConditionConfig}
//                 />
//             </svg>
//         );
//         const resultForm = form.getByTestId("if-form");
//         expect(resultForm).toBeInTheDocument();
//         expect(resultForm).toHaveTextContent("Cancel");
//         expect(resultForm).toHaveTextContent("Save");
//     });
// });
