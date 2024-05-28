<script>
  // COMPONENTS
  import MessageScrollArea from './MessageScrollArea/MessageScrollArea.svelte';

  // SHADCN
  import CornerDownLeft from 'lucide-svelte/icons/corner-down-left';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Select from '$lib/components/ui/select';

  export let sendMessage;
  export let deleteMessage;
  export let chatMessages;
  export let chatroom;
  export let appendOlderMessages;

  let textMessage = '';
  let textareaRef;

  function handleKeyDown(event) {
    if (event.shiftKey) return;
    if (event.key === 'Enter') {
      sendMessage(textMessage);

      setTimeout(() => {
        textMessage = '';
      }, 1);
    }
  }

  function annotateTextMsgWLLM(llm) {
    if (textMessage.startsWith('@')) {
      textMessage = textMessage
        .split(' ')
        .filter((word) => !word.startsWith('@'))
        .join(' ');
    }
    textMessage = llm + ' ' + textMessage;
    textareaRef.focus();
  }
</script>

<div
  class="bg-muted/50 relative flex min-h-[80dvh] flex-col rounded-xl p-4 lg:col-span-2"
>
  <div class="flex-1">
    <MessageScrollArea
      {appendOlderMessages}
      chatMessages={chatMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )}
      {deleteMessage}
      {chatroom}
    />
  </div>
  <form
    class="bg-background focus-within:ring-ring relative overflow-hidden rounded-lg border focus-within:ring-1"
  >
    <Select.Root>
      <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="Choose LLM to prompt" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item
          value="gpt"
          on:click={() => {
            annotateTextMsgWLLM('@gpt');
          }}>ChatGPT</Select.Item
        >
        <Select.Item
          value="claude"
          on:click={() => {
            annotateTextMsgWLLM('@claude');
          }}>Claude 3 Haiku</Select.Item
        >
      </Select.Content>
    </Select.Root>
    <Label for="message" class="sr-only">Message</Label>
    <Textarea
      bind:textareaRef
      id="message"
      placeholder="Type your message here..."
      class="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
      bind:value={textMessage}
      on:keydown={handleKeyDown}
    />
    <div class="flex items-center p-3 pt-0">
      <Button
        type="button"
        size="sm"
        class="ml-auto gap-1.5"
        on:click={() => {
          sendMessage(textMessage);
          textMessage = '';
        }}
      >
        {textMessage.startsWith('@')
          ? `Prompt ${textMessage.split(' ')[0].substring(1)}`
          : 'Send Message'}
        <CornerDownLeft class="size-3.5" />
      </Button>
    </div>
  </form>
</div>
