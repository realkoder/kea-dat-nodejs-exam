<script>
  import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
  import { Separator } from '$lib/components/ui/separator/index.js';
  import * as Dialog from '$lib/components/ui/dialog/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import SelectedChatroomMembersTable from '../SelectedChatroomMembersTable/SelectedChatroomMembersTable.svelte';
  import UsersSelector from '../UsersSelector/UsersSelector.svelte';
  import { onMount } from 'svelte';
  import genericApi from '../../../utils/api/genericApi.js';
  import { BASE_URL } from '../../../stores/generalStore.js';
  import { toast } from 'svelte-sonner';
  import userStore from '../../../stores/userStore';
  import { navigate } from 'svelte-routing';

  let chatroomName = '';
  let chatroomMembers = [];

  let users = [];

  onMount(() => {
    genericApi
      .GET(`${$BASE_URL}/api/v1/users`)
      .then((response) => response.json())
      .then((fetchedData) => {
        users = fetchedData.data;
      });
  });

  function handleCreateNewChatroom() {
    try {
      const newChatroom = {
        chatroomName: chatroomName,
        chatroomUserCreatorId: $userStore.id,
        members: chatroomMembers,
        color: '000',
      };
      genericApi
        .POST(`${$BASE_URL}/api/v1/chatrooms/`, {
          body: newChatroom,
          headers: '',
        })
        .then((response) => {
          console.log(response);
          if (response.message === 'Successfully created new chatroom') {
            toast.success('New chatroom created!');
            localStorage.setItem('latestChatroomId', response.chatroom._id);
            setTimeout(() => {
              navigate(`/chat/${response.chatroom._id}`);
            }, 1000);
          } else {
            toast.error(
              'Creating new chatroom failed, please check your credentials and try again.',
            );
          }
        })
        .catch((error) => {
          toast.error('Something went wrong, please try again!');
          console.error('Error during creating new chatroom: ', error);
        });
    } catch (error) {
      console.error(error);
    }
  }

  function handleChatroomMembersChange(member) {
    chatroomMembers = [...chatroomMembers, member];
    users = users.filter((cur) => cur.email !== member.email);
    console.log(users);
  }

  function handleRemoveMember(member) {
    chatroomMembers = chatroomMembers.filter(
      (cur) => cur.email !== member.email,
    );
    users = [...users, member];
  }
</script>

<Dialog.Root>
  <Dialog.Trigger class={`${buttonVariants({ variant: 'outline' })} max-w-44`}
    >Create Chatroom</Dialog.Trigger
  >
  <Dialog.Content
    class="flex flex-col items-center sm:max-w-[425px] xl:min-w-[648px]"
  >
    <Dialog.Header>
      <Dialog.Title class="text-center">Create new chatroom</Dialog.Title>
      <Dialog.Description class="text-center">
        Setup the details for your new chatroom
      </Dialog.Description>
    </Dialog.Header>
    <form on:submit|preventDefault={handleCreateNewChatroom}>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-4 items-center gap-4">
          <Label for="chatroomName" class="text-right">Chatroom name</Label>
          <Input
            required
            id="chatroomName"
            bind:value={chatroomName}
            class="col-span-3"
          />
        </div>
        <div class="flex items-center gap-4">
          <Label class="text-right">Users to invite to chatroom</Label>
          <UsersSelector {users} handleChange={handleChatroomMembersChange} />
        </div>
        {#if chatroomMembers.length > 0}
          <Separator class="mb-8" />
        {/if}
      </div>
      {#if chatroomMembers.length > 0}
        <SelectedChatroomMembersTable {chatroomMembers} {handleRemoveMember} />
      {/if}
      <Dialog.Footer>
        <Button type="submit">Create new chatroom</Button>
      </Dialog.Footer>
    </form>
  </Dialog.Content>
</Dialog.Root>
