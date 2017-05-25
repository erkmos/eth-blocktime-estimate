const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const _ = require('lodash');
const Promise = require('bluebird');

const getBlock = Promise.promisify(web3.eth.getBlock);

function getLastNBlocks(count = 701) {
  const currentBlock = web3.eth.blockNumber;
  return Promise.map(
    _.times(count),
    (n) => getBlock(currentBlock - n),
    { concurrency: 10 });
}

function getExpectedTime(arr) {
  const histogram = _.countBy(arr, _.identity);
  const totalTime = _.sum(_.values(histogram));

  return _.sumBy(_.keys(histogram), (key) => {
    const blockTime = parseInt(key, 10);
    const occurrences = histogram[key];
    return blockTime * (occurrences / totalTime);
  });
}

async function expectedBlockTime() {
  const numBlocks = 5400;
  const blocks = await getLastNBlocks(numBlocks);
  const timediffs = [];

  let lastBlock = blocks[0];

  for (let i = 0; i < numBlocks; i += 1) {
    const block = blocks[i];
    timediffs.push(Math.abs(block.timestamp - lastBlock.timestamp));
    lastBlock = block;
  }

  return getExpectedTime(timediffs);
}

function printTimes(timeBetweenBlocks, startTimestamp, endTimestamp) {
  const now = Math.trunc(new Date().getTime() / 1000);
  const currentBlock = web3.eth.blockNumber;

  const blocksLeftToStart = Math.trunc(
    (startTimestamp - now) / timeBetweenBlocks);
  const blocksToEnd = Math.trunc((endTimestamp - now) / timeBetweenBlocks);

  console.log(
    'Blocktime (expected value):', timeBetweenBlocks.toFixed(2), 'seconds');
  console.log(
    'Target starting time:', new Date(startTimestamp * 1000).toUTCString());
  console.log(
    'Target starting block:', currentBlock + blocksLeftToStart);
  console.log(
    'Target ending time:', new Date(endTimestamp * 1000).toUTCString());
  console.log(
    'Target ending block:', currentBlock + blocksToEnd);
}

async function main() {
  const startTimestamp = 1495987200;
  const endTimestamp = startTimestamp + (86400 * 60);

  console.log('Calculating time between the last 5400 blocks...');
  const timeBetweenBlocks = await expectedBlockTime();
  printTimes(timeBetweenBlocks, startTimestamp, endTimestamp);
}

main();
