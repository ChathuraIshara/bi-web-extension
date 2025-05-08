// /**
//  * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//  *
//  * This software is the property of WSO2 LLC. and its suppliers, if any.
//  * Dissemination of any information or reproduction of any material contained
//  * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  * You may not alter or remove any copyright or other notice from copies of this content.
//  */
// import * as React from 'react';

// import { STNode } from '@wso2-enterprise/syntax-tree';

// import { render, RenderResult } from "../../../../../tests/utils/test-utils"
// import { StatementViewState } from '../../view-state';

// import { End } from "./index";

// const node: STNode = {
//     kind: "VariableDef",
//     viewState: new StatementViewState(),
//     source: ""
// };

// if (!node.viewState) {
//     node.viewState.bbox.cx = 0;
//     node.viewState.bbox.cy = 0;
// }

// describe('End test suite', () => {
//     const { getByTestId  } = render(<svg><End model={node}/></svg>);
//     it("renders properly.", async () => {
//         const results = getByTestId("end-block");
//         expect(results).toBeInTheDocument();
//     });
//     it("End text apears correctly.", async () => {
//         const result: RenderResult = render(<svg><End model={node}/></svg>);
//         expect(result.queryByTestId("end-text-block")).toHaveTextContent("END");
//     });
// });
