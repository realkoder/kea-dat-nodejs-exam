<script>
  import userStore from '../../../stores/userStore';

  export let messageUserId;
  // export let profileImage;
  export let currentChatroom;
  export let content;
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

  <div class="w-full space-y-6 pl-6 md:pl-4">
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
    </div>
    <slot></slot>
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

<!-- <script lang="ts"> 
  import * as Card from '$lib/components/ui/card/index.js';  
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  export let message;
</script>

<Card.Root class="">
  <Card.Header>
    <Card.Title>Message from {textM}</Card.Title>
    <Card.Description>Deploy your new project in one-click.</Card.Description>
  </Card.Header>
  <Card.Content>
    <div class="grid w-full items-center gap-4">
      <div class="flex flex-col space-y-1.5">
        <Label for="name">Name</Label>
        <Input id="name" placeholder="Name of your project" />
      </div>
      <div class="flex flex-col space-y-1.5">
        {message.textMessage}
      </div>
    </div>
  </Card.Content>
   <Card.Footer class="flex justify-between">
      <Button variant="outline">Cancel</Button>
      <Button>Deploy</Button>
    </Card.Footer>
</Card.Root> -->
