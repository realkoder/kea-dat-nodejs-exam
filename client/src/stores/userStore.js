import { writable } from 'svelte/store';

const storedUser = localStorage.getItem('user');
const initialUser = storedUser
  ? JSON.parse(storedUser)
  : { id: '', username: '' };

const userStore = writable(initialUser);

userStore.subscribe((value) => {  
  localStorage.setItem('user', JSON.stringify(value));
});

export default userStore;
