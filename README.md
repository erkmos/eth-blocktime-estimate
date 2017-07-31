Tool to estimate when two blocks will be mined, e.g. to determine start and end blocks for a fundraiser.

## Installing

```
npm install -g eth-blocktime-estimate
```

## Running

```eth-blocktime-estimate -s <start timestamp> -d <duration in days>```

### Options

```
Required:
-s (--begin)    start time (unix timestamp in seconds)
-d (--duration) duration in days (start time + 30 days)

Optional:
-t (--target) expected number of blocks per day (default: 5406)
```

## Example
```
> eth-blocktime-estimate -s 1501512066 -d 30

Blocktime (expected value): 4.51 seconds
Target starting time: Mon, 31 Jul 2017 14:41:06 GMT
Target starting block: 2918305
Target ending time: Wed, 30 Aug 2017 14:41:06 GMT
Target ending block: 3492582

```