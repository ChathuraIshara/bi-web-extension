/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
	ChoreoRpcCancelWorkflowApproval,
	ChoreoRpcCheckWorkflowStatus,
	ChoreoRpcCreateBuildRequest,
	ChoreoRpcCreateComponentConnection,
	ChoreoRpcCreateComponentRequest,
	ChoreoRpcCreateDeploymentRequest,
	ChoreoRpcCreateProjectRequest,
	ChoreoRpcDeleteComponentRequest,
	ChoreoRpcDeleteConnection,
	ChoreoRpcDisableAutoBuild,
	ChoreoRpcEnableAutoBuild,
	ChoreoRpcGetAutoBuildStatus,
	ChoreoRpcGetBranchesRequest,
	ChoreoRpcGetBuildLogs,
	ChoreoRpcGetBuildLogsForType,
	ChoreoRpcGetBuildPacksRequest,
	ChoreoRpcGetBuildsRequest,
	ChoreoRpcGetCommitsRequest,
	ChoreoRpcGetComponentItemRequest,
	ChoreoRpcGetComponentsRequest,
	ChoreoRpcGetConnectionGuide,
	ChoreoRpcGetConnectionItem,
	ChoreoRpcGetConnections,
	ChoreoRpcGetCredentialsRequest,
	ChoreoRpcGetDeploymentStatusRequest,
	ChoreoRpcGetDeploymentTracksRequest,
	ChoreoRpcGetEndpointsRequest,
	ChoreoRpcGetEnvsRequest,
	ChoreoRpcGetMarketplaceItemIdl,
	ChoreoRpcGetMarketplaceItems,
	ChoreoRpcGetProjectsRequest,
	ChoreoRpcGetProxyDeploymentInfo,
	ChoreoRpcGetSwaggerRequest,
	ChoreoRpcGetTestKeyRequest,
	ChoreoRpcIsRepoAuthorizedRequest,
	ChoreoRpcPromoteProxyDeployment,
	ChoreoRpcRequestPromoteApproval,
	type IChoreoRPCClient,
} from "@wso2-enterprise/choreo-core";
import { ProgressLocation, window } from "vscode";
import type { Messenger } from "vscode-messenger";

