/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import type {
	BuildKind,
	BuildPackReq,
	Buildpack,
	CancelApprovalReq,
	CheckWorkflowStatusReq,
	CheckWorkflowStatusResp,
	CommitHistory,
	ComponentDeployment,
	ComponentEP,
	ComponentKind,
	ConnectionDetailed,
	ConnectionListItem,
	CreateBuildReq,
	CreateComponentConnectionReq,
	CreateComponentReq,
	CreateConfigYamlReq,
	CreateDeploymentReq,
	CreateProjectReq,
	CredentialItem,
	DeleteCompReq,
	DeleteConnectionReq,
	DeploymentLogsData,
	DeploymentTrack,
	Environment,
	GetAutoBuildStatusReq,
	GetAutoBuildStatusResp,
	GetBranchesReq,
	GetBuildLogsForTypeReq,
	GetBuildLogsReq,
	GetBuildsReq,
	GetCommitsReq,
	GetComponentEndpointsReq,
	GetComponentItemReq,
	GetComponentsReq,
	GetConnectionGuideReq,
	GetConnectionGuideResp,
	GetConnectionItemReq,
	GetConnectionsReq,
	GetCredentialsReq,
	GetDeploymentStatusReq,
	GetDeploymentTracksReq,
	GetMarketplaceIdlReq,
	GetMarketplaceListReq,
	GetProjectEnvsReq,
	GetProxyDeploymentInfoReq,
	GetSwaggerSpecReq,
	GetTestKeyReq,
	GetTestKeyResp,
	IChoreoRPCClient,
	IsRepoAuthorizedReq,
	IsRepoAuthorizedResp,
	MarketplaceIdlResp,
	MarketplaceListResp,
	Project,
	ProjectBuildLogsData,
	PromoteProxyDeploymentReq,
	ProxyDeploymentInfo,
	RequestPromoteApprovalReq,
	ToggleAutoBuildReq,
	ToggleAutoBuildResp,
	UserInfo,
} from "@wso2-enterprise/choreo-core";
import { type MessageConnection, Trace, type Tracer } from "vscode-jsonrpc";
import { handlerError } from "../error-utils";
import { getLogger } from "../logger/logger";
import { withTimeout } from "../utils";
import { StdioConnection } from "./connection";

export class RPCClient {
	private _conn: MessageConnection | undefined;
	private static _instance: RPCClient;

	private constructor() {}

	async init() {
		getLogger().debug("Activating choreo rpc server");
		if (this._conn) {
			this._conn.dispose();
		}
		const stdioConnection = new StdioConnection();
		this._conn = stdioConnection.getProtocolConnection();
		this._conn.trace(Trace.Verbose, new ChoreoTracer());
		this._conn.listen();

		try {
			// biome-ignore lint/complexity/noBannedTypes:
			const resp = await this._conn.sendRequest<{}>("initialize", {
				clientName: "vscode",
				clientVersion: "1.0.0",
			});
			console.log("Initialized RPC server", resp);
		} catch (e) {
			getLogger().error("failed to initialize rpc client", e);
		}
	}

	static async getInstance(): Promise<RPCClient> {
		if (RPCClient._instance) {
			return RPCClient._instance;
		}

		RPCClient._instance = new RPCClient();
		await RPCClient._instance.init();
		return RPCClient._instance;
	}

	async sendRequest<T>(method: string, params?: any, timeout = 60000, isRetry?: boolean): Promise<T> {
		if (!this._conn) {
			throw new Error("Connection is not initialized");
		}
		try {
			return await withTimeout(() => this._conn!.sendRequest<T>(method, params), method, timeout);
		} catch (e: any) {
			// TODO: have a better way to check if connection is closed
			if ((e.message?.includes("Connection is closed") || e.message?.includes(`Function ${method} timed out`)) && !isRetry) {
				await this.init();
				return this.sendRequest(method, params, timeout, true);
			}
			getLogger().error("Error sending request", e);
			handlerError(e);
			throw e;
		}
	}
}

export class ChoreoRPCClient implements IChoreoRPCClient {
	private client: RPCClient | undefined;

	public constructor() {
		this.init();
	}

	async init() {
		try {
			this.client = await RPCClient.getInstance();
		} catch (e) {
			getLogger().error("Error initializing RPC client", e);
		}
	}

