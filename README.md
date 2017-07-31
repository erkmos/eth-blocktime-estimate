Tool to estimate when two blocks will be mined, e.g. to determine start and end blocks for a fundraiser.

## Installing

```
npm install -g eth-blocktime-estimate
```

## Running

Note this requires that you have a an Ethereum node running locally with the RPC interface enabled on port 8545.

```eth-blocktime-estimate -b <start timestamp> -d <duration in days>```

### Options

```
Required:
-b (--begin)    start time (unix timestamp in seconds)
-d (--duration) duration in days (start time + 30 days)

Optional:
-s (--samplesize) how many blocks to use in calculation (default: 5406)
```

## Example
```
> eth-blocktime-estimate -b 1501512066 -d 30

Calculating time between the last 5406 blocks...
Blocktime (expected value): 4.51 seconds
Target starting time: Mon, 31 Jul 2017 14:41:06 GMT
Target starting block: 2918306
Target ending time: Wed, 30 Aug 2017 14:41:06 GMT
Target ending block: 3492559

```