<script>
  import * as HoverCard from '$lib/components/ui/hover-card';
  import userStore from '../../../stores/userStore';
  import AlertDialog from '../../../components/AlertDialog/AlertDialog.svelte';
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';

  export let message;
  export let deleteMessage;

  function handleDeleteClick() {
    deleteMessage(message._id);
  }

  function getMoment(date) {
    dayjs.extend(relativeTime);

    const timeAgo = dayjs(date).fromNow();

    return timeAgo;
  }
</script>

<HoverCard.Root>
  <HoverCard.Trigger
    class="rounded-sm underline-offset-4 hover:bg-slate-300 focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
    >⚙️</HoverCard.Trigger
  >
  <HoverCard.Content class="w-80">
    <div class="flex space-x-4">
      <span class="m-4">🗒️</span>
      <div class="space-y-1">
        <h4 class="text-sm font-semibold">message</h4>
        <p class="text-sm">
          Sent by {message.userId === $userStore.id ? 'you' : 'someone else'}
        </p>
        {#if message.userId === $userStore.id}
          <AlertDialog
            item={'message'}
            title={'Delete message'}
            handleAccept={handleDeleteClick}
          />
        {/if}
        <div class="flex items-center pt-2">
          <span class="text-xs text-muted-foreground">
            Sent {getMoment(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  </HoverCard.Content>
</HoverCard.Root>
