<script>
  import AlertDialog from '../../../components/AlertDialog/AlertDialog.svelte';
  import userStore from '../../../stores/userStore';

  export let messageUserId;
  // export let profileImage;
  export let currentChatroom;
  export let messageId;
  export let content;
  export let deleteMessage;

  let isHovered = false;
  let alertDialogIsClicked = false;

  function handleMouseEnter() {
    isHovered = true;
  }

  function handleMouseLeave() {
    isHovered = false;
  }

  function handleDeleteClick() {
    deleteMessage(messageId);
    alertDialogIsClicked = false;
  }

  //  on:click={() => deleteMessage(messageId)}
</script>

<div class="flex h-full items-end px-5 py-8 md:px-3">
  {#if messageUserId !== $userStore.id}
    <div class="relative">
      <div class="absolute -right-12 -top-7 h-11 w-11 shrink-0">
        <div
          class="dark:border-n-6 relative aspect-square max-w-[38em] rounded-full border-4 border-white"
        >
          <!-- <img class="rounded-full object-cover z-1 shadow-xl" src={profileImage} alt="" /> -->
          <p class="z-1 rounded-full object-cover shadow-xl">🐍</p>
        </div>
      </div>
    </div>
  {/if}

  <div
    class="w-full space-y-6 pl-6 md:pl-4"
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
    role="button"
    tabindex="0"
  >
    <div
      class="relative flex w-full {messageUserId === $userStore.id
        ? 'justify-end'
        : 'justify-start'}"
    >
      <p
        class="absolute {messageUserId === $userStore.id
          ? '-top-6 right-5 justify-end'
          : '-left-1 -top-6 justify-start'} text-[12px] text-[#9e9e9e]"
      >
        {#if currentChatroom && currentChatroom.members}
          {#each currentChatroom.members as member}
            {#if member._id === messageUserId}
              {member.user.fullName}
            {/if}
          {/each}
        {/if}
      </p>

      <div
        class="dark:text-n-1 text-n-7 dark:border-n-5 border-n-3 text-body-2 relative -ml-2 mr-4 flex max-w-[90%] items-center overflow-auto whitespace-pre-wrap break-words break-all rounded-lg border py-2 font-sans md:text-[14px] {messageUserId ===
        $userStore.id
          ? 'dark:shadow-n-7 flex-row-reverse pl-3 pr-9 shadow-lg'
          : 'dark:shadow-n-7 pl-9 pr-3 shadow-lg'}"
      >
        {content}
      </div>
      {#if (isHovered || alertDialogIsClicked) && messageUserId === $userStore.id}
        <div class="mr-16">
          <AlertDialog
          item={"message"}
            toggleAlertDialogIsClicked={() =>
              (alertDialogIsClicked = !alertDialogIsClicked)}
            title={'Delete message'}
            handleAccept={handleDeleteClick}
          />
        </div>
      {/if}
    </div>
  </div>

  {#if messageUserId === $userStore.id}
    <div class="relative">
      <div class="absolute -top-7 right-1 h-11 w-11 shrink-0">
        <div
          class="dark:border-n-6 relative aspect-square max-w-[38em] rounded-full border-4 border-white"
        >
          <!-- TODO: SHOULD BE USERS PROFILEIMAGE -->
          <span class="rounded-full object-cover shadow-xl">🦋</span>
        </div>
      </div>
    </div>
  {/if}
</div>
