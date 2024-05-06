<script lang="js">
  import { navigate } from 'svelte-routing';
  import { toast } from 'svelte-sonner';
  import Bot from 'lucide-svelte/icons/bot';
  import SquareTerminal from 'lucide-svelte/icons/square-terminal';
  import CodeXML from 'lucide-svelte/icons/code-xml';
  import Settings2 from 'lucide-svelte/icons/settings-2';
  import LifeBuoy from 'lucide-svelte/icons/life-buoy';
  import Book from 'lucide-svelte/icons/book';
  import SquareUser from 'lucide-svelte/icons/square-user';
  import CornerDownLeft from 'lucide-svelte/icons/corner-down-left';

  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Tooltip from '$lib/components/ui/tooltip/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  import IntelliOptimaLogo from '../../assets/images/IntelliOptima_Logo.svg';

  // Store
  import isAuthenticated from '../../stores/authStore';
  import { BASE_URL } from '../../stores/generalStore';

  // Utils
  import genericApi from '../../utils/api/genericApi';

  async function handleLogout() {
    const data = await genericApi.GET($BASE_URL + '/api/v1/auth/logout');
    if (data.status >= 200 && data.status <= 300) {
      isAuthenticated.set(false);
      toast.success(`You've successfully logged out!`);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      toast.error('Something went wrong logging you out, please try again!');
    }
  }
</script>

<div class="grid h-screen w-full pl-[53px]">
  <aside class="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
    <div class="border-b p-2">
      <Button variant="outline" size="icon" aria-label="Home">
        <img src={IntelliOptimaLogo} alt="Logo" class="h-5 w-5 object-cover" />
      </Button>
    </div>
    <nav class="grid gap-1 p-2">
      <Tooltip.Root>
        <Tooltip.Trigger asChild let:builder>
          <Button
            variant="ghost"
            size="icon"
            class="rounded-lg bg-muted"
            aria-label="Playground"
            builders={[builder]}
          >
            <SquareTerminal class="size-5" />
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content side="right" sideOffset={5}>Playground</Tooltip.Content
        >
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
  <div class="flex flex-col">
    <header
      class="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4"
    >
      <h1 class="text-xl font-semibold">IntelliOptima</h1>
      <Button
        on:click={handleLogout}
        variant="outline"
        size="sm"
        class="ml-auto gap-1.5 text-sm"
      >
        Logout
      </Button>
    </header>
    <main
      class="mx-auto grid w-full flex-1 gap-4 overflow-auto p-4 md:lg:col-span-full lg:lg:col-span-full lg:w-10/12"
    >
      <div
        class="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2"
      >
        <Badge variant="outline" class="absolute right-3 top-3">Output</Badge>
        <div class="flex-1" />
        <form
          class="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <Label for="message" class="sr-only">Message</Label>
          <Textarea
            id="message"
            placeholder="Type your message here..."
            class="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div class="flex items-center p-3 pt-0">
            <Button type="submit" size="sm" class="ml-auto gap-1.5">
              Send Message
              <CornerDownLeft class="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  </div>
</div>
