# Pricing Cache

ccusage fetches model pricing data from [LiteLLM](https://github.com/BerriAI/litellm) to calculate token costs. By default this requires a network request on every startup, which can be slow depending on network conditions.

## Disk Cache

Starting from v18.0.10, ccusage automatically caches the fetched pricing data to disk. After the first successful fetch, subsequent runs read from the local cache instead of hitting the network.

**Cache location:**

| Platform      | Path                                         |
| ------------- | -------------------------------------------- |
| macOS / Linux | `~/.cache/ccusage/pricing-cache.json`        |
| Custom XDG    | `$XDG_CACHE_HOME/ccusage/pricing-cache.json` |

**Cache lifetime:** 7 days. After expiry, ccusage fetches fresh data from LiteLLM and updates the cache automatically.

## How It Works

On each startup the pricing fetcher checks in this order:

1. **In-memory cache** – reused within the same process (no I/O)
2. **Disk cache** – read from `pricing-cache.json` if present and not expired
3. **Network fetch** – hit LiteLLM only if both caches miss; result is saved to disk for next time

This means the network round-trip happens **at most once per 7 days**.

## Offline Mode

If you want to skip all network and disk I/O entirely, use the built-in `--offline` flag. This uses pricing data that was embedded into the binary at build time:

```bash
ccusage daily --offline
```

The embedded snapshot may be slightly out of date compared to the disk cache, but works with no filesystem access.

## Clearing the Cache

To force a fresh fetch from LiteLLM, delete the cache file:

```bash
rm ~/.cache/ccusage/pricing-cache.json
```

The next run will fetch and rebuild the cache automatically.
