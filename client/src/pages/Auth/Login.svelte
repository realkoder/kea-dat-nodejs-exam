<script lang="js">
  import { navigate } from 'svelte-routing';
  import { toast } from 'svelte-sonner';
  import * as Tabs from '$lib/components/ui/tabs/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  import entryImage from '../../assets/images/entry-pic.svg';

  import { userSchema } from '../../utils/schema/userSchema.js';
  import { loginSchema } from '../../utils/schema/loginSchema.js';
  import { forgottenPasswordSchema } from '../../utils/schema/forgottenPasswordSchema.js';

  import { BASE_URL } from '../../stores/generalStore.js';
  import genericApi from '../../utils/api/genericApi.js';
  import userStore from '../../stores/userStore';

  let name = '';
  let email = '';
  let secretPhrase = '';
  let username = '';
  let password = '';

  let validationErrors = {};

  function handleLoginSubmit() {
    const loginInputs = {
      username: username.toLocaleLowerCase(),
      password: password,
    };
    toast.info('Logging you in...');
    try {
      loginSchema.parse(loginInputs);
      genericApi
        .POST(`${$BASE_URL}/api/v1/auth/login`, {
          body: loginInputs,
          headers: '',
        })
        .then((response) => {
          console.log(response);
          if (response.message === 'Login successfull') {
            toast.success('Login successful!');
            userStore.update((user) => ({
              ...response.user,
            }));
            setTimeout(() => {
              navigate('/home');
            }, 1000);
          } else {
            toast('Login failed, please check your credentials and try again.');
          }
        })
        .catch((error) => {
          toast.error('Something went wrong, please try again!');
          console.error('Error during login: ', error);
        });
    } catch (error) {
      validationErrors = error.formErrors.fieldErrors;
      console.error('Validation errors: ', validationErrors);
    }
  }

  function handleNewUserSubmit() {
    const userInputs = {
      name: name.toLowerCase(),
      email: email.toLocaleLowerCase(),
    };
    const loginUserInputs = {
      username: username.toLocaleLowerCase(),
      password: password,
      secretPhrase: secretPhrase,
    };
    toast.info('Creating new user with login!');
    try {
      userSchema.parse(userInputs);
      loginSchema.parse(loginUserInputs);

      genericApi
        .POST(`${$BASE_URL}/api/v1/auth/`, {
          body: {
            name: userInputs.name,
            email: userInputs.email,
            username: loginUserInputs.username,
            password: loginUserInputs.password,
            secretPhrase: loginUserInputs.secretPhrase,
          },
          headers: '',
        })
        .then(() => {
          toast.success(
            'New account created, please verify your account to login - check your email',
          );
          setTimeout(() => {
            navigate(`/verification/${loginUserInputs.username}`);
          }, 2000);
        })
        .catch(() => toast.error('Something went wrong, please try again'));
    } catch (error) {
      validationErrors = error.formErrors.fieldErrors;
      console.error('Validation errors: ', validationErrors);
      toast.error('Your credentials was not accepted.');
    }
  }

  function handleForgotPassword() {
    const forgottenPasswordInputs = {
      username: username.toLocaleLowerCase(),
      email: email.toLocaleLowerCase(),
    };
    try {
      forgottenPasswordSchema.parse(forgottenPasswordInputs);
      genericApi
        .POST(`${$BASE_URL}/api/v1/auth/forgot-password`, {
          body: forgottenPasswordInputs,
          headers: '',
        })
        .then(() => toast.info('New password has been sent to email'))
        .catch(() => toast.error('Something went wrong, please try again!'));
    } catch (error) {}
  }
</script>

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
  <div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6">
      <Tabs.Root value="login" class="w-[400px]">
        <Tabs.List class="grid w-full grid-cols-3">
          <Tabs.Trigger value="login">Login</Tabs.Trigger>
          <Tabs.Trigger value="signup">Signup</Tabs.Trigger>
          <Tabs.Trigger value="forgotPassword">Forgot Password</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="login">
          <form on:submit|preventDefault={handleLoginSubmit}>
            <Card.Root>
              <Card.Header>
                <Card.Title>Login</Card.Title>
                <Card.Description>
                  Enter username & password to login.
                </Card.Description>
              </Card.Header>
              <Card.Content class="space-y-2">
                <div class="space-y-1">
                  <Label for="username">Username</Label>
                  <Input
                    id="username"
                    bind:value={username}
                    type="text"
                    placeholder="JonDoe1993"
                    required
                  />
                </div>
                <div class="space-y-1">
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    bind:value={password}
                    type="password"
                    placeholder="myPassword123"
                    required
                  />
                </div>
              </Card.Content>
              <Card.Footer class="mx-auto flex w-max">
                <Button type="submit">Login</Button>
              </Card.Footer>
            </Card.Root>
          </form>
        </Tabs.Content>
        <Tabs.Content value="signup">
          <form on:submit|preventDefault={handleNewUserSubmit}>
            <Card.Root>
              <Card.Header>
                <Card.Title>Signup</Card.Title>
                <Card.Description
                  >Signup, and get your account.</Card.Description
                >
              </Card.Header>
              <Card.Content class="space-y-2">
                <div class="space-y-1">
                  <Label for="name">Name</Label>
                  <Input
                    id="name"
                    bind:value={name}
                    type="text"
                    placeholder="Jon Doe"
                    required
                  />
                </div>
                <div class="space-y-1">
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    bind:value={email}
                    type="email"
                    placeholder="jondoe@hotmail.com"
                    required
                  />
                </div>
                <div class="space-y-1">
                  <Label for="username">Username</Label>
                  <Input
                    id="username"
                    bind:value={username}
                    type="text"
                    placeholder="JonDoe1993"
                    required
                  />
                </div>
                <div class="space-y-1">
                  <Label for="password">Password</Label>
                  <Input
                    id="password"
                    bind:value={password}
                    type="password"
                    placeholder="myPassword123"
                    required
                  />
                </div>
                <div class="space-y-1">
                  <Label for="secretPhrase">Secret Phrase</Label>
                  <Input
                    id="secretPhrase"
                    bind:value={secretPhrase}
                    type="text"
                    placeholder="The Wizard of Oz"
                    required
                  />
                </div>
              </Card.Content>
              <Card.Footer class="mx-auto flex w-max">
                <Button type="submit">Signup New User</Button>
              </Card.Footer>
            </Card.Root>
          </form>
        </Tabs.Content>
        <Tabs.Content value="forgotPassword">
          <form on:submit|preventDefault={handleForgotPassword}>
            <Card.Root>
              <Card.Header>
                <Card.Title>Forgot Password</Card.Title>
                <Card.Description>
                  Enter username & email to request new password.
                </Card.Description>
              </Card.Header>
              <Card.Content class="space-y-2">
                <div class="space-y-1">
                  <Label for="username">Username</Label>
                  <Input
                    id="username"
                    bind:value={username}
                    type="text"
                    placeholder="JonDoe1993"
                    required
                  />
                </div>
                <div class="space-y-1">
                  <Label for="email">Email</Label>
                  <Input
                    id="email"
                    bind:value={email}
                    type="email"
                    placeholder="jondoe@hotmail.com"
                    required
                  />
                </div>
              </Card.Content>
              <Card.Footer class="mx-auto flex w-max">
                <Button type="submit">Request New Password</Button>
              </Card.Footer>
            </Card.Root>
          </form>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  </div>
  <div class="bg-muted hidden lg:block">
    <img
      src={entryImage}
      alt="placeholder"
      width="1920"
      height="1080"
      class="h-screen w-full object-cover"
    />
  </div>
</div>
