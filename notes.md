# Link3

- Links (clone linktree)

- Allow to add categories to links

- Allow to charge/buy to reveal link (onlyFans)

- Allow to hide the link for certain wallet(s) - ban

### (optional) count on clicks with frontend method
### (optional) add some sort of analytics 

## Categories for links and show only certain categories 
- https://www.producthunt.com/posts/metabio

### Extras

## Use WalletConnect to bridge all of these

**Project id:**
```
57baeb311fe2753a3d9b8fe3b91d5e53
```

### Useful
https://github.com/near-apps/linkdrop-proxy

## TODOs
- [] Validate wallets by using other chain contracts etc.


# Compile & Deploy

## Compile for release
```
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release

```
## Deploy to devnet
```
near dev-deploy --wasmFile target/wasm32-unknown-unknown/release/link3.wasm --initFunction new --initArgs '{"title": "My first Link3", "description": "Wow such description much detail", "image_uri": "https://cryptomonday.de/uploads/2021/10/7a97kbmm-300x185.jpg" }' --initDeposit 1

````

### Load dev account ENV variable
```
source neardev/dev-account.env
```
Check if it was correctly loaded
```
echo $CONTRACT_NAME
````

# Interact with the contract with the near-cli
```
// Then uses with
near view $echo $CONTRACT_NAME method_name
// or
near call $CONTRACT_NAME method_name '{ "param": "value" }'
```

# Contract METHODS

### List item as ItemInfo, if user has access will have the uri and image, null or image_preview otherwise, id to 'buy'
```
near view $CONTRACT_NAME list
```

### List all links that are public and not premium
```
near view $CONTRACT_NAME list_public
```

### List all links the caller has access to
```
near view $CONTRACT_NAME list_accessable
```

## Create links
```
near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "https://github.com/joaquimley", "title": "GitHub", "description":"My GitHub profile page", "image_uri": "https://github.githubassets.com/images/modules/logos_page/Octocat.png", "is_public":true, "is_premium":false }'


near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "https://linkedin.com/in/joaquimley", "title": "LinkedIn", "description":"My premium linkedin page", "image_uri": "https://cdn-icons-png.flaticon.com/512/174/174857.png", "is_public":true, "is_premium":true, "image_preview_uri":"https://cdn.icon-icons.com/icons2/2428/PNG/512/linkedin_black_logo_icon_147114.png", "price":1 }'


near call $CONTRACT_NAME --accountId $CONTRACT_NAME create_link '{ "uri": "https://google.com", "title": "Google", "description":"Google main page", "image_uri": "https://logoeps.com/wp-content/uploads/2011/02/google-logo-vector.png", "is_public":true, "is_premium":true, "image_preview_uri":"https://cdn.freebiesupply.com/logos/large/2x/google-g-2015-logo-png-transparent.png", "price":1 }'

```
