<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { Button } from '$lib/components/ui/button/index.js';

  export let handleAccept;
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger asChild let:builder>
    <Button builders={[builder]} variant="destructive"
      >Delete chatroom</Button
    >
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title
        >Are you sure about deleting the chatroom</AlertDialog.Title
      >
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your chatroom
        and remove your chatroom related data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action on:click={() => handleAccept()}
        >Continue</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
