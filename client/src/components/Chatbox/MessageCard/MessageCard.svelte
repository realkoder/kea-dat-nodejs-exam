<script>
  import userStore from '../../../stores/userStore';
  import MessageHoverCard from '../MessageHoverCard/MessageHoverCard.svelte';
  import profileImage from '../../../assets/images/profile-pic.svg';
  import userImage from '../../../assets/images/user-pic.svg';

  // export let profileImage;
  export let currentChatroom;
  export let message;
  export let deleteMessage;
</script>

<div class="flex h-full items-end px-5 py-8 md:px-3">
  {#if message.userId !== $userStore.id}
    <div class="relative">
      <div class="absolute -right-12 -top-7 h-11 w-11 shrink-0">
        <div
          class="dark:border-n-6 relative aspect-square max-w-[38em] rounded-full border-4 border-white"
        >
          <img
            class="z-1 rounded-full object-cover shadow-xl"
            src={userImage}
            alt=""
          />
        </div>
      </div>
    </div>
  {/if}

  <div class="w-full space-y-6 pl-6 md:pl-4">
    <div
      class="relative flex w-full {message.userId === $userStore.id
        ? 'justify-end'
        : 'justify-start'}"
    >
      <p
        class="absolute {message.userId === $userStore.id
          ? '-top-6 right-5 justify-end'
          : '-left-1 -top-6 justify-start'} text-[12px] text-[#9e9e9e]"
      >
        {#if currentChatroom && currentChatroom.members}
          {#each currentChatroom.members as member}
            {#if member._id === message.userId}
              {member.user.fullName}
            {/if}
          {/each}
        {/if}
      </p>

      <div
        class="dark:text-n-1 text-n-7 dark:border-n-5 border-n-3 text-body-2 relative -ml-2 mr-4 max-w-[90%] items-center overflow-auto whitespace-pre-wrap rounded-lg border py-2 font-sans md:text-[14px] {message.userId ===
        $userStore.id
          ? 'dark:shadow-n-7 flex-row-reverse pl-3 pr-9 shadow-lg'
          : 'dark:shadow-n-7 pl-9 pr-3 shadow-lg'}"
      >
        <!-- THIS IS MAGIC - but it works for styling the textmessage content nicely -->
        {@html message.textMessage
          .replace(/(?:\r\n|\r|\n)/g, '<br>')
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(
            /(?:^|\n)(\d+)\.\s(.*?)(?=\n|$)/g,
            '<div class="mt-2"><span class="font-bold">$1.</span> $2</div>',
          )
          .replace(/###\s*(.*?):/g, '<h3>$1:</h3>')}
      </div>
      <div class="mr-16">
        <MessageHoverCard {message} {deleteMessage} />
      </div>
      <!-- {/if} -->
    </div>
  </div>

  {#if message.userId === $userStore.id}
    <div class="relative">
      <div class="absolute -top-7 right-1 h-11 w-11 shrink-0">
        <div
          class="dark:border-n-6 relative aspect-square max-w-[38em] rounded-full border-4 border-white"
        >
          <img
            class="z-1 rounded-full object-cover shadow-xl"
            src={profileImage}
            alt=""
          />
        </div>
      </div>
    </div>
  {/if}
</div>
