<script>
  // SHADCN
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import { Button } from '$lib/components/ui/button/index.js';

  // LUCIDE ICONS
  import LifeBuoy from 'lucide-svelte/icons/life-buoy';
  import SquareUser from 'lucide-svelte/icons/square-user';

  // SVELTE
  import { navigate } from 'svelte-routing';

  // STORE
  import chatroomStore from '../../stores/chatroomStore';

  import IntelliOptimaLogo from '../../assets/images/IntelliOptima_Logo.svg';
</script>

<aside
  class="inset-y fixed left-0 z-20 flex h-full w-[11dvw] flex-col border-r"
>
  <div class="border-b p-2">
    <Button
      variant="outline"
      size="icon"
      aria-label="Home"
      on:click={() => navigate('/home')}
    >
      <img src={IntelliOptimaLogo} alt="Logo" class="h-5 w-5 object-cover" />
    </Button>
  </div>
  <nav class="grid gap-1 p-2">
    {#each $chatroomStore as chatroom, i (i)}
      <div class="flex items-center justify-start p-2">
        <div
          class="mx-2 h-6 w-6 rounded-full"
          style="background-color: #{chatroom.color};"
        >
          <button
            class="mx-2 h-6 w-6 rounded-full"
            style="background-color: {chatroom.color};"
            on:click={() => {
              navigate(`/chat/${chatroom._id}`);
            }}
          ></button>
        </div>
        <span
          class="mx-2 min-w-[3rem] rounded bg-gray-200 px-2 text-sm font-semibold text-gray-800"
          >{chatroom.chatroomName.length >= 5
            ? `${chatroom.chatroomName.substring(0, 5)}...`
            : chatroom.chatroomName}</span
        >
      </div>
    {/each}
  </nav>

  <nav class="mt-auto grid gap-1 p-2">
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          variant="ghost"
          size="icon"
          class="mt-auto rounded-lg"
          aria-label="Help"
          builders={[builder]}
        >
          <LifeBuoy class="size-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>Help</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          variant="ghost"
          size="icon"
          class="mt-auto rounded-lg"
          aria-label="Account"
          builders={[builder]}
        >
          <SquareUser class="size-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>Account</Tooltip.Content>
    </Tooltip.Root>
  </nav>
</aside>
