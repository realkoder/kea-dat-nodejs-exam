<script lang="ts">
  import * as Select from '$lib/components/ui/select/index.js';

  export let handleChange;

  export let users;
</script>

<Select.Root portal={null}>
  <Select.Trigger class="w-[180px]">
    <Select.Value placeholder="Select a user" />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>Users</Select.Label>
      {#each users as user}
        <Select.Item
          value={user.name}
          label={user.name}
          on:click={() => {
            handleChange(user);
          }}>{user.name}</Select.Item
        >
      {/each}
    </Select.Group>
  </Select.Content>
  <Select.Input name="favoriteFruit" />
</Select.Root>
