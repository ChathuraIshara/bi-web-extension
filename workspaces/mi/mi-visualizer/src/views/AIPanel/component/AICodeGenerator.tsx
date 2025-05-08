/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { useRef, useState, useEffect } from "react";
import { useMICopilotContext } from "./MICopilotContext";
import { WelcomeMessage } from './WelcomeMessage';
import AIChatHeader from './AIChatHeader';
import AIChatFooter from './AIChatFooter';
import AIChatMessage from './AIChatMessage';
import { AIChatView } from '../styles';


/**
 * Main chat component with integrated MICopilot Context provider
 */
export function AICodeGenerator() {
  const { conversations } = useMICopilotContext();
  const [isAtBottom, setIsAtBottom] = useState(true);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if the chat is scrolled to the bottom
  useEffect(() => {
      const container = mainContainerRef.current;
      if (container) {
          const handleScroll = () => {
              const { scrollTop, scrollHeight, clientHeight } = container;
              if (scrollHeight - scrollTop <= clientHeight + 50) {
                  setIsAtBottom(true);
              } else {
                  setIsAtBottom(false);
              }
          };

          container.addEventListener("scroll", handleScroll);
          return () => {
              container.removeEventListener("scroll", handleScroll);
          };
      }
  }, []);

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
      if (isAtBottom && messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
  }, [conversations, isAtBottom]);

  return (
          <AIChatView>
              <AIChatHeader />

              <main style={{ flex: 1, overflowY: "auto" }} ref={mainContainerRef}>
                  {Array.isArray(conversations) && conversations.length === 0 && <WelcomeMessage />}

                  {Array.isArray(conversations) && conversations.map((message, index) => (
                      <AIChatMessage key={index} message={message} index={index} />
                  ))}

                  <div ref={messagesEndRef} />
              </main>

              <AIChatFooter />
          </AIChatView>
  );
}

export default AICodeGenerator;
