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

const blocksPerDay = 5406;

async function getEstimate(numBlocks = blocksPerDay) {
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

async function getBlocks(startTime, endTime) {
  const timeBetweenBlocks = await getEstimate();
  const now = Math.trunc(new Date().getTime() / 1000);
  const currentBlock = web3.eth.blockNumber;

  const blocksLeftToStart = currentBlock + Math.floor(
    (startTime - now) / timeBetweenBlocks);
  const blocksToEnd = currentBlock + Math.floor(
    (endTime - now) / timeBetweenBlocks);

  return {
    startBlock: blocksLeftToStart,
    endBlock: blocksToEnd,
    blocktime: timeBetweenBlocks,
  };
}

module.exports = {
  getEstimate,
  getBlocks,
};
