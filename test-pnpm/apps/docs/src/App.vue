<script setup>
import { tips } from '@repo/utils';
import { FormatMoney, Slider } from '@repo/ui';
import { FetchWrapper } from './utils/fetch-wrapper';

//tips('我是docs项目');
// usage-example.ts

const fetchWrapper = new FetchWrapper();

/* 
// usage-example.ts
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
sendData(); */

async function startPolling() {
  try {
    const response = await fetchWrapper.pollRequest(
      'https://api.example.com/data',
      5000,
      (response) => response.ok,
      { headers: { 'Content-Type': 'application/json' } },
      true
    );
    const data = await response.json();
    console.log('Polling data:', data);
  } catch (error) {
    console.error('Polling error:', error.message);
  }
}

async function singleRequest() {
  try {
    const response = await fetchWrapper.pollRequest(
      'https://api.example.com/data',
      5000,
      (response) => response.ok,
      { headers: { 'Content-Type': 'application/json' } },
      false
    );
    const data = await response.json();
    console.log('Single request data:', data);
  } catch (error) {
    console.error('Single request error:', error.message);
  }
}

startPolling();
singleRequest();

// To cancel the request
// fetchWrapper.cancelRequest();
</script>

<template>
  <h1>docs项目</h1>
  <Slider></Slider>
</template>
<style scoped>
h1 {
  margin-bottom: 50px;
}
</style>
