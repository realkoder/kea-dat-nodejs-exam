import genericApi from '../utils/api/genericApi';
import { get, writable } from 'svelte/store';
import { BASE_URL } from '../stores/generalStore';
import userStore from './userStore';

const chatroomStore = writable([]);

export function fetchChatrooms() {  
  genericApi
    .GET(`${get(BASE_URL)}/api/v1/chatrooms/userId/${get(userStore).id}`)
    .then((response) => {
      if (response) {
        return response.json();
      }
      throw new Error('No response received');
    })
    .then((fetchedData) => {
      chatroomStore.set(sortChatroomByLatestMessageOrCreatedData(fetchedData));      
    })
    .catch((error) => console.error(error));
}

function sortChatroomByLatestMessageOrCreatedData(data) {
  return data.chatrooms.sort((a, b) => {
    const getDate = (chatroom) => {
      if (chatroom.messages.length > 0) {
        return new Date(
          chatroom.messages[chatroom.messages.length - 1].createdAt,
        );
      } else {
        return new Date(chatroom.createdAt);
      }
    };
    const dateA = getDate(a);
    const dateB = getDate(b);
    return dateB.getTime() - dateA.getTime();
  });
}

export default chatroomStore;
