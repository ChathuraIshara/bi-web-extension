import { ImplicitNewExpression, Visitor } from "@wso2-enterprise/syntax-tree";

export class NewExpressionVisitor implements Visitor {
    private node: any = undefined;

    beginVisitImplicitNewExpression(node: ImplicitNewExpression) {
        this.node = node;
    }

    getNewExpressionNode(): any {
        return this.node;
    }
}
