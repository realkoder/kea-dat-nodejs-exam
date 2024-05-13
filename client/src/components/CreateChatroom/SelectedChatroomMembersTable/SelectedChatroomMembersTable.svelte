<script lang="ts">
  import Button from '$lib/components/ui/button/button.svelte';
  import * as Table from '$lib/components/ui/table/index.js';

  export let chatroomMembers;
  export let handleRemoveMember;
</script>

<Table.Root>
  <Table.Caption class="mb-8"
    >A list of your selected chatroom members.</Table.Caption
  >
  <Table.Header>
    <Table.Row>
      <Table.Head class="w-[100px]">Email</Table.Head>
      <Table.Head>Name</Table.Head>
      <Table.Head class="text-right">No.</Table.Head>
      <Table.Head class="text-right">Action</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {#each chatroomMembers as member, i (i)}
      <Table.Row>
        <Table.Cell class="font-medium">{member.email}</Table.Cell>
        <Table.Cell>{member.name}</Table.Cell>
        <Table.Cell class="text-right">{i + 1}</Table.Cell>
        <Table.Cell class="text-right">
          <Button
            variant="destructive"
            on:click={() => handleRemoveMember(member)}>Remove member</Button
          >
        </Table.Cell>
      </Table.Row>
    {/each}
  </Table.Body>
</Table.Root>