	async createProject(params: CreateProjectReq): Promise<Project> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const resp = await this.client.sendRequest<{ project: Project }>("project/create", params);
		return resp.project;
	}

	async createComponent(params: CreateComponentReq): Promise<ComponentKind> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const resp = await this.client.sendRequest<{ component: ComponentKind }>("component/create", params);
		return resp.component;
	}

	async createComponentConfig(params: CreateConfigYamlReq): Promise<string> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const resp = await this.client.sendRequest<{ configPath: string }>("component/createComponentConfig", params);
		return resp.configPath;
	}

	async deleteComponent(params: DeleteCompReq): Promise<void> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		await this.client.sendRequest("component/delete", params);
	}

	async getProjects(orgID: string): Promise<Project[]> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<{ projects: Project[] }>("project/getProjects", { orgID });
		return response.projects;
	}

	async getComponentItem(params: GetComponentItemReq): Promise<ComponentKind> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<{ component: ComponentKind }>("component/getItem", params);
		return response.component;
	}

	async getComponentList(params: GetComponentsReq): Promise<ComponentKind[]> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<{ components: ComponentKind[] }>("component/getList", params);
		return response.components || [];
	}

	async getBuildPacks(params: BuildPackReq) {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<{ buildPacks: Buildpack[] }>("component/getBuildPacks", params);
		return response.buildPacks;
	}

	async getRepoBranches(params: GetBranchesReq) {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<{ branches: string[] }>("repo/getBranches", params);
		return response.branches;
	}

	async isRepoAuthorized(params: IsRepoAuthorizedReq) {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<IsRepoAuthorizedResp>("repo/isRepoAuthorized", params);
		return response;
	}

	async getCredentials(params: GetCredentialsReq) {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<{ credentials: CredentialItem[] }>("repo/getCredentials", params);
		return response?.credentials;
	}

	async getUserInfo(): Promise<UserInfo> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<{ userInfo: UserInfo; isLoggedIn: boolean }>("auth/getUserInfo");
		return response.userInfo;
	}

	async getSignInUrl(callbackUrl: string): Promise<string | undefined> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<{ loginUrl: string }>("auth/getSignInUrl", { callbackUrl }, 2000);
		return response.loginUrl;
	}

	async signInWithAuthCode(authCode: string, orgId?: string): Promise<UserInfo | undefined> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response = await this.client.sendRequest<{ userInfo: UserInfo }>("auth/signInWithAuthCode", {
			authCode,
			orgId,
		});
		return response.userInfo;
	}

	async signOut(): Promise<void> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		await this.client.sendRequest("auth/signOut", undefined, 2000);
	}

	async changeOrgContext(orgId: string): Promise<void> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		await this.client.sendRequest<{ orgId: string }>("auth/changeOrg", { orgId });
	}

	async createBuild(params: CreateBuildReq): Promise<BuildKind> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { build: BuildKind } = await this.client.sendRequest("build/create", params);
		return response.build;
	}

	async getDeploymentTracks(params: GetDeploymentTracksReq): Promise<DeploymentTrack[]> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { deploymentTracks: DeploymentTrack[] } = await this.client.sendRequest("component/getDeploymentTracks", params);
		return response.deploymentTracks;
	}

	async getBuilds(params: GetBuildsReq): Promise<BuildKind[]> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { builds: BuildKind[] } = await this.client.sendRequest("build/getList", params);
		return response.builds;
	}

	async getCommits(params: GetCommitsReq): Promise<CommitHistory[]> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { commits: CommitHistory[] } = await this.client.sendRequest("component/getCommits", params);
		return response.commits;
	}

	async getEnvs(params: GetProjectEnvsReq): Promise<Environment[]> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { envs: Environment[] } = await this.client.sendRequest("project/getEnvs", params);
		return response.envs;
	}

	async getComponentEndpoints(params: GetComponentEndpointsReq): Promise<ComponentEP[]> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { endpoints: ComponentEP[] } = await this.client.sendRequest("component/getEndpoints", params);
		return response.endpoints;
	}

	async getDeploymentStatus(params: GetDeploymentStatusReq): Promise<ComponentDeployment | null> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { deployment: ComponentDeployment | undefined } | undefined = await this.client.sendRequest(
			"component/getDeploymentStatus",
			params,
		);
		return response?.deployment ?? null;
	}

	async getProxyDeploymentInfo(params: GetProxyDeploymentInfoReq): Promise<ProxyDeploymentInfo | null> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { deploymentInfo: ProxyDeploymentInfo | undefined } | undefined = await this.client.sendRequest(
			"deployment/getProxyDeploymentInfo",
			params,
		);
		return response?.deploymentInfo ?? null;
	}

	async createDeployment(params: CreateDeploymentReq): Promise<void> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		await this.client.sendRequest("deployment/create", params);
	}

	async getBuildLogs(params: GetBuildLogsReq): Promise<DeploymentLogsData> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: any = await this.client.sendRequest("build/logs", params);
		return response.data?.data as DeploymentLogsData;
	}

	async getBuildLogsForType(params: GetBuildLogsForTypeReq): Promise<ProjectBuildLogsData | null> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: any = await this.client.sendRequest("build/getLogsForType", params);
		return response.data ? (response.data as ProjectBuildLogsData) : null;
	}

	async obtainGithubToken(params: { code: string; orgId: string }): Promise<void> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		await this.client.sendRequest("repo/obtainGithubToken", params);
	}

	async getTestKey(params: GetTestKeyReq): Promise<GetTestKeyResp> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: GetTestKeyResp = await this.client.sendRequest("apim/getTestKey", params);
		return response;
	}

	async getSwaggerSpec(params: GetSwaggerSpecReq): Promise<object> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { swagger: object } = await this.client.sendRequest("apim/getSwaggerSpec", params);
		return response.swagger;
	}

	async getMarketplaceItems(params: GetMarketplaceListReq): Promise<MarketplaceListResp> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: MarketplaceListResp = await this.client.sendRequest("connections/getMarketplaceItems", params);
		return response;
	}

	async getMarketplaceIdl(params: GetMarketplaceIdlReq): Promise<MarketplaceIdlResp> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: MarketplaceIdlResp = await this.client.sendRequest("connections/getMarketplaceItemIdl", params);
		return response;
	}

	async getConnections(params: GetConnectionsReq): Promise<ConnectionListItem[]> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: ConnectionListItem[] = await this.client.sendRequest("connections/getConnections", params);
		return response;
	}

	async getConnectionItem(params: GetConnectionItemReq): Promise<ConnectionListItem> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: ConnectionListItem = await this.client.sendRequest("connections/getConnectionItem", params);
		return response;
	}

	async createComponentConnection(params: CreateComponentConnectionReq): Promise<ConnectionDetailed> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: ConnectionDetailed = await this.client.sendRequest("connections/createComponentConnection", params);
		return response;
	}

	async deleteConnection(params: DeleteConnectionReq): Promise<void> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		await this.client.sendRequest("connections/deleteConnection", params);
	}

	async getConnectionGuide(params: GetConnectionGuideReq): Promise<GetConnectionGuideResp> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: GetConnectionGuideResp = await this.client.sendRequest("connections/getGuide", params);
		return response;
	}

	async getAutoBuildStatus(params: GetAutoBuildStatusReq): Promise<GetAutoBuildStatusResp> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: GetAutoBuildStatusResp = await this.client.sendRequest("build/getAutoBuildStatus", params);
		return response;
	}

	async enableAutoBuildOnCommit(params: ToggleAutoBuildReq): Promise<ToggleAutoBuildResp> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: ToggleAutoBuildResp = await this.client.sendRequest("build/enableAutoBuild", params);
		return response;
	}

	async disableAutoBuildOnCommit(params: ToggleAutoBuildReq): Promise<ToggleAutoBuildResp> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: ToggleAutoBuildResp = await this.client.sendRequest("build/disableAutoBuild", params);
		return response;
	}

	async checkWorkflowStatus(params: CheckWorkflowStatusReq): Promise<CheckWorkflowStatusResp> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		const response: { data: CheckWorkflowStatusResp } = await this.client.sendRequest("deployment/checkWorkflowStatus", params);
		return response?.data;
	}

	async cancelApprovalRequest(params: CancelApprovalReq): Promise<void> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		await this.client.sendRequest("deployment/cancelApprovalRequest", params);
	}

	async requestPromoteApproval(params: RequestPromoteApprovalReq): Promise<void> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		await this.client.sendRequest("deployment/requestPromoteApproval", params);
	}

	async promoteProxyDeployment(params: PromoteProxyDeploymentReq): Promise<void> {
		if (!this.client) {
			throw new Error("RPC client is not initialized");
		}
		await this.client.sendRequest("deployment/promoteProxy", params);
	}
}

export class ChoreoTracer implements Tracer {
	log(dataObject: any): void {
		console.log(dataObject);
	}
}
