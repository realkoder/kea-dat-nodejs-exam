<script lang="ts">
  import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
  import { Button } from '$lib/components/ui/button/index.js';

  export let title;
  export let item;
  export let handleAccept;
  export let toggleAlertDialogIsClicked;
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger asChild let:builder>
    <Button
      on:click={() => toggleAlertDialogIsClicked?.()}
      builders={[builder]}
      variant="destructive">{title}</Button
    >
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title
        >Are you sure about deleting the {item}</AlertDialog.Title
      >
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your {item}
        and remove your {item} related data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel on:click={() => toggleAlertDialogIsClicked?.()}
        >Cancel</AlertDialog.Cancel
      >
      <AlertDialog.Action on:click={() => handleAccept()}
        >Continue</AlertDialog.Action
      >
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
