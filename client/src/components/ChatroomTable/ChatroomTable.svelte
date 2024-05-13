<script>
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Table from '$lib/components/ui/table/index.js';
  import genericApi from '../../utils/api/genericApi.js';
  import { onMount } from 'svelte';
  import { BASE_URL } from '../../stores/generalStore.js';
  import userStore from '../../stores/userStore.js';

  let chatrooms = [];

  onMount(() => {
    genericApi
      .GET(`${$BASE_URL}/api/v1/chatrooms/${$userStore.id}`)
      .then((response) => response.json())
      .then((fetchedData) => {        
        chatrooms = fetchedData.chatrooms.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      })
      .catch(error => console.error(error));
  });
</script>

<div class="flex flex-col items-center">
  <h1 class="mb-8">A list of your selected chatroom members.</h1>
  <Table.Root>
    <Table.Header>
      <Table.Row>
        <Table.Head class="w-[100px]">Name</Table.Head>
        <Table.Head class="text-right">Created</Table.Head>
        <Table.Head class="text-right">No.</Table.Head>
        <Table.Head class="text-right">Action</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {#each chatrooms as chatroom, i (i)}
        <Table.Row>
          <Table.Cell class="font-medium">{chatroom.chatroomName}</Table.Cell>
          <!-- <Table.Cell>{member.name}</Table.Cell> -->
          <Table.Cell class="text-right">{i + 1}</Table.Cell>
          <Table.Cell class="text-right">
            <Button variant="destructive" on:click={() => console.log('FIX')}
              >Remove member</Button
            >
          </Table.Cell>
        </Table.Row>
      {/each}
    </Table.Body>
  </Table.Root>
</div>
