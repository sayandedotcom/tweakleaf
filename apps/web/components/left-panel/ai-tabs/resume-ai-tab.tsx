"use client";

import {
  Chat,
  ChatContainer,
  ChatForm,
  ChatMessages,
} from "@/components/ui/chat";
import { type Message } from "@/components/ui/chat-message";
import { MessageList } from "@/components/ui/message-list";
import { PromptSuggestions } from "@/components/ui/prompt-suggestions";
import { MessageInput } from "@/components/ui/message-input";

export default function ResumeTab() {
  const messages: Message[] = [];
  const input = "";
  const handleInputChange = () => {};
  const handleSubmit = () => {};
  const stop = () => {};
  const append = () => {};

  const isLoading = status === "submitted" || status === "streaming";

  const lastMessage = messages.at(-1);
  const isEmpty = messages.length === 0;
  const isTyping = lastMessage?.role === "user";

  return (
    <ChatContainer className="flex flex-col h-full p-2.5">
      {isEmpty ? (
        <PromptSuggestions
          label="Suggestions"
          append={append}
          suggestions={["Start generating the resume !"]}
        />
      ) : null}

      {!isEmpty ? (
        <ChatMessages messages={messages}>
          <MessageList messages={messages} isTyping={isTyping} />
        </ChatMessages>
      ) : null}

      <ChatForm
        className="mt-auto"
        isPending={isLoading || isTyping}
        handleSubmit={handleSubmit}
      >
        {({ files, setFiles }) => (
          <MessageInput
            value={input}
            onChange={handleInputChange}
            allowAttachments
            files={files}
            setFiles={setFiles}
            stop={stop}
            isGenerating={isLoading}
          />
        )}
      </ChatForm>
    </ChatContainer>
  );
}
