<script>
  import IntelliOptimaLogo from '../../assets/images/IntelliOptima_Logo.svg';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import Bot from 'lucide-svelte/icons/bot';
  import { Button } from '$lib/components/ui/button/index.js';
  import SquareTerminal from 'lucide-svelte/icons/square-terminal';
  import CodeXML from 'lucide-svelte/icons/code-xml';
  import Settings2 from 'lucide-svelte/icons/settings-2';
  import Book from 'lucide-svelte/icons/book';
  import LifeBuoy from 'lucide-svelte/icons/life-buoy';
  import SquareUser from 'lucide-svelte/icons/square-user';
  import { navigate } from 'svelte-routing';
</script>

<aside class="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
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
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          variant="ghost"
          size="icon"
          class="bg-muted rounded-lg"
          aria-label="Playground"
          builders={[builder]}
        >
          <SquareTerminal class="size-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>Playground</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-lg"
          aria-label="Models"
          builders={[builder]}
        >
          <Bot class="size-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>AI Models</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-lg"
          aria-label="API"
          builders={[builder]}
        >
          <CodeXML class="size-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>API</Tooltip.Content>
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-lg"
          aria-label="Documentation"
          builders={[builder]}
        >
          <Book class="size-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}
        >Documentation</Tooltip.Content
      >
    </Tooltip.Root>
    <Tooltip.Root>
      <Tooltip.Trigger asChild let:builder>
        <Button
          variant="ghost"
          size="icon"
          class="rounded-lg"
          aria-label="Settings"
          builders={[builder]}
        >
          <Settings2 class="size-5" />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content side="right" sideOffset={5}>Settings</Tooltip.Content>
    </Tooltip.Root>
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
