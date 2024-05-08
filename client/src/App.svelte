<script>
  import { Router, Route } from 'svelte-routing';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner';

  import { Buffer } from 'buffer';
  globalThis.Buffer = Buffer;

  // Store
  import isAuthenticated, { setAuthenticatedStatus } from './stores/authStore';
  import { BASE_URL } from './stores/generalStore';

  // Utils
  import { verifyAuth, redirectToLogin } from './utils/api/auth';
  import genericApi from './utils/api/genericApi';

  // Pages
  import Home from './pages/Home/Home.svelte';
  import Login from './pages/Auth/Login.svelte';
  import ResetPassword from './pages/ResetPassword/ResetPassword.svelte';

  // Rsocket
  import { CustomRSocket } from './modules/RSocketClient.js';

  export let url = '';
  let rsocket;

  async function handleLogout() {
    const data = await genericApi.GET($BASE_URL + '/api/v1/auth/logout');
    if (data.status >= 200 && data.status <= 300) {
      isAuthenticated.set(false);
      toast(`You've successfully logged out!`);
    } else {
      toast('Something went wrong logging you out, please try again!');
    }
  }

  onMount(async () => {
    rsocket = await CustomRSocket.CreateAsync();
    rsocket.requestStream('test', 'DET ER NU');

    // rsocket = await initRSocket();
    // await requestStream(rsocket, 'test', 'LOOKL').then(response => console.log(response));

    // const observable = await requestStream(rsocket, 'test', 'hej');
    // observable.subscribe({
    //   next(data) {
    //     console.log('Received data:', data);
    //     // Handle each piece of data as it arrives
    //   },
    //   error(err) {
    //     console.error('Error:', err);
    //     // Handle any errors that occur
    //   },
    //   complete() {
    //     console.log('Stream completed');
    //     // Handle completion of the stream
    //   },
    // });

    if (
      !$isAuthenticated &&
      window.location.pathname !== '/' &&
      window.location.pathname !== '/reset-password'
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
      }
    }
  });
</script>

<Toaster />

<ModeWatcher defaultMode={'light'} track={false} />

<Router {url}>
  <main>
    <button
      on:click={() => {
        // fireAndForget(rsocket, 'test', 'hej');
      }}>CLICK IT</button
    >
    <section>
      <Route path="/" component={Login} />
      <Route path="/home" component={Home} />
      <Route path="/reset-password" component={ResetPassword} />
    </section>
  </main>
</Router>
