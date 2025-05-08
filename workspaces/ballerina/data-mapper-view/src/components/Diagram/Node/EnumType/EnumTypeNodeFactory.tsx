/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
// tslint:disable: jsx-no-multiline-js
import * as React from "react";

import { AbstractReactFactory } from "@projectstorm/react-canvas-core";
import { DiagramEngine } from "@projectstorm/react-diagrams-core";
import { container, injectable, singleton } from "tsyringe";

import { IDataMapperNodeFactory } from "../commons/DataMapperNode";
import { InputSearchNoResultFound, SearchNoResultFoundKind } from "../commons/Search";

import { EnumTypeNode, ENUM_TYPE_SOURCE_NODE_TYPE } from "./EnumTypeNode";
import { EnumTypeTreeWidget } from "./EnumTypeTreeWidget";

@injectable()
@singleton()
export class EnumTypeNodeFactory
    extends AbstractReactFactory<EnumTypeNode, DiagramEngine>
    implements IDataMapperNodeFactory
{
    constructor() {
        super(ENUM_TYPE_SOURCE_NODE_TYPE);
    }

    generateReactWidget(event: { model: EnumTypeNode }): JSX.Element {
        return (
            <>
                {event.model.hasNoMatchingFields ? (
                    <InputSearchNoResultFound kind={SearchNoResultFoundKind.ModuleVariable} />
                ) : (
                    <EnumTypeTreeWidget
                        engine={this.engine}
                        enums={event.model.enumTypeDecls}
                        context={event.model.context}
                        getPort={event.model.getPort.bind(event.model)}
                        handleCollapse={event.model.context.handleCollapse.bind(event.model)}
                    />
                )}
            </>
        );
    }

    generateModel(): EnumTypeNode {
        return undefined;
    }
}

container.register("NodeFactory", { useClass: EnumTypeNodeFactory });
