/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { ClassComponent } from './ClassComponent';
import { Constant } from './Constant';
import { DoStatement } from './DoStatement';
import { End } from "./End";
import { EnumDeclarationComponent } from './Enum';
import { ForEach } from './ForEach';
import { Function } from "./Function";
import { IfElse } from './IfElse';
import { Listener } from './Listener';
import { ModulePartComponent } from "./ModulePart";
import { ModuleVariable } from './ModuleVariable';
import { RecordDefinitionComponent } from "./RecordDefinion";
import { Return } from './Return';
import { Service } from "./Service";
import { Statement } from "./Statement";
import { TypeDefinitionComponent } from './TypeDefinition';
import { While } from './While';
import { Worker } from './WorkerDeclaration';

export { IfElse as IfElseStatement };
export { ForEach as ForeachStatement };
export { Statement as LocalVarDecl };
export { Statement as CallStatement };
export { Statement as ActionStatement };
export { Statement as AssignmentStatement }
export { Listener as ListenerDeclaration };
export { Constant as ConstDeclaration };
export { ModuleVariable as ModuleVarDecl };
export { ModuleVariable as ObjectField };
export { TypeDefinitionComponent as TypeDefinition };
export { Return as ReturnStatement };
export { Function as FunctionDefinition };
export { Function as ResourceAccessorDefinition };
export { Function as ObjectMethodDefinition };
export { ModulePartComponent as ModulePart };
export { While as WhileStatement };
export { ClassComponent as ClassDefinition };
export { EnumDeclarationComponent as EnumDeclaration };
export { Worker as NamedWorkerDeclaration };
export { DoStatement as DoStatement };
