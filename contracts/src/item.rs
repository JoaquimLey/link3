// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
//use near_sdk::collections::LookupMap;
use near_sdk::{env, log, near_bindgen, AccountId, Balance, PanicOnDefault};
use serde::Serialize;

// #[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault, Serialize)]
pub struct Item {
    // See more data types at https://doc.rust-lang.org/book/ch03-02-data-types.html
    uri: String,
    title: String,
    description: String,
    image_uri: Option<String>,
    is_public: bool,
    is_premium: bool,
    price: Option<Balance>,
    image_preview_uri: Option<String>,
    account_access: Vec<AccountId>,
}

// Core Logic/Implementation
// #[near_bindgen]
impl Item {
    // Instantiate a new Item
    pub fn new(
        uri: String,
        title: String,
        description: String,
        image_uri: Option<String>,
        is_public: bool,
        is_premium: bool,
        price: Option<Balance>,
        image_preview_uri: Option<String>,
    ) -> Self {
        if is_premium {
            price.unwrap_or_else(|| env::panic(b"Premium items must have a price"));
        }

        log!("Creating new item with title {},", &title);

        Item {
            uri,
            title,
            description,
            image_uri,
            is_public,
            is_premium,
            price,
            // account_access: LookupMap::new(b"b".to_vec()),
            account_access: if is_premium {
                vec![env::predecessor_account_id()]
            } else {
                vec![]
            },
            image_preview_uri,
        }
    }

    /****************
     * CALL METHODS *
     ****************/
    //#[payable]
    pub fn buy(&mut self) {
        // Assert
        if !self.is_premium {
            env::panic(b"Can't buy a free/non-premium item.");
        }

        if env::predecessor_account_id() == env::current_account_id() {
            env::panic(b"Owner can't buy their own item.");
        }

        if self
            .account_access
            .iter()
            .find(|account_id| account_id == &&env::predecessor_account_id())
            // .get(&env::current_account_id())
            .is_some()
        {
            env::panic(b"Contract already owns this item");
        }

        if env::attached_deposit() < self.price.unwrap() {
            env::panic(b"Unsuficient funds to buy item.");
        }

        // Mutate (spend gas) - Add account to access list
        self.account_access.push(env::predecessor_account_id());

        // Done, print out confirmation message.
        let log_account = format!(
            "Item bought by Account ID {} successfully!",
            env::predecessor_account_id()
        );
        env::log(log_account.as_bytes());
    }

    pub fn set_public(&mut self, is_public: bool) {
        if env::current_account_id() != env::predecessor_account_id() {
            env::panic(b"Only the owner can change the is_public state");
        }

        self.is_public = is_public;
    }

    /****************
     * READ METHODS *
     ****************/
    pub fn is_public(&self) -> bool {
        self.is_public
    }

    pub fn is_premium(&self) -> bool {
        self.is_premium
    }

    pub fn has_access(&self) -> bool {
        if !self.is_public {
            // If it is not public, it can't be accessed by anyone
            return false;
        }

        // If it is public, and not premium it can be accessed by anyone
        if !self.is_premium {
            return true;
        }

        // Otherwise check account access from list
        self.account_access
            .iter()
            .find(|account_id| account_id == &&env::signer_account_id())
            .is_some()
    }

    pub fn read(&self) -> (String, String, String) {
        if !self.is_public {
            env::panic(b"Can't read an item that is not public.");
        }

        if !self.is_premium || Item::has_access(self) {
            // Is not premium or user has bought the item, return uri info
            (
                self.uri.clone(),
                self.title.clone(),
                self.image_uri.clone().unwrap_or_default(),
            )
        } else {
            // Only show public information (no uri)
            (
                "".to_string(),
                self.title.clone(),
                self.image_preview_uri.clone().unwrap_or_default(),
            )
        }
    }

    /********************
     * INTERNAL METHODS *
     ********************/
}

/*********
 * TESTS *
 *********/
/*
 * To run these, the command will be:
 * cargo test
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

    fn get_context_alternative(input: Vec<u8>, is_view: bool) -> VMContext {
        VMContext {
            current_account_id: "alternative.testnet".to_string(),
            signer_account_id: "ronaldo.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "ronaldo.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: 5,
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    fn generate_item(is_public: bool, is_premium: bool, price: Option<Balance>) -> Item {
        Item::new(
            "https://google.com".to_string(),
            "A random title".to_string(),
            "The item description".to_string(),
            Some("https://s3.envato.com/files/244088191/Google%20Logo.1.jpg".to_string()),
            is_public,
            is_premium,
            price,
            None,
        )
    }

    // mark individual unit tests with #[test] for them to be registered and fired
    #[test]
    #[should_panic]
    fn create_with_default_panics() {
        // Given
        let context = get_context(vec![], false);
        testing_env!(context);
        // When:
        // - Instantiate the contract with default to panic, recommend new instead
        Item::default();
    }

    #[test]
    fn init_creates_with_correct_state() {
        // Given
        let context = get_context(vec![], false);
        testing_env!(context);
        // When
        // - Instantiate the contract with init
        let contract = Item::new(
            "https://google.com".to_string(),
            "A random title".to_string(),
            "The item description".to_string(),
            Some("https://s3.envato.com/files/244088191/Google%20Logo.1.jpg".to_string()),
            true,
            false,
            None,
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
        assert_eq!(contract.account_access.len(), 0);
    }

    #[test]
    fn init_creates_with_premium_adds_owner_access() {
        // Given
        let context = get_context(vec![], false);
        testing_env!(context);
        // When
        // - Instantiate the contract with init
        let contract = Item::new(
            "https://google.com".to_string(),
            "A random title".to_string(),
            "The item description".to_string(),
            Some("https://s3.envato.com/files/244088191/Google%20Logo.1.jpg".to_string()),
            true,
            true,
            Some(1),
            None,
        );
        // Then
        assert_eq!(contract.account_access.len(), 1);
        assert_eq!(
            contract.account_access[contract.account_access.len() - 1],
            "jane.testnet".to_string()
        );
    }

    #[test]
    #[should_panic]
    fn init_premium_without_price_should_panic() {
        // Given
        let context = get_context(vec![], false);
        testing_env!(context);
        // When:
        // - Instantiate a contract with premium set to true and price to None should panic
        Item::new(
            "https://google.com".to_string(),
            "A random title".to_string(),
            "The item description".to_string(),
            Some("https://s3.envato.com/files/244088191/Google%20Logo.1.jpg".to_string()),
            true,
            true,
            None,
            None,
        );
    }

    #[test]
    fn is_public_returns_correct_state() {
        // Given
        let context = get_context(vec![], false);
        testing_env!(context);
        let item = generate_item(true, false, None);
        // When
        let result = item.is_public();
        // Then
        assert_eq!(result, true);
    }

    #[test]
    fn buy_adds_account_access() {
        // Given
        let context = get_context(vec![], false);
        testing_env!(context);
        let mut item = generate_item(true, true, Some(1));
        // When
        let context_buyer = get_context_alternative(vec![], false);
        testing_env!(context_buyer);
        item.buy();

        // Then
        assert_eq!(
            item.account_access[item.account_access.len() - 1],
            "ronaldo.testnet".to_string()
        );
    }
}
