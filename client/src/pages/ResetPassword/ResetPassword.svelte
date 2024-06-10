<script lang="ts">
  import { navigate } from 'svelte-routing';
  import { toast } from 'svelte-sonner';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';

  import { BASE_URL } from '../../stores/generalStore.js';

  import { resetPasswordSchema } from '../../utils/schema/resetPasswordSchema.js';

  import genericApi from '../../utils/api/genericApi.js';

  let secretPhrase = '';
  let email = '';
  let newPassword = '';
  let confirmPassword = '';

  let validationErrors = {};

  async function handleResetPassword() {
    const resetPasswordInputs = {
      secretPhrase,
      email,
      newPassword,
      confirmPassword,
    };
    if (newPassword !== confirmPassword) {
      toast.error('Password must match, please try again');
      return;
    }
    try {
      resetPasswordSchema.parse(resetPasswordInputs);
      console.log(resetPasswordInputs);
      const response = await genericApi.PUT(
        `${$BASE_URL}/api/v1/auth/reset-password`,
        {
          body: {
            secretPhrase,
            email: email.toLocaleLowerCase(),
            password: newPassword,
          },
          headers: '',
        },
      );
      const isSuccessfull = response.data.includes('Success');
      if (isSuccessfull) {
        toast.success('Password has been changed, redirecting to login');
        setTimeout(() => {
          navigate('/');
        }, 1000);
      }
    } catch (error) {
      if (error.formErrors && error.formErrors.fieldErrors) {
        validationErrors = error.formErrors.fieldErrors;
        console.error('Validation errors: ', validationErrors);
      } else {
        toast.error('An error occurred. Please try again later.');
        console.error('Error:', error);
      }
    }
  }
</script>

<section>
  <form
    on:submit|preventDefault={handleResetPassword}
    class="flex min-h-screen items-center"
  >
    <Card.Root class="mx-auto max-w-sm">
      <Card.Header>
        <Card.Title class="text-2xl">Reset Password</Card.Title>
        <Card.Description
          >Enter your secret phrase, alongside your new password</Card.Description
        >
      </Card.Header>
      <Card.Content>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="secretPhrase">Secret Phrase</Label>
            <Input
              id="secretPhrase"
              bind:value={secretPhrase}
              type="text"
              placeholder="The Wizard of Oz!"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              bind:value={email}
              type="email"
              placeholder="jon@doe.com"
              required
            />
          </div>
          <div class="mt-6 grid gap-2">
            <div class="flex items-center">
              <Label for="newPassword">New Password</Label>
            </div>
            <Input
              id="newPassword"
              bind:value={newPassword}
              type="password"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="confirmPassword">Confirm Password</Label>
            </div>
            <Input
              id="confirmPassword"
              bind:value={confirmPassword}
              type="password"
              required
            />
          </div>
          <Button type="submit" class="mt-3 w-full">Reset Password</Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Don&apos;t want to reset?
          <button on:click={() => navigate('/')} class="underline"
            >Go back to login</button
          >
        </div></Card.Content
      >
    </Card.Root>
  </form>
</section>
