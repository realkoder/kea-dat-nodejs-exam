<script>
  import HomeNavWthSidebar from '../../components/HomeNavWthSidebar/HomeNavWthSidebar.svelte';
  import Header from '../../components/Header/Header.svelte';
  import Chatbox from '../../components/Chatbox/Chatbox.svelte';

  // UTILS
  import { onDestroy, onMount } from 'svelte';

  // RSOCKET
  import { CustomRSocket } from '../../modules/RSocketClient';

  // UUID
  import { v4 as uuidv4 } from 'uuid';

  let rsocket;
  let rsocketConnectionId = uuidv4();
  let chatMessages = [];

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
    <Header />
    <main
      class="mx-auto grid w-full flex-1 gap-4 overflow-auto p-4 md:lg:col-span-full lg:lg:col-span-full lg:w-10/12"
    >
      <Chatbox {sendMessage} {chatMessages} />
    </main>
  </div>
</div>
