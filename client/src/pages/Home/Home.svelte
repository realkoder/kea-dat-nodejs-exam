<script lang="js">
  import { navigate } from 'svelte-routing';
  import { toast } from 'svelte-sonner';
  
  import { Button } from '$lib/components/ui/button/index.js';

  import HomeNavWthSidebar from '../../components/HomeNavWthSidebar/HomeNavWthSidebar.svelte';
  import Chat from '../../components/Chat/Chat.svelte';

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

  function sendMessage(textMessage) {
    if (rsocket) {
      rsocket.fireAndForgetMessage('send.message.1.1', { data: textMessage });
      textMessage = '';
    }
  }

  function setChatMessages(newChatMessages) {
    chatMessages = newChatMessages;
  }

  onMount(async () => {
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
      <Chat {sendMessage} chatMessages={chatMessages} />
    </main>
  </div>
</div>
