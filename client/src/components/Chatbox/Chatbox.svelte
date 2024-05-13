<script>
  import CornerDownLeft from 'lucide-svelte/icons/corner-down-left';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Button } from '$lib/components/ui/button/index.js';

  export let sendMessage;
  export let chatMessages;
  let textMessage;
</script>

<div
  class="bg-muted/50 relative flex h-full min-h-[50vh] flex-col rounded-xl p-4 lg:col-span-2"
>
  <Badge variant="outline" class="absolute right-3 top-3">Output</Badge>
  <div class="flex-1">
    {#each chatMessages as message}
      <div class="my-2 rounded-lg bg-white p-2 shadow">
        {message.data}
      </div>
    {/each}
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