export function registerChoreoRpcResolver(messenger: Messenger, rpcClient: IChoreoRPCClient) {
	messenger.onRequest(ChoreoRpcGetProjectsRequest, (orgID) => rpcClient.getProjects(orgID));
	messenger.onRequest(ChoreoRpcGetComponentItemRequest, (params) => rpcClient.getComponentItem(params));
	messenger.onRequest(ChoreoRpcGetComponentsRequest, (params) => rpcClient.getComponentList(params));
	messenger.onRequest(ChoreoRpcCreateProjectRequest, async (params) => {
		return window.withProgress({ title: `Creating project ${params.projectName}`, location: ProgressLocation.Notification }, () =>
			rpcClient.createProject(params),
		);
	});
	messenger.onRequest(ChoreoRpcCreateComponentRequest, async (params) => {
		return window.withProgress({ title: `Creating component ${params.name}...`, location: ProgressLocation.Notification }, () =>
			rpcClient.createComponent(params),
		);
	});
	messenger.onRequest(ChoreoRpcGetBuildPacksRequest, (params) => rpcClient.getBuildPacks(params));
	messenger.onRequest(ChoreoRpcGetBranchesRequest, (params) => rpcClient.getRepoBranches(params));
	messenger.onRequest(ChoreoRpcIsRepoAuthorizedRequest, (params) => rpcClient.isRepoAuthorized(params));
	messenger.onRequest(ChoreoRpcGetCredentialsRequest, (params) => rpcClient.getCredentials(params));
	messenger.onRequest(ChoreoRpcDeleteComponentRequest, async (params) => {
		return window.withProgress({ title: `Deleting component ${params.componentName}...`, location: ProgressLocation.Notification }, () =>
			rpcClient.deleteComponent(params),
		);
	});
	messenger.onRequest(ChoreoRpcCreateBuildRequest, async (params) => {
		return window.withProgress({ title: `Triggering build for ${params.componentName}...`, location: ProgressLocation.Notification }, () =>
			rpcClient.createBuild(params),
		);
	});
	messenger.onRequest(ChoreoRpcGetDeploymentTracksRequest, (params) => rpcClient.getDeploymentTracks(params));
	messenger.onRequest(ChoreoRpcGetBuildsRequest, (params) => rpcClient.getBuilds(params));
	messenger.onRequest(ChoreoRpcGetCommitsRequest, (params) => rpcClient.getCommits(params));
	messenger.onRequest(ChoreoRpcGetEnvsRequest, (params) => rpcClient.getEnvs(params));
	messenger.onRequest(ChoreoRpcGetEndpointsRequest, (params) => rpcClient.getComponentEndpoints(params));
	messenger.onRequest(ChoreoRpcGetDeploymentStatusRequest, (params) => rpcClient.getDeploymentStatus(params));
	messenger.onRequest(ChoreoRpcGetProxyDeploymentInfo, (params) => rpcClient.getProxyDeploymentInfo(params));
	messenger.onRequest(ChoreoRpcCreateDeploymentRequest, async (params) => {
		return window.withProgress(
			{ title: `Deploying component ${params.componentName} in ${params.envName} environment...`, location: ProgressLocation.Notification },
			() => rpcClient.createDeployment(params),
		);
	});
	messenger.onRequest(ChoreoRpcGetTestKeyRequest, (params) => rpcClient.getTestKey(params));
	messenger.onRequest(ChoreoRpcGetSwaggerRequest, (params) => rpcClient.getSwaggerSpec(params));
	messenger.onRequest(ChoreoRpcGetMarketplaceItems, (params) => rpcClient.getMarketplaceItems(params));
	messenger.onRequest(ChoreoRpcGetMarketplaceItemIdl, (params) => rpcClient.getMarketplaceIdl(params));
	messenger.onRequest(ChoreoRpcGetConnections, (params) => rpcClient.getConnections(params));
	messenger.onRequest(ChoreoRpcGetConnectionItem, (params) => rpcClient.getConnectionItem(params));
	messenger.onRequest(ChoreoRpcCreateComponentConnection, async (params) => {
		return window.withProgress({ title: `Creating connection ${params.name}...`, location: ProgressLocation.Notification }, () =>
			rpcClient.createComponentConnection(params),
		);
	});
	messenger.onRequest(ChoreoRpcDeleteConnection, async (params) => {
		return window.withProgress({ title: `Deleting connection ${params.connectionName}...`, location: ProgressLocation.Notification }, () =>
			rpcClient.deleteConnection(params),
		);
	});
	messenger.onRequest(ChoreoRpcGetConnectionGuide, (params) => rpcClient.getConnectionGuide(params));
	messenger.onRequest(ChoreoRpcGetAutoBuildStatus, (params) => rpcClient.getAutoBuildStatus(params));
	messenger.onRequest(ChoreoRpcEnableAutoBuild, (params) => rpcClient.enableAutoBuildOnCommit(params));
	messenger.onRequest(ChoreoRpcDisableAutoBuild, (params) => rpcClient.disableAutoBuildOnCommit(params));
	messenger.onRequest(ChoreoRpcGetBuildLogs, (params) => rpcClient.getBuildLogs(params));
	messenger.onRequest(ChoreoRpcGetBuildLogsForType, (params) => rpcClient.getBuildLogsForType(params));
	messenger.onRequest(ChoreoRpcCheckWorkflowStatus, (params) => rpcClient.checkWorkflowStatus(params));
	messenger.onRequest(ChoreoRpcCancelWorkflowApproval, async (params) => {
		return window.withProgress({ title: "Cancelling approval request...", location: ProgressLocation.Notification }, () =>
			rpcClient.cancelApprovalRequest(params),
		);
	});
	messenger.onRequest(ChoreoRpcRequestPromoteApproval, async (params) => {
		return window.withProgress(
			{ title: `Requesting approval to promote to ${params.envName} environment...`, location: ProgressLocation.Notification },
			() => rpcClient.requestPromoteApproval(params),
		);
	});
	messenger.onRequest(ChoreoRpcPromoteProxyDeployment, async (params) => {
		return window.withProgress({ title: "Promoting proxy deployment...", location: ProgressLocation.Notification }, () =>
			rpcClient.promoteProxyDeployment(params),
		);
	});
}
