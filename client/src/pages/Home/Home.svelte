<script lang="js">
  import { navigate } from 'svelte-routing';
  import { toast } from 'svelte-sonner';
  import CornerDownLeft from 'lucide-svelte/icons/corner-down-left';

  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  import HomeNavWthSidebar from '../../components/HomeNavWthSidebar/HomeNavWthSidebar.svelte';

  // Store
  import isAuthenticated from '../../stores/authStore';
  import { BASE_URL } from '../../stores/generalStore';

  // Utils
  import genericApi from '../../utils/api/genericApi';
  import { onDestroy, onMount } from 'svelte';

  // RSOCKET
  import { CustomRSocket } from '../../modules/RSocketClient';

  // UUID
  import { v4 as uuidv4 } from 'uuid';

  let rsocket;
  let rsocketConnectionId = uuidv4();
  let textMessage;
  let chatMessages = [];

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

  function sendMessage() {
    if (rsocket) {
      rsocket.fireAndForgetMessage('send.message.1.1', { data: textMessage });
      textMessage = '';
    }
  }

  function setChatMessages(newChatMessages) {
    chatMessages = newChatMessages;
  }

  onMount(async () => {
    console.log('ONMOUNTED');
    rsocket = await CustomRSocket.CreateAsync();
    rsocket.requestStream(
      'chatroom.stream.1.1',
      { data: rsocketConnectionId },
      chatMessages,
      setChatMessages,
    );

    window.addEventListener('beforeunload', function (event) {
      if (rsocket) {
        rsocket.fireAndForgetCloseConnection('close.1.1', {
          data: rsocketConnectionId,
        });
        rsocket.close();
        console.log('CALLED');
      }
    });
  });

  onDestroy(() => {
    if (rsocket) {
      rsocket.fireAndForgetCloseConnection('close.1.1', {
        data: rsocketConnectionId,
      });
      rsocket.close();
    }
  });
</script>

<div class="grid h-screen w-full pl-[53px]">
  <HomeNavWthSidebar />

  <div class="flex flex-col">
    <header
      class="bg-background sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b px-4"
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
              on:click={sendMessage}
            >
              Send Message
              <CornerDownLeft class="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </main>
  </div>
</div>
