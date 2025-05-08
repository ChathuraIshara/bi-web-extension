/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { ModuleIcon } from "@wso2-enterprise/ballerina-low-code-diagram";

import useStyles from "./style";
import { BallerinaConstruct } from "@wso2-enterprise/ballerina-core";
import { Tooltip } from "@wso2-enterprise/ui-toolkit";

export interface ModuleCardProps {
    onSelectModule: (balModule: BallerinaConstruct) => void;
    module: BallerinaConstruct;
    columns?: number;
}
export const MAX_COLUMN_WIDTH = '155px';

function ModuleCard(this: any, props: ModuleCardProps) {
    const classes = useStyles();
    const { module, columns, onSelectModule } = props;
    const moduleName = (module.displayAnnotation?.label || `${module.package?.name} / ${module.name}`).replace(/["']/g, "");
    return (
        <div className={classes.balModule} onClick={onSelectModule.bind(this, module)}>
            <div>
                <ModuleIcon module={module} scale={0.9} />
            </div>
            <Tooltip content={`${module.package?.organization} / ${module.moduleName} : ${module.package?.version}`}>
                <div className={classes.balModuleName}>{moduleName}</div>
            </Tooltip>
            <div className={classes.orgName}>by {module.package.organization}</div>
        </div>
    );
}

export default ModuleCard;
