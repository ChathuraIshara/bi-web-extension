/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { StatusMessage } from "./StyledComp";
import { Codicon, Button } from "@wso2-enterprise/ui-toolkit";
import { RpcClient } from "@wso2-enterprise/fhir-tools-rpc-client/lib/RpcClient";

export function Retry({
  errorMessage,
  rpcClient,
}: {
  errorMessage: string;
  rpcClient: RpcClient;
}) {
  const reTry = () => {
    console.log("Retrying the conversion. Button clicked.");
    rpcClient.getWebviewRpcClient().retry();
  };

  return (
    <StatusMessage style={{ flexDirection: "column" }}>
      <div style={{ flexDirection: "row", justifyContent: "space-between"}}>
        <div>
          <Codicon
            name="flame"
            sx={{color: "red", marginRight: 10, padding: 2}}
            iconSx={{fontSize: "80px"}}
          />
        </div>
        <div
          style={{
            fontSize: "80px",
            fontWeight: "400"
          }}
        >
          Oops!
        </div>
      </div>
      <div>Error: {errorMessage}</div>

      <Button onClick={reTry} appearance="primary" tooltip="Refresh">
        <Codicon
          name="refresh"
          sx={{ marginRight: 5, padding: 2 }}
          onClick={reTry}
        />
        Retry
      </Button>
    </StatusMessage>
  );
}
