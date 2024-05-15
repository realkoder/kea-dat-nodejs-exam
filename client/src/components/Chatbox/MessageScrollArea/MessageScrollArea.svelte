<script lang="ts">
  import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import MessageCard from '../MessageCard/MessageCard.svelte';

  export let chatMessages;
  export let chatroom;
</script>

<ScrollArea class="h-[700px] w-[1300px]">
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
</ScrollArea>
