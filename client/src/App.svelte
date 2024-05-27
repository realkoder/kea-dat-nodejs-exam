<script>
  import { Router, Route } from 'svelte-routing';  
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner';

  import { Buffer } from 'buffer';
  globalThis.Buffer = Buffer;

  // STORE
  import isAuthenticated, { setAuthenticatedStatus } from './stores/authStore';
  import { BASE_URL } from './stores/generalStore';
  import { fetchChatrooms } from './stores/chatroomStore';

  // SVELTE / UTILS
  import { onMount } from 'svelte';
  import { verifyAuth, redirectToLogin } from './utils/api/auth';


  // PAGES
  import Home from './pages/Home/Home.svelte';
  import Login from './pages/Auth/Login.svelte';
  import ResetPassword from './pages/ResetPassword/ResetPassword.svelte';
  import Chat from './pages/Chat/Chat.svelte';
  import Verification from './pages/Verification/Verification.svelte';      

  export let url = '';

  onMount(async () => {
    if (
      !$isAuthenticated &&
      window.location.pathname !== '/' &&
      window.location.pathname !== '/reset-password' &&
      !window.location.pathname.includes('/verification')
    ) {
      const isAuthenticated = await verifyAuth(
        `${$BASE_URL}/api/v1/auth/verifyAuth`,
      );
      console.log('Authentication Status:', isAuthenticated);

      if (!isAuthenticated) {
        console.log(
          'Redirecting to login because authentication status is false.',
        );
        setAuthenticatedStatus(false);
        redirectToLogin();
      } else {
        console.log('Setting authenticated status to true.');
        setAuthenticatedStatus(true);
        fetchChatrooms();
      }
    }
  });
</script>

<Toaster />

<ModeWatcher defaultMode={'light'} track={false} />

<Router {url}>
  <main>
    <section>
      <Route path="/" component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/chat/:chatroomId" component={Chat} />
      <Route path="/verification/:username" component={Verification} />
      <Route path="/reset-password" component={ResetPassword} />
    </section>
  </main>
</Router>
