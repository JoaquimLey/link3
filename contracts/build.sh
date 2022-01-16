#!/bin/bash
set -e

RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
mkdir -p ./out
cp target/wasm32-unknown-unknown/release/*.wasm ./out/main.wasm

while :; do
  case "$1" in -deploy-\?|-d)
      echo "Deploying contract..."
      near dev-deploy --wasmFile ./out/main.wasm
      source ./neardev/dev-account.env
      echo "Contract deployed!" 
      exit 
  esac

  shift
done
