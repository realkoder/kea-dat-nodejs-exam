<script>
  import CornerDownLeft from 'lucide-svelte/icons/corner-down-left';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import MessageScrollArea from './MessageScrollArea/MessageScrollArea.svelte';

  export let sendMessage;
  export let deleteMessage;
  export let chatMessages;
  export let chatroom;
  export let appendOlderMessages;
  let textMessage;

  function handleKeyDown(event) {
    if (event.shiftKey) return;
    if (event.key === 'Enter') {
      sendMessage(textMessage);

      setTimeout(() => (textMessage = ''), 1);
    }
  }
</script>

<div
  class="relative flex min-h-[80dvh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2"
>
  <div class="flex-1">
    <MessageScrollArea
      appendOlderMessages={appendOlderMessages}
      chatMessages={chatMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )}
      {deleteMessage}
      {chatroom}
    />
  </div>
  <form
    class="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
  >
    <Label for="message" class="sr-only">Message</Label>
    <Textarea
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
        Send Message
        <CornerDownLeft class="size-3.5" />
      </Button>
    </div>
  </form>
</div>
