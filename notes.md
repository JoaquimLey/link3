# Link3

- Links (clone linktree)

- Allow to add categories to links

- Allow to charge/buy to reveal link (onlyFans)

- Allow to hide the link for certain wallet(s) - ban

### (optional) count on clicks with frontend method
### (optional) add some sort of analytics 

## Categories for links and show only certain categories 
- https://www.producthunt.com/posts/metabio


# Deevlopment

## Compile for release
```
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
```
## Deploy to devnet
```
near dev-deploy --wasmFile target/wasm32-unknown-unknown/release/link3.wasm --initFunction new --initArgs '{"title": "My first Link3", "description": "Wow such description much detail", "image_uri": "https://cryptomonday.de/uploads/2021/10/7a97kbmm-300x185.jpg" }' --initDeposit 1

````

### Export contract account id to a variable (near-cli)
```
export C=dev-1641953051802-27745738862904

// Then uses with
near call $A method_name
```

## Use WalletConnect to bridge all of these

**Project id:**
```
57baeb311fe2753a3d9b8fe3b91d5e53
```

### Useful
https://github.com/near-apps/linkdrop-proxy

## TODO
Validate wallets by using other chain contracts etc.
