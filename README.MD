# Link3

- Create Links (similar to linktree)

- Allow to add categories to links

- Allow to charge/buy to reveal link `uri` (Gated content)

- Allow to hide the link for certain wallet(s) - ban

### Extras
- Expires (becomes invalid after X timestamp)
- Category metadata

## TODO & Ideas
- [ ] Validate wallets by using other chain contracts etc.
- [ ] Count # of clicks with frontend tracking call
- [ ] Add some sort of analytics
- [ ] Maybe add social media profile verification 


### Useful links
- https://github.com/near-apps/linkdrop-proxy
  
- https://www.producthunt.com/posts/metabio

# Development & Testing

## Compile for release
```
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
```
## Deploy to devnet
```bash
near dev-deploy --wasmFile target/wasm32-unknown-unknown/release/link3.wasm --initArgs '{"title": "My first Link3", "description": "Wow such description much detail", "image_uri": "https://cryptomonday.de/uploads/2021/10/7a97kbmm-300x185.jpg" }' --initDeposit 1
````

### Load dev account ENV variable
```bash
source neardev/dev-account.env
```

Check if it was correctly loaded
```bash
echo $CONTRACT_NAME
```

Should print the dev account:
```bash
dev-1642022356114-95915049874087
````

# Interacting with the contract via the [near-cli](https://github.com/near/near-cli)
There are two types of interactions with the contract: `view` or `call` 

```bash
// View method
near view $CONTRACT_NAME method_name

// Call a function (passing 1 NEAR)
near call $CONTRACT_NAME -accountId $ACCOUNT_ID method_name '{ "param": "value" }' --amount 1
```
_`near-cli` Call methods require an account id to be specified (use --accountId or --account_id)_

# Contract API

## [VIEW] methods
### List all links that are published mapped as `ItemInfo`
```bash
near view $CONTRACT_NAME list
```

## [CALL] methods

### List all links (only the owner can call)
```bash
near call $CONTRACT_NAME --accountId $CONTRACT_NAME list_all
```

## Create a link item

```bash
near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "URI", "title": "TITLE", "description":"DESCRIPTION", "image_uri": "IMAGE_URL", "is_published" : true|false }'
```

### Example links

**GitHub**
```bash
near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "https://github.com/joaquimley", "title": "GitHub", "description":"My GitHub profile page", "image_uri": "https://github.githubassets.com/images/modules/logos_page/Octocat.png", "is_published" : true }'
```

**LinkedIn**
```bash
near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "https://linkedin.com/in/joaquimley", "title": "LinkedIn", "description":"My premium linkedin page", "image_uri": "https://cdn-icons-png.flaticon.com/512/174/174857.png", "is_published":true  }'
```

**NEAR.org**
```bash
near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "https://near.org", "title": "NEAR", "description":"NEAR is on a mission to empower everyone to take back control of their money, their data, and their identity.", "image_uri": "https://research.binance.com/static/images/projects/near-protocol/logo.png", "is_published" : true }'
```
