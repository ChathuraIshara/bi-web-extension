/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useEffect } from "react";
import Prism from "prismjs";
import 'prismjs/components/prism-json';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import { themes, GlobalStyle } from "../Styles/styles";

export function FHIROutput({ code, theme }: { code: string; theme: string }) {

  useEffect(() => {
    Prism.highlightAll();
  }, [code, theme]);

  return (
    <div>
      <GlobalStyle theme={themes[theme as keyof typeof themes]}/>
      <div className="line-numbers" key={theme}>
        <pre>
          <code className="language-json">
            {code}
          </code>  
        </pre>
      </div>
    </div>
  );
}
