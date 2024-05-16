<script lang="ts">
  import { Separator } from '$lib/components/ui/separator/index.js';
  import MessageCard from '../MessageCard/MessageCard.svelte';
  import { afterUpdate, beforeUpdate, onMount } from 'svelte';

  export let chatMessages;
  export let chatroom;
  let chatWindowRef;
  let wasAtBottom = false;

  function scrollToBottom() {
    chatWindowRef.scrollTop = chatWindowRef.scrollHeight;
    wasAtBottom = true;
  }

  function isAtBottom() {
    // scrollTop: how much client have scrolled down
    // clientHeight: could also be named containerHeight
    // scrollHeight: height of all content inside container

    const { scrollTop, clientHeight, scrollHeight } = chatWindowRef;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 80;
    return isAtBottom;
  }

  afterUpdate(() => {
    if (!chatWindowRef) return;

    if (wasAtBottom) {
      scrollToBottom();
    }
  });

  beforeUpdate(() => {
    if (!chatWindowRef) return;
    wasAtBottom = isAtBottom();
  });

  onMount(() => {});
</script>

<div class="h-[700px] w-[1300px] overflow-scroll" bind:this={chatWindowRef}>
  <div class="p-4">
    <h4 class="text-sm">Messages</h4>
    {#each chatMessages as message}
      <div class="mb-4 text-sm font-medium leading-none">
        <MessageCard
          content={message.textMessage}
          currentChatroom={chatroom}
          messageUserId={message.userId}
        />
      </div>
      <Separator class="my-2" />
    {/each}
  </div>
</div>
