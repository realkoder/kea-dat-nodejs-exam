import { writable } from 'svelte/store';
const isAuthenticated = writable(false);

export function setAuthenticatedStatus(authenticatedStatus) {
  isAuthenticated.set(authenticatedStatus);
}

export default isAuthenticated;
