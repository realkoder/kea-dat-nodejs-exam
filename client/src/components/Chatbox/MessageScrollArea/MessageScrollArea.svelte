<script>
  import { Separator } from '$lib/components/ui/separator/index.js';
  import MessageCard from '../MessageCard/MessageCard.svelte';
  import Spinner from '../../../components/Spinner/Spinner.svelte';
  import { afterUpdate, beforeUpdate, onMount } from 'svelte';
  import genericApi from '../../../utils/api/genericApi.js';
  import { BASE_URL } from '../../../stores/generalStore.js';

  export let deleteMessage;
  export let chatMessages;
  export let chatroom;
  export let appendOlderMessages;
  let chatWindowRef;
  let wasAtBottom = false;
  let isMessagesFetchable = true;
  let page = 2;
  let isFetching = false; // New state for spinner visibility

  function scrollToBottom() {
    chatWindowRef.scrollTop = chatWindowRef.scrollHeight;
    wasAtBottom = true;
  }

  function isAtBottom() {
    const { scrollTop, clientHeight, scrollHeight } = chatWindowRef;
    return scrollTop + clientHeight >= scrollHeight - 80;
  }

  function isAtTop() {
    return chatWindowRef.scrollTop === 0;
  }

  async function fetchMoreMessages() {
    if (!isMessagesFetchable || isFetching) return;

    isFetching = true;
    await new Promise(resolve => setTimeout(resolve, 1000)); // Delay for 1 second

    genericApi
      .GET(`${$BASE_URL}/api/v1/messages/${chatroom._id}?page=${page}&limit=10`)
      .then((response) => {
        if (response) {
          return response.json();
        }
        throw new Error('No response received');
      })
      .then((fetchedData) => {
        appendOlderMessages(fetchedData.messages);
        if (fetchedData.messages.length !== 10) isMessagesFetchable = false;
        page = page + 1;
        isFetching = false;

        // Scroll down a bit more after fetching new messages
        chatWindowRef.scrollTop += 100;
      })
      .catch((error) => {
        console.error(error);
        isFetching = false;
      });
  }

  function handleScroll() {
    if (isAtTop() && isMessagesFetchable) {
      fetchMoreMessages();
    }
  }

  afterUpdate(() => {
    if (!chatWindowRef) return;

    if (wasAtBottom) {
      scrollToBottom();
    }
  });

  beforeUpdate(() => {
    if (!chatWindowRef) return;
    wasAtBottom = isAtBottom();
  });

  onMount(() => {
    chatWindowRef.addEventListener('scroll', handleScroll);
  });
</script>

<div class="h-[700px] w-auto overflow-scroll" bind:this={chatWindowRef}>
  {#if isFetching}
    <div class="flex spinner-container justify-center items-center mb-4">
      <Spinner />
    </div>
  {/if}
  {#each chatMessages as message}
    <div class="mb-4 text-sm font-medium leading-none">
      <MessageCard {message} currentChatroom={chatroom} {deleteMessage} />
    </div>
    <Separator class="my-2" />
  {/each}
</div>

<style>
  .spinner-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 1rem;
  }
</style>
