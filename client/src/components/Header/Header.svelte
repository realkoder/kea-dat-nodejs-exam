<script>
  import { Button } from '$lib/components/ui/button/index.js';
  import { navigate } from 'svelte-routing';
  import { toast } from 'svelte-sonner';

  // Store
  import isAuthenticated from '../../stores/authStore';
  import { BASE_URL } from '../../stores/generalStore';
  import userStore from '../../stores/userStore';

  // UTILS
  import genericApi from '../../utils/api/genericApi';

  async function handleLogout() {
    const data = await genericApi.GET($BASE_URL + '/api/v1/auth/logout');
    if (data.status >= 200 && data.status <= 300) {
      isAuthenticated.set(false);
      toast.success(`You've successfully logged out!`);
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      toast.error('Something went wrong logging you out, please try again!');
    }
  }
</script>

<header
  class="sticky top-0 z-10 flex h-[53px] items-center gap-1 border-b bg-background px-4"
>
  <h1 class="text-xl font-semibold">IntelliOptima</h1>
  <h1 class="ml-auto text-xl font-semibold">
    Welcome {$userStore.username}
  </h1>
  <Button
    on:click={handleLogout}
    variant="outline"
    size="sm"
    class="ml-auto gap-1.5 text-sm"
  >
    Logout
  </Button>
</header>
