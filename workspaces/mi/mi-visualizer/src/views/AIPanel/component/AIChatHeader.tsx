/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";
import { Button, Codicon } from "@wso2-enterprise/ui-toolkit";
import { Badge, Header, HeaderButtons, ResetsInBadge } from '../styles';
import { useMICopilotContext } from "./MICopilotContext";

/**
 * Header component for the chat interface
 * Shows token information and action buttons
 */
const AIChatHeader: React.FC = () => {
  const { rpcClient, setChatClearEventTriggered, tokenInfo, chatClearEventTriggered, backendRequestTriggered} = useMICopilotContext();

  const handleLogout = async () => {
    await rpcClient?.getMiDiagramRpcClient().logoutFromMIAccount();
  };

  const isLoading = chatClearEventTriggered || backendRequestTriggered;

  return (
      <Header>
          <Badge>
              Remaining Free Usage:{" "}
              {tokenInfo.remainingPercentage === -1
                  ? "Unlimited"
                  : tokenInfo.isLessThanOne
                  ? "<1%"
                  : `${tokenInfo.remainingPercentage}%`}
              <br />
              <ResetsInBadge>
                  {tokenInfo.remainingPercentage !== -1 &&
                      `Resets in: ${
                          tokenInfo.timeToReset < 1 ? "< 1 day" : `${Math.round(tokenInfo.timeToReset)} days`
                      }`}
              </ResetsInBadge>
          </Badge>
          <HeaderButtons>
              <Button
                  appearance="icon"
                  onClick={() => setChatClearEventTriggered(true)}
                  tooltip="Clear Chat"
                  disabled={isLoading}
              >
                  <Codicon name="clear-all" />
                  &nbsp;&nbsp;Clear
              </Button>
              <Button appearance="icon" onClick={handleLogout} tooltip="Logout" disabled={isLoading}>
                  <Codicon name="sign-out" />
                  &nbsp;&nbsp;Logout
              </Button>
          </HeaderButtons>
      </Header>
  );
};

export default AIChatHeader;
