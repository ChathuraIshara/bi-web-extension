/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import React from 'react';

import { NamedWorkerDeclaration } from '@wso2-enterprise/syntax-tree';

import { BlockViewState } from '../../../ViewState';
import { End } from '../End';
import { WorkerBody } from '../WorkerBody';
import { WorkerLine } from '../WorkerLine';

import './style.scss';
import { WorkerHead } from './WorkerHead';

interface WorkerProps {
    model: NamedWorkerDeclaration;
}

export function Worker(props: WorkerProps) {
    const { model } = props;
    const workerBodyVS: BlockViewState = model.workerBody.viewState as BlockViewState;

    return (
        <g id={`worker-${model.workerName.value}`} className={'worker-body'}>
            <WorkerLine viewState={model.viewState} />
            <WorkerHead model={model} />
            <WorkerBody model={model.workerBody} viewState={workerBodyVS} />
            {!workerBodyVS.isEndComponentAvailable && <End viewState={model.viewState.end} />}
        </g>
    )
}
