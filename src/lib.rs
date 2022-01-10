// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, log, near_bindgen, AccountId, Balance, PanicOnDefault};
use std::collections::HashMap;
use std::str::FromStr;

near_sdk::setup_alloc!();

mod counter;
mod item;

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Link3 {
  pairs: UnorderedMap<String, String>, // pairs: UnorderedMap<AccountID, Item>
}

impl Default for Link3 {
  fn default() -> Self {
    Self {
      pairs: UnorderedMap::new(b"r".to_vec()),
    }
  }
}
