// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, log, near_bindgen, AccountId, Balance, PanicOnDefault};
use std::collections::HashMap;
use std::str::FromStr;

near_sdk::setup_alloc!();

// Declare
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Item {
  // See more data types at https://doc.rust-lang.org/book/ch03-02-data-types.html
  uri: String,
  title: String,
  description: String,
  image_uri: Option<String>,
  is_public: bool,
  is_premium: bool,
  price: Option<Balance>,
  // counter: Counter,
}

// Default
impl Default for Item {
  fn default() -> Self {
    env::panic(b"The contract should be initialized before usage. Instatiate with ::init instead");
  }
}

// Core Logic
#[near_bindgen]
impl Item {
  fn init(
    uri: String,
    title: String,
    description: String,
    image_uri: Option<String>,
    is_public: bool,
    is_premium: bool,
    price: Option<Balance>,
  ) -> Self {
    assert!(!env::state_exists(), "The contract is already initialized");

    if is_premium {
      assert!(price.is_some(), "Premium items must have a price");
    }

    log!("Creating new item with title {},", &title);
    Item {
      uri: uri,
      title: title,
      description: description,
      image_uri: image_uri,
      is_public: is_public,
      is_premium: is_premium,
      price: price,
      // count: Counter::new(),
    }
  }
}

/*
 * the rest of this file sets up unit tests
 * to run these, the command will be:
 * cargo test --package rust-counter-tutorial -- --nocapture
 * Note: 'rust-counter-tutorial' comes from cargo.toml's 'name' key
 */

// use the attribute below for unit tests
#[cfg(test)]
mod tests {
  use super::*;
  use near_sdk::MockedBlockchain;
  use near_sdk::{testing_env, VMContext};

  // part of writing unit tests is setting up a mock context
  // in this example, this is only needed for env::log in the contract
  // this is also a useful list to peek at when wondering what's available in env::*
  fn get_context(input: Vec<u8>, is_view: bool) -> VMContext {
    VMContext {
      current_account_id: "alice.testnet".to_string(),
      signer_account_id: "robert.testnet".to_string(),
      signer_account_pk: vec![0, 1, 2],
      predecessor_account_id: "jane.testnet".to_string(),
      input,
      block_index: 0,
      block_timestamp: 0,
      account_balance: 0,
      account_locked_balance: 0,
      storage_usage: 0,
      attached_deposit: 0,
      prepaid_gas: 10u64.pow(18),
      random_seed: vec![0, 1, 2],
      is_view,
      output_data_receivers: vec![],
      epoch_height: 19,
    }
  }

  // mark individual unit tests with #[test] for them to be registered and fired
  #[test]
  #[should_panic(
    expected = "The contract should be initialized before usage. Instatiate with ::init instead"
  )]
  fn create_with_default_panics() {
    // Given
    let context = get_context(vec![], false);
    testing_env!(context);
    // When:
    // - Instantiate a contract with default to panic, recommend init instead
    Item::default();
  }

  #[test]
  fn init_creates_with_correct_data() {
    // Given
    let context = get_context(vec![], false);
    testing_env!(context);

    // When
    let contract = Item::init(
      "https://google.com".to_string(),
      "A random title".to_string(),
      "The item description".to_string(),
      Some("https://s3.envato.com/files/244088191/Google%20Logo.1.jpg".to_string()),
      true,
      false,
      None,
    );
    // Then
    assert_eq!("https://google.com".to_string(), contract.uri);
    assert_eq!("A random title".to_string(), contract.title);
    assert_eq!("The item description".to_string(), contract.description);
    assert_eq!(
      Some("https://s3.envato.com/files/244088191/Google%20Logo.1.jpg".to_string()),
      contract.image_uri
    );
    assert_eq!(true, contract.is_public);
    assert_eq!(false, contract.is_premium);
    assert_eq!(None, contract.price);
  }

  #[test]
  #[should_panic]
  fn init_premium_without_price_should_panic() {
    // Given
    let context = get_context(vec![], false);
    testing_env!(context);

    // When:
    // - Instantiate a contract with premium to true and price to None to panic
    Item::init(
      "https://google.com".to_string(),
      "A random title".to_string(),
      "The item description".to_string(),
      Some("https://s3.envato.com/files/244088191/Google%20Logo.1.jpg".to_string()),
      true,
      true,
      None,
    );
  }
}
