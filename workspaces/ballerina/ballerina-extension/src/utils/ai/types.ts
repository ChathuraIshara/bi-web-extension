/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

export interface CompletionRequest {
  prefix: string;
  suffix: string;
  maxCompletions?: number;
}

export interface CompletionResponse {
  completion: string;
}

export interface GithubCompletionRequest {
  prompt: string;
  suffix: string;
  n: number;
  max_tokens: number;
  temperature: number;
  top_p: number;
  stop: string[];
  nwo: string;
  stream: boolean;
  extra: {
    language: string;
    next_indent: number;
    trim_by_indentation: boolean;
  };
}

export interface CompletionChoice {
  text: string;
  index: number;
}

export interface CompletionChunk {
  choices: CompletionChoice[];
}
