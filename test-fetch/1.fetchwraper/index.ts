import { FetchWrapper } from './fetchwraper';
// usage-example.ts

const fetchWrapper = new FetchWrapper();

async function fetchData() {
  try {
    const response = await fetchWrapper.get('https://api.example.com/data', {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

async function sendData() {
  try {
    const response = await fetchWrapper.post(
      'https://api.example.com/data',
      JSON.stringify({ key: 'value' }),
      { headers: { 'Content-Type': 'application/json' }, timeout: 5000 }
    );
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    console.log(result);
  } catch (error) {
    console.error('Fetch error:', error.message);
  }
}

fetchData();
sendData();

// To cancel the request
// fetchWrapper.cancelRequest();
