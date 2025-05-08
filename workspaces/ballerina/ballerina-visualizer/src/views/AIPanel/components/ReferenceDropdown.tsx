/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React, { useState } from "react";
import styled from "@emotion/styled";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 8px;
`;

const ToggleButton = styled.button`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: auto;
  background: none;
  border: none;
  color: var(--vscode-textLink-foreground);
  font-size: 12px;
  cursor: pointer;
  padding: 4px 0;
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

const LinksContainer = styled.div`
  margin-top: 4px;
  margin-left: 12px;
  padding-left: 4px;
`;

const StyledLink = styled.a`
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
  position: relative;
  margin-left: 20px; 

  &::before {
    content: "•";
    position: absolute;
    left: -20px; 
    top: 50%;
    transform: translateY(-50%);
    color: var(--vscode-editor-foreground);
    font-size: 18px; 
  }
`;

interface ReferenceLinksProps {
  links: string[];
}

const ReferenceLinks: React.FC<ReferenceLinksProps> = ({ links }) => {
  const [open, setOpen] = useState(true);

  const cleanLink = (link: string) => link.replace(/^<|>$/g, "");

  return (
    <Container>
      <ToggleButton onClick={() => setOpen(!open)}>REFERENCES</ToggleButton>
      {open && (
        <LinksContainer>
          {links.map((link, index) => (
            <StyledLink key={index} href={cleanLink(link)} target="_blank" rel="noopener noreferrer">
              {cleanLink(link)}
            </StyledLink>
          ))}
        </LinksContainer>
      )}
    </Container>
  );
};

export default ReferenceLinks;
