/**
 *
 * @param {String} url
 */
function GET(url) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
    .then((response) => {      
      if (!response.ok) throw new Error(`HTTP status ${response.status}`);
      return response;
    })
    .catch((error) => {
      console.error('Fetch error:', error);
      throw error;
    });
}

function POST(url, { body, headers }) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error);
}

function PUT(url, { body, headers }) {
  return fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((result) => result)
    .catch((error) => error);
}

export default {
  GET,
  POST,
  PUT,
};
