<script>
  // COMPONENTS
  import * as Table from '$lib/components/ui/table/index.js';

  // SHADCN
  import Button from '$lib/components/ui/button/button.svelte';
  import { toast } from 'svelte-sonner';

  // UTIL
  import genericApi from '../../utils/api/genericApi.js';
  import { onMount } from 'svelte';

  // STORE
  import { BASE_URL } from '../../stores/generalStore.js';
  import userStore from '../../stores/userStore.js';

  // TIME
  import dayjs from 'dayjs';
  import relativeTime from 'dayjs/plugin/relativeTime';

  let chatrooms = [];

  onMount(() => {
    genericApi
      .GET(`${$BASE_URL}/api/v1/chatrooms/${$userStore.id}`)
      .then((response) => response.json())
      .then((fetchedData) => {
        chatrooms = fetchedData.chatrooms.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        console.log(chatrooms);
      })
      .catch((error) => console.error(error));
  });

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

    console.log(timeAgo);
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
        <Table.Head class="text-center">Amount of members</Table.Head>
        <Table.Head class="text-center">No.</Table.Head>
        <Table.Head class="text-center">Action</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each chatrooms as chatroom, i (i)}
        <Table.Row>
          <Table.Cell class="font-medium">{chatroom.chatroomName}</Table.Cell>
          <Table.Cell class="text-center"
            >{getMoment(chatroom.createdAt)}</Table.Cell
          >
          <Table.Cell class="text-center">{chatroom.members.length}</Table.Cell>
          <Table.Cell class="text-center">{i + 1}</Table.Cell>
          <Table.Cell class="items-center text-center">
            <Button
              variant="destructive"
              on:click={() => handleDeleteChatroom(chatroom._id)}
              >Remove member</Button
            >
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
