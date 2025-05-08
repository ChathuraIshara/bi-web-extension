/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { RefComponent } from "./RefComponent";

// const RefComponentMenuStrory = () => {
//     const [values, setValues] = useState<string[]>([]);

//     const onChangeValues = (values: string[]) => {
//         setValues(values);
//     };

//     return (
//         <RefComponentMenu
//             onChange={onChangeValues}
//         />
//     );
// };
// storiesOf("RefComponentMenuStrory").add("RefComponent Menu Strory", () => <RefComponentMenu />);
export default {
    component: RefComponent,
    title: 'New Add RefComponent',
};

export const RefComponentMenuStory = () => {
    return (
        <RefComponent
            onChange={() => {}}
        />
    );
};
