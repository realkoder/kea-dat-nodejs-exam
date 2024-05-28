<script>
  import Button from '$lib/components/ui/button/button.svelte';
  import genericApi from '../../utils/api/genericApi';
  import entryImage from '../../assets/images/entry-pic.svg';
  import OtpInput from 'svelte-otp';
  import { BASE_URL } from '../../stores/generalStore';
  import { toast } from 'svelte-sonner';
  import userStore from '../../stores/userStore';
  import { navigate } from 'svelte-routing';

  export let username;
  let otpInstance;

  function handleClick() {
    const verificationCode = otpInstance?.getValue().completevalue;
    if (verificationCode !== '      ' && username) {
      genericApi
        .POST(`${$BASE_URL}/api/v1/auth/verify`, {
          body: { verificationCode, username },
          headers: '',
        })
        .then((response) => {          
          if (response.message === 'Verification successfull') {
            toast.success('You are now verified!');
            userStore.update((user) => ({
              ...response.user,
            }));
            setTimeout(() => {
              navigate('/home');
            }, 1500);
          } else {
            toast.error(
              'Verification failed, please check your credentials and try again.',
            );
          }
        })
        .catch((error) => {
          toast.error('Something went wrong, please try again!');
          console.error('Error during verification: ', error);
        });
    } else {      
      toast.error(
        'Verification failed, please check your credentials and try again.',
      );
    }
  }
</script>

<div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
  <div class="flex items-center justify-center py-12">
    <div class="mx-auto grid w-[350px] gap-6 text-center">
      <span class="text-md"
        >Check your email - fill in your verification code</span
      >
      <OtpInput
        numberOfInputs={6}
        customTextInputClass="bg-white border rounded-sm border-black"
        placeholder="******"
        bind:this={otpInstance}
      />
      <Button on:click={handleClick}>CLICK</Button>
    </div>
  </div>
  <div class="hidden bg-muted lg:block">
    <img
      src={entryImage}
      alt="placeholder"
      width="1920"
      height="1080"
      class="h-screen w-full object-cover"
    />
  </div>
</div>
