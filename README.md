# 🌕 Quantam Core
Core service driving the Quantam client-side interface and Quantam monitoring interface.

![WIP](https://img.shields.io/badge/%20%F0%9F%9A%A7%20-Work%20in%20progress-important)


### Features
1. Fetch stock daily data from one of the configured proxies
1. Fetch stock intra-day data from one of the configured proxies
1. List of configured proxies:
    1. AlphaVantage
    1. MarketStack
    1. Kite


### Tasks
- [x] Add Bunyan global logger
- [ ] Add Bunyan logger on module level
- [x] Add env and config module
- [x] Add postgres module
- [x] Add generic proxy interface
- [x] TypeORM migration
- [ ] Add tests for entities, repo, service
- [ ] Add tests for proxies
- [ ] Add Docker image
- [ ] Separate dev and prod env
- [ ] Update Readme
- [ ] Update APISpecs

