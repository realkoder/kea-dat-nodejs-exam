import genericApi from './genericApi';

export async function verifyAuth(url) {
  try {
    const response = await genericApi.GET(url);
    const result = await response.json();
    const isSuccessful =
      response.status >= 200 &&
      response.status < 300 &&
      result.data === 'Authenticated';
    return isSuccessful;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}

export function redirectToLogin() {
  window.location.href = '/';
}
