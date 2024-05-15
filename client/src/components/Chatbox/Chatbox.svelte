<script>
  import CornerDownLeft from 'lucide-svelte/icons/corner-down-left';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import MessageScrollArea from './MessageScrollArea/MessageScrollArea.svelte';
  import genericApi from '../../utils/api/genericApi';
  import { BASE_URL } from '../../stores/generalStore';

  export let sendMessage;
  export let chatMessages;
  export let chatroom;
  export let appendOlderMessages;
  let textMessage;
  let page = 2;
  let isMessagesFetchable = true;

  function fetchMoreMessages() {
    genericApi
      .GET(`${$BASE_URL}/api/v1/messages/${chatroom._id}?page=${page}&limit=10`)
      .then((response) => response.json())
      .then((fetchedData) => {
        appendOlderMessages(fetchedData.messages);
        if (fetchedData.messages.length !== 10) isMessagesFetchable = false;
        page = page + 1;
      })
      .catch((error) => console.error(error));
  }

  function handleKeyDown(event) {
    if (event.shiftKey) return;
    if (event.key === 'Enter') {
      sendMessage(textMessage);
      
      setTimeout(() => (textMessage = ''), 1);
    }
  }
</script>

<div
  class="bg-muted/50 relative flex h-full min-h-[50vh] flex-col rounded-xl p-4 lg:col-span-2"
>
  <div class="flex-1">
    {#if isMessagesFetchable}
      <Button on:click={fetchMoreMessages}>FETCH MORE MESSAGE</Button>
    {/if}
    <MessageScrollArea
      chatMessages={chatMessages.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      )}
      {chatroom}
    />
  </div>
  <form
    class="bg-background focus-within:ring-ring relative overflow-hidden rounded-lg border focus-within:ring-1"
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
