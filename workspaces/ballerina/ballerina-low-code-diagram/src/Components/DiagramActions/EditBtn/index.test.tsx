// /**
//  * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
//  *
//  * This software is the property of WSO2 LLC. and its suppliers, if any.
//  * Dissemination of any information or reproduction of any material contained
//  * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
//  * You may not alter or remove any copyright or other notice from copies of this content.
//  */
// import * as React from 'react';

// import { fireEvent, render, RenderResult } from "../../../../../../tests/utils/test-utils"

// import { EditBtn } from "./index";

// describe('editBtn button test suit', () => {
//     let editBtn: RenderResult;
//     let editBtnNode: HTMLElement[];

//     beforeEach(() => {
//         editBtn = render(
//             <svg>
//                 <EditBtn
//                     cx={100}
//                     cy={100}
//                     model={null}
//                 />
//             </svg>
//         );
//         editBtnNode = editBtn.getAllByTestId("editBtn");
//     });

//     it("Edit button renders properly", async () => {
//         expect(editBtnNode[0]).toBeInTheDocument();
//     });

//     it("Edit button on is on", async () => {
//         expect(editBtnNode[0].classList[0]).toEqual("edit-icon-wrapper");
//         fireEvent.mouseLeave(editBtnNode[0]);
//     });

// });
