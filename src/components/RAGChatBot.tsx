"use client";

import {
  CheckIcon,
  GlobeIcon,
  Trash2Icon,
  BrainCog,
  Maximize2,
  Minimize2,
  X
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { memo, useCallback, useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Attachment,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "@/components/ai-elements/attachments";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  usePromptInputAttachments,
} from "@/components/ai-elements/prompt-input";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageLabel,
  MessageLabelText,
  MessageResponse,
} from "@/components/ai-elements/message";

const models = [
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "openai/gpt-4.1-mini",
    name: "GPT-4.1 Mini",
    providers: ["openai"],
  },
  {
    chef: "DeepSeek",
    chefSlug: "deepseek",
    id: "deepseek/deepseek-v4",
    name: "DeepSeek V4 Pro",
    providers: ["deepseek"],
  },
  {
    chef: "Google",
    chefSlug: "google",
    id: "google/gemini-3-flash",
    name: "Gemini 3.0 Flash",
    providers: ["google"],
  },
  {
    chef: "xAI",
    chefSlug: "xai",
    id: "xai/grok-4.3",
    name: "Grok 4.3",
    providers: ["xai"],
  },
];

const chefs = Array.from(new Set(models.map((m) => m.chef)));



// Memoized model selector item component
const ModelItem = memo(
  ({
    m,
    selectedModel,
    onSelect,
  }: {
    m: (typeof models)[0];
    selectedModel: string;
    onSelect: (id: string) => void;
  }) => {
    const handleSelect = useCallback(() => onSelect(m.id), [onSelect, m.id]);
    return (
      <ModelSelectorItem key={m.id} onSelect={handleSelect} value={m.id}>
        <ModelSelectorLogo provider={m.chefSlug} />
        <ModelSelectorName>{m.name}</ModelSelectorName>
        <ModelSelectorLogoGroup>
          {m.providers.map((provider) => (
            <ModelSelectorLogo key={provider} provider={provider} />
          ))}
        </ModelSelectorLogoGroup>
        {selectedModel === m.id ? (
          <CheckIcon className="ml-auto size-4" />
        ) : (
          <div className="ml-auto size-4" />
        )}
      </ModelSelectorItem>
    );
  },
);
ModelItem.displayName = "ModelItem";

const PromptInputAttachmentsDisplay = () => {
  const attachments = usePromptInputAttachments();
  if (attachments.files.length === 0) return null;

  return (
    <Attachments variant="inline">
      {attachments.files.map((attachment) => (
        <Attachment
          data={attachment}
          key={attachment.id}
          onRemove={() => attachments.remove(attachment.id)}
        >
          <AttachmentPreview />
          <AttachmentRemove />
        </Attachment>
      ))}
    </Attachments>
  );
};

interface RAGChatBotProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  onClose?: () => void;
}

const RAGChatBot = ({ isExpanded, onToggleExpand, onClose }: RAGChatBotProps) => {
  const [text, setText] = useState<string>("");
  const [model, setModel] = useState<string>(models[0].id);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false);

  const { messages, status, sendMessage, setMessages } = useChat();
  const t = useTranslations("voiceAgent");

  const selectedModelData = models.find((m) => m.id === model);

  const handleModelSelect = useCallback((id: string) => {
    setModel(id);
    setModelSelectorOpen(false);
  }, []);

  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text) return;

    sendMessage(
      {
        text: message.text,
      },
      {
        body: {
          model: model,
          webSearch: useWebSearch,
        },
      },
    );
    setText("");
  };

  return (
    <div className="relative size-full rounded-2xl border bg-card/80 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden">
      {/* Unified Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
            <BrainCog size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-foreground/90 uppercase">
              {t("title")}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  status === "streaming"
                    ? "bg-emerald-500 animate-pulse"
                    : "bg-green-500",
                )}
              />
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                {status === "streaming" ? "Processing..." : "Ready"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-all"
            onClick={onToggleExpand}
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-all"
            onClick={() => setMessages([])}
            title="Clear Chat"
          >
            <Trash2Icon size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-foreground/10 hover:text-foreground transition-all"
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </Button>
        </div>
      </div>

      <Conversation
        className="flex-1 overflow-y-auto min-h-0 p-4 scrollbar-thin"
        data-lenis-prevent
      >
        <ConversationContent className="gap-6">
          {messages.map((message) => (
            <Message
              from={message.role}
              key={message.id}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <MessageLabel>
                <MessageLabelText className="opacity-70">
                  {message.role === "user"
                    ? t("labelUser")
                    : t("labelAssistant")}
                </MessageLabelText>
              </MessageLabel>
              <MessageContent
                className={cn(
                  "shadow-sm border",
                  message.role === "user"
                    ? "border-primary/20 bg-primary/5"
                    : "border-muted bg-muted/20",
                )}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return (
                      <MessageResponse key={`${message.id}-${i}`}>
                        {part.text}
                      </MessageResponse>
                    );
                  }
                  return null;
                })}
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="p-4 border-t bg-card/30 backdrop-blur-sm">
        <PromptInput onSubmit={handleSubmit} globalDrop multiple>
          <PromptInputHeader>
            <PromptInputAttachmentsDisplay />
          </PromptInputHeader>
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              placeholder="Ask me anything..."
              className="bg-transparent border-none focus-visible:ring-0 min-h-[60px]"
            />
          </PromptInputBody>
          <PromptInputFooter className="flex items-center justify-between pt-2">
            <PromptInputTools className="flex gap-2">
              <PromptInputButton
                onClick={() => setUseWebSearch(!useWebSearch)}
                variant={useWebSearch ? "default" : "outline"}
                className="h-8 rounded-full text-[11px] font-bold uppercase tracking-wider"
              >
                <GlobeIcon size={14} className="mr-1.5" />
                <span>Search</span>
              </PromptInputButton>

              <ModelSelector
                onOpenChange={setModelSelectorOpen}
                open={modelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <PromptInputButton
                    variant="outline"
                    className="h-8 rounded-full text-[11px] font-bold uppercase tracking-wider"
                  >
                    {selectedModelData?.chefSlug && (
                      <ModelSelectorLogo
                        provider={selectedModelData.chefSlug}
                        className="mr-1.5 size-3.5"
                      />
                    )}
                    <ModelSelectorName>
                      {selectedModelData?.name || "Model"}
                    </ModelSelectorName>
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent className="z-[100]">
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {chefs.map((chef) => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {models
                          .filter((m) => m.chef === chef)
                          .map((m) => (
                            <ModelItem
                              key={m.id}
                              m={m}
                              onSelect={handleModelSelect}
                              selectedModel={model}
                            />
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={!text && status !== "ready"}
              status={status}
              className="rounded-full size-9 shrink-0 shadow-lg shadow-primary/20"
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default RAGChatBot;
