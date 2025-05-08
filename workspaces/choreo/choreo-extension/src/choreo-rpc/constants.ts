/*
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export enum ErrorCode {
	ParseError = -32700,
	InvalidRequest = -32600,
	MethodNotFound = -32601,
	InvalidParams = -32602,
	InternalError = -32603,
	UnauthorizedError = -32000,
	TokenNotFoundError = -32001,
	InvalidTokenError = -32002,
	ForbiddenError = -32003,
	RefreshTokenError = -32004,
	ComponentNotFound = -32005,
	ProjectNotFound = -32006,
	MaxProjectCountError = -32007,
	RepoAccessNeeded = -32008,
	EpYamlNotFound = -32009,
	UserNotFound = -32010,
	MaxComponentCountError = -32011,
	InvalidSubPath = -32012,
	NoOrgsAvailable = -32013,
}
