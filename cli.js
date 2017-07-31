const { getEstimate, getBlocks } = require('./main');
const commandLineArgs = require('command-line-args');
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

const optionDefinitions = [
  { name: 'begin', alias: 's', type: Number },
  { name: 'duration', alias: 'd', type: Number, defaultValue: 30 },
];

function throwIfBlank(name, value) {
  if (value === undefined || value === null || value === 0) {
    throw new Error(`need to specify ${name}`);
  }
}

function checkArguments({ begin, duration }) {
  throwIfBlank('begin', begin);
  throwIfBlank('duration', duration);
}

const blocksPerDay = 5406;

async function main() {
  const options = commandLineArgs(optionDefinitions);
  checkArguments(options);

  const startTimestamp = options.begin;
  const endTimestamp = startTimestamp + (86400 * options.duration);

  console.log(`Calculating time between the last ${blocksPerDay} blocks...`);
  const {
    startBlock, endBlock, blocktime,
   } = await getBlocks(startTimestamp, endTimestamp);

  console.log(
    'Blocktime (expected value):', blocktime.toFixed(2), 'seconds');
  console.log(
    'Target starting time:', new Date(startTimestamp * 1000).toUTCString());
  console.log(
    'Target starting block:', startBlock);
  console.log(
    'Target ending time:', new Date(endTimestamp * 1000).toUTCString());
  console.log(
    'Target ending block:', endBlock);
}

main().catch(console.error);
