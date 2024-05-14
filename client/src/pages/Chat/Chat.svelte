<script>
  // COMPONENTS
  import HomeNavWthSidebar from '../../components/HomeNavWthSidebar/HomeNavWthSidebar.svelte';
  import Header from '../../components/Header/Header.svelte';
  import Chatbox from '../../components/Chatbox/Chatbox.svelte';

  // SVELTE
  import { onDestroy, onMount } from 'svelte';

  // RSOCKET
  import { CustomRSocket } from '../../modules/RSocketClient';

  // UUID
  import { v4 as uuidv4 } from 'uuid';
  import userStore from '../../stores/userStore';
  import { navigate } from 'svelte-routing';
  import { toast } from 'svelte-sonner';

  export let chatroomId;
  let rsocket;
  let rsocketConnectionId = uuidv4();
  let chatMessages = [];

  // INITIALIZING VIEW - SETTING RSOCKET AND CHECKING CHATROOMID
  onMount(async () => {
    // If client provide their own chatroomId not secure enough but something is done to check for this
    if (!chatroomId || chatroomId.length < 20) {
      const storedChatroomId = localStorage.getItem('latestChatroomId');
      if (storedChatroomId) {
        chatroomId = storedChatroomId;
      } else {
        toast.error('Something went wrong - BYE');
        setTimeout(() => {
          navigate('/home');
        }, 4000);
      }
    }
    console.log(chatroomId);
    if (chatroomId) {
      rsocket = await CustomRSocket.CreateAsync();
      rsocket.requestStream(
        `chatroom.stream.${$userStore.id}.${chatroomId}`,
        { data: rsocketConnectionId },
        chatMessages,
        setChatMessages,
      );

      // CLEANUP IF RELOADING
      window.addEventListener('beforeunload', function (event) {
        if (rsocket) {
          rsocket.fireAndForgetCloseConnection(
            `close.${$userStore.id}.${chatroomId}`,
            {
              data: rsocketConnectionId,
            },
          );
          rsocket.close();
        }
      });
    }
  });

  // CLEANUP WHEN LEAVING PAGE
  onDestroy(() => {
    if (rsocket) {
      rsocket.fireAndForgetCloseConnection(
        `close.${$userStore.id}.${chatroomId}`,
        {
          data: rsocketConnectionId,
        },
      );
      rsocket.close();
    }
  });

  function sendMessage(textMessage) {
    if (rsocket) {      
      rsocket.fireAndForgetMessage(
        `send.message.${$userStore.id}.${chatroomId}`,
        { data: textMessage },
      );
      textMessage = '';
    }
  }

  function setChatMessages(newChatMessages) {
    chatMessages = newChatMessages;
  }  
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
