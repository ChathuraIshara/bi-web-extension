/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { render } from "mustache";

export interface GetClassTemplatesArgs {
    name: string;
    package: string;
}

export function getClassMustacheTemplate() {
    return `package {{package}};

import org.apache.synapse.MessageContext; 
import org.apache.synapse.mediators.AbstractMediator;
    
public class {{className}} extends AbstractMediator { 

    public boolean mediate(MessageContext context) { 
        // TODO Implement your mediation logic here 
        return true;
    }
}
`;
}

export function getClassMediatorContent(data: GetClassTemplatesArgs) {
    return render(getClassMustacheTemplate(), { package: data.package, className: data.name });
}
