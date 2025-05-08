/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export const API_DOCS_DRIFT_CHECK_TYPE = "CODE_AND_APIDOCS";
export const PROJECT_DOCUMENTATION_DRIFT_CHECK_TYPE = "CODE_AND_DOCUMENTATION";
export const API_DOCS_DRIFT_CHECK_ENDPOINT = `/driftcheck?driftType=${API_DOCS_DRIFT_CHECK_TYPE}`;
export const PROJECT_DOCUMENTATION_DRIFT_CHECK_ENDPOINT = `/driftcheck?driftType=${PROJECT_DOCUMENTATION_DRIFT_CHECK_TYPE}`;
export const DEVELOPER_OVERVIEW_FILENAME = "developer.md";
export const NATURAL_PROGRAMMING_PATH = "natural-programming";
export const DEVELOPER_OVERVIEW_RELATIVE_PATH = `${NATURAL_PROGRAMMING_PATH}/${DEVELOPER_OVERVIEW_FILENAME}`;
export const REQUIREMENT_DOC_PREFIX = "requirements.";
export const REQUIREMENT_TEXT_DOCUMENT = `${REQUIREMENT_DOC_PREFIX}txt`;
export const REQUIREMENT_MD_DOCUMENT = `${REQUIREMENT_DOC_PREFIX}md`;
export const README_FILE_NAME_LOWERCASE = "readme.md";
export const COMMAND_SHOW_TEXT = "extension.showTextOptions";
export const DRIFT_DIAGNOSTIC_ID = "NLE001";
export const PROGRESS_BAR_MESSAGE_FOR_DRIFT = "Checking the drift between code and documentation...";
export const PROGRESS_BAR_MESSAGE_FOR_NP_TOKEN = "Fetching and saving access token for natural functions";
export const WARNING_MESSAGE = "You need to sign up for Ballerina Copilot to detect drift between code and documentation.";
export const WARNING_MESSAGE_DEFAULT = "Failed to detect drift between code and documentation. Please try again";
export const LACK_OF_API_DOCUMENTATION_WARNING = "lacks api documentation";
export const DOES_NOT_HAVE_ANY_API_DOCUMENTATION = "does not have any api documentation";
export const NO_DOCUMENTATION_WARNING = "no documentation found";
export const MISSING_README_FILE_WARNING = "missing readme";
export const README_DOCUMENTATION_IS_MISSING = "readme documentation is missing";
export const MISSING_REQUIREMENT_FILE = "requirement specification is missing";
export const MISSING_API_DOCS = "missing api documentation";
export const API_DOCUMENTATION_IS_MISSING = "api documentation is missing";
export const MONITERED_EXTENSIONS = [
    ".bal", ".md", ".txt", ".pdf", ".docx"
];
export const CONFIG_FILE_NAME = "Config.toml";
export const DEFAULT_MODULE = "DEFAULT_MODULE";
export const ERROR_NO_BALLERINA_SOURCES = "No Ballerina sources";
