<script>
  // COMPONENTS
  import * as Table from '$lib/components/ui/table/index.js';

  // SHADCN
  import { toast } from 'svelte-sonner';
  import AlertDialog from '../AlertDialog/AlertDialog.svelte';

  // UTIL / SVELTE
  import genericApi from '../../utils/api/genericApi.js';
  import { onMount } from 'svelte';
  import { navigate } from 'svelte-routing';

  // STORE
  import { BASE_URL } from '../../stores/generalStore.js';
  import userStore from '../../stores/userStore.js';

  // TIME
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';

  let chatrooms = [];

  onMount(() => {
    genericApi
      .GET(`${$BASE_URL}/api/v1/chatrooms/userId/${$userStore.id}`)
      .then((response) => response.json())
      .then((fetchedData) => {
        chatrooms = sortChatroomByLatestMessageOrCreatedData(fetchedData);
      })
      .catch((error) => console.error(error));
  });

  function sortChatroomByLatestMessageOrCreatedData(data) {
    return data.chatrooms.sort((a, b) => {
      const getDate = (chatroom) => {
        if (chatroom.messages.length > 0) {
          return new Date(
            chatroom.messages[chatroom.messages.length - 1].createdAt,
          );
        } else {
          return new Date(chatroom.createdAt);
        }
      };
      const dateA = getDate(a);
      const dateB = getDate(b);
      return dateB.getTime() - dateA.getTime();
    });
  }

  function handleDeleteChatroom(chatroomId) {
    genericApi
      .DELETE(`${$BASE_URL}/api/v1/chatrooms/${chatroomId}`)
      .then((response) => response.json())
      .then((fetchedData) => {
        chatrooms = chatrooms.filter((cur) => cur._id !== chatroomId);
        toast.success('Chatroom deleted!');
      })
      .catch((error) =>
        toast.error(
          'Deleting new chatroom failed, please check your connection and try again.',
        ),
      );
  }

  function getMoment(date) {
    dayjs.extend(relativeTime);

    const timeAgo = dayjs(date).fromNow();

    return timeAgo;
  }
</script>

<div class="flex flex-col items-center">
  <h1 class="mb-8">A list of your selected chatroom members.</h1>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]">Name</Table.Head>
        <Table.Head class="text-center">Created</Table.Head>
        <Table.Head class="text-center">Latest message</Table.Head>
        <Table.Head class="text-center">Amount of members</Table.Head>
        <Table.Head class="text-center">No.</Table.Head>
        <Table.Head class="text-center">Action</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each chatrooms as chatroom, i (i)}
        <Table.Row>
          <Table.Cell class={'cursor-pointer font-medium'}
            >{chatroom.chatroomName}</Table.Cell
          >
          <Table.Cell
            class={'cursor-pointer text-center font-medium'}
            on:click={() => navigate(`/chat/${chatroom._id}`)}
            >{getMoment(chatroom.createdAt)}</Table.Cell
          >
          <Table.Cell
            class={'cursor-pointer text-center font-medium'}
            on:click={() => navigate(`/chat/${chatroom._id}`)}
            >{chatroom.messages.length > 0
              ? getMoment(
                  chatroom.messages[chatroom.messages.length - 1].createdAt,
                )
              : 'No messages'}</Table.Cell
          >
          <Table.Cell
            class={'cursor-pointer text-center font-medium'}
            on:click={() => navigate(`/chat/${chatroom._id}`)}
            >{chatroom.members.length + 1}</Table.Cell
          >
          <Table.Cell
            class={'cursor-pointer text-center font-medium'}
            on:click={() => navigate(`/chat/${chatroom._id}`)}
            >{i + 1}</Table.Cell
          >
          <Table.Cell class="items-center text-center">
            <AlertDialog
              item={'chatroom'}              
              title={'Delete chatroom'}
              handleAccept={() => handleDeleteChatroom(chatroom._id)}
            />
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
