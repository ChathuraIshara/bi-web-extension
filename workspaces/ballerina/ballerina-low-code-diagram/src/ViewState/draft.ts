import { BallerinaConnectorInfo } from "@wso2-enterprise/ballerina-core";
import { LocalVarDecl, NodePosition } from "@wso2-enterprise/syntax-tree";

import { StatementViewState } from ".";

export class DraftStatementViewState extends StatementViewState {

    public type: string;
    public subType: string;
    public connector?: BallerinaConnectorInfo;
    public targetPosition: NodePosition;
    public selectedConnector?: LocalVarDecl;

    constructor() {
        super();
    }
}
