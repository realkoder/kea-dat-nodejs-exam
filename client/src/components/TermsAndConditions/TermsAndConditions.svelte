<script lang="js">
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import { Button } from '$lib/components/ui/button/index.js';
    import { Switch } from "$lib/components/ui/switch";
  
    export let termsAccepted;
  </script>
  
  <Sheet.Root>
    <Sheet.Trigger asChild let:builder>
      <div class="flex text-gray-400 hover:text-gray-800 p-2 ml-6 mr-6 flex-row items-center justify-between border rounded-md">
        <Button builders={[builder]} variant='' >Accept terms and conditions!</Button>
        <Switch bind:checked={termsAccepted} />
      </div>
    </Sheet.Trigger>
    <Sheet.Content side="right">
      <Sheet.Header>
        <Sheet.Title>Terms and Conditions</Sheet.Title>
      </Sheet.Header>
      <div class="p-4">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
      <Sheet.Footer>
        <Sheet.Close asChild let:builder>
          <Button builders={[builder]} type="button">Close</Button>
        </Sheet.Close>
      </Sheet.Footer>
    </Sheet.Content>
  </Sheet.Root>
  