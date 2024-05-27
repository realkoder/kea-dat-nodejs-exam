<script>
  // COMPONENTS
  import HomeNavWthSidebar from '../../components/HomeNavWthSidebar/HomeNavWthSidebar.svelte';
  import Header from '../../components/Header/Header.svelte';
  import Chatbox from '../../components/Chatbox/Chatbox.svelte';
  import { toast } from 'svelte-sonner';

  // UTIL / SVELTE
  import { onDestroy, onMount } from 'svelte';
  import { navigate } from 'svelte-routing';
  import genericApi from '../../utils/api/genericApi.js';

  // RSOCKET
  import { CustomRSocket } from '../../modules/RSocketClient.js';

  // STORE
  import userStore from '../../stores/userStore.js';
  import { BASE_URL } from '../../stores/generalStore.js';

  // UUID
  import { v4 as uuidv4 } from 'uuid';

  export let chatroomId;
  let chatroom;
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

    if (chatroomId) {
      fetchChatroom();
      rsocket = await CustomRSocket.CreateAsync();
      rsocket.requestStream(
        `chatroom.stream.${$userStore.id}.${chatroomId}`,
        { data: rsocketConnectionId },
        appendChatMessages,
        removeChatMessage,
      );

      // CLEANUP IF RELOADING
      window.addEventListener('beforeunload', function (event) {
        if (rsocket) {
          rsocket.fireAndForgetCloseConnection(
            `close.message.${$userStore.id}.${chatroomId}`,
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
        `close.message.${$userStore.id}.${chatroomId}`,
        {
          data: rsocketConnectionId,
        },
      );
      rsocket.close();
    }
  });

  function fetchChatroom() {
    genericApi
      .GET(`${$BASE_URL}/api/v1/chatrooms/${chatroomId}`)
      .then((response) => {
        if (response) {
          return response.json();
        }
        throw new Error('No response received');
      })
      .then((fetchedData) => {
        chatroom = fetchedData.data;
        chatMessages = chatroom.messages;
      })
      .catch((error) => console.error(error));
  }

  function sendMessage(textMessage) {
    if (!textMessage || textMessage === '') {
      toast.error('Not possible to send empty message');
      return;
    }
    if (rsocket) {      
      if (textMessage.startsWith('@')) {
        const provider = textMessage.split(' ')[0].substring(1);
        const formattedMessages = [
          ...chatMessages.map((message) => ({
            userId: message.userId,
            textMessage: message.textMessage,
            chatroomId: message.chatroomId,
          })),
          {
            userId: $userStore.id,
            textMessage: textMessage,
            chatroomId: chatroomId,
          },
        ];

        rsocket.fireAndForget(`ai.stream.${$userStore.id}.${chatroomId}`, {
          data: {
            provider: provider,
            messages: formattedMessages,
          },
        });

        console.log({
          data: {
            provider: provider,
            messages: formattedMessages,
          },
        });
      } else {
        rsocket.fireAndForget(`send.message.${$userStore.id}.${chatroomId}`, {
          data: {
            userId: $userStore.id,
            textMessage: textMessage,
            chatroomId: chatroomId,
          },
        });
      }
    }
  }

  function deleteMessage(messageId) {
    if (rsocket) {
      rsocket.fireAndForget(`delete.message.${$userStore.id}.${chatroomId}`, {
        data: {
          deleteMessageId: messageId,
        },
      });
    }
  }

  function appendChatMessages(chatMessage) {
    const possibleStreamedMessageResponse = chatMessages.find(
      (message) => message._id === chatMessage._id,
    );
    // If userId length < 2 messages will be streamed as AI chunks
    if (chatMessage.userId.length < 2 && possibleStreamedMessageResponse) {
      possibleStreamedMessageResponse.textMessage += chatMessage.textMessage;
      chatMessages = [...chatMessages];
    } else {
      chatMessages = [...chatMessages, chatMessage];
    }
  }

  function removeChatMessage(deleteMessageId) {
    chatMessages = chatMessages.filter(
      (chatMessage) => chatMessage._id !== deleteMessageId,
    );
    toast.success('A message was deleted!');
  }

  function appendOlderMessages(olderChatMessages) {
    const combinedMessages = [...olderChatMessages, ...chatMessages];
    const uniqueMessagesSet = new Set(
      combinedMessages.map((message) => message._id),
    );

    chatMessages = Array.from(uniqueMessagesSet).map((id) =>
      combinedMessages.find((message) => message._id === id),
    );
  }
</script>

<div class="grid h-screen w-full pl-[53px]">
  <HomeNavWthSidebar />
  <div class="flex flex-col">
    <Header />
    <main
      class="mx-auto grid w-full flex-1 gap-4 overflow-auto p-4 md:lg:col-span-full lg:lg:col-span-full lg:w-10/12"
    >
      {#if chatroom}
        <h1 class="h-[50px]">{chatroom.chatroomName}</h1>
      {/if}

      <Chatbox
        {sendMessage}
        {deleteMessage}
        {chatMessages}
        {chatroom}
        {appendOlderMessages}
      />
    </main>
  </div>
</div>
