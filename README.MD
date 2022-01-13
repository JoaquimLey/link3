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
near dev-deploy --wasmFile target/wasm32-unknown-unknown/release/link3.wasm --initFunction new --initArgs '{"title": "My first Link3", "description": "Wow such description much detail", "image_uri": "https://cryptomonday.de/uploads/2021/10/7a97kbmm-300x185.jpg" }' --initDeposit 1
````

### Load dev account ENV variable
```bash
source neardev/dev-account.env
```
Check if it was correctly loaded
```bash
echo $CONTRACT_NAME

// Should print the dev account something like:
$ dev-1642022356114-95915049874087
````

# Interact with the contract via the [near-cli](https://github.com/near/near-cli)

### You can interact with contract with `view` or `call` 

```bash
// View method
near view $CONTRACT_NAME method_name

// Call function (passing 1 NEAR)
near call $CONTRACT_NAME method_name '{ "param": "value" }' --amount 1
```

# Contract API

List item as `ItemInfo`, if user has access it will have the `uri` and `image`, otherwise the `uri` will be `null` and the returned  `image` will be the `image_preview`.
```bash
near view $CONTRACT_NAME list
```

### List all links that are public and not premium
```bash
near view $CONTRACT_NAME list_public
```

### List all links the caller has access to
```bash
near view $CONTRACT_NAME list_accessable
```


## Create a link/item

```bash
near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "URI", "title": "TITLE", "description":"DESCRIPTION", "image_uri": "IMAGE_PRIVATE_IF_PREMIUM", "image_preview_uri" : "ALWAYS_PUBLIC", "is_published" : true|false, "is_premium" : true|false, "price" : 1 /* If premium, price in NEAR */ }'
```

## Example links

**GitHub**
```bash
near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "https://github.com/joaquimley", "title": "GitHub", "description":"My GitHub profile page", "image_uri": "https://github.githubassets.com/images/modules/logos_page/Octocat.png", "is_published" : true, "is_premium" : false }'
```

**LinkedIn** (Premium costs 1 NEAR to unlock)
```bash
near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "https://linkedin.com/in/joaquimley", "title": "LinkedIn", "description":"My premium linkedin page", "image_uri": "https://cdn-icons-png.flaticon.com/512/174/174857.png", "is_published":true, "is_premium" : true, "image_preview_uri":"https://cdn.icon-icons.com/icons2/2428/PNG/512/linkedin_black_logo_icon_147114.png", "price" : 1 }'
```

**NEAR.org** (Premium costs 4 NEAR to unlock)
```bash
near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "https://near.org", "title": "NEAR", "description":"NEAR is on a mission to empower everyone to take back control of their money, their data, and their identity.", "image_uri": "https://research.binance.com/static/images/projects/near-protocol/logo.png", "is_published" : true, "is_premium" : true, "image_preview_uri": "https://near.org/wp-content/uploads/2021/09/brand-horizontal-rev-300x300.png", "price" : 4 }'
```
