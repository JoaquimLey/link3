use std::vec;

// To conserve gas, efficient serialization is achieved through Borsh (http://borsh.io/)
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, log, near_bindgen, AccountId, Balance, PanicOnDefault};
// Crates
use crate::item::Item;
mod item;

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Link3 {
    title: String,
    description: String,
    image_uri: Option<String>,
    owner_account_id: AccountId,
    links: Vec<Item>,
    is_public: bool,
}

// Core Logic/Implementation
#[near_bindgen]
impl Link3 {
    // Instantiate a new Item
    #[init]
    #[payable]
    pub fn new(
        title: String,
        description: String,
        image_uri: Option<String>,
        is_public: Option<bool>,
    ) -> Self {
        if env::state_exists() {
            env::panic(b"The contract is already initialized");
        }

        log!(
            "Creating new Link3 contract with account id: {} and deposite of: {}",
            env::current_account_id(),
            env::attached_deposit()
        );

        // Todo -> Make external/cross-contract call for the token cost of deploying a link3 contract
        let token_cost: Balance = 1;
        if env::attached_deposit() < token_cost {
            env::panic(b"A deposit of at least 1 token is required to create a Link3 contract");
        }

        Link3 {
            title,
            description,
            image_uri,
            owner_account_id: env::current_account_id(),
            links: vec![],
            is_public: is_public.unwrap_or(true),
        }
        // TODO: register this item into the link3 "main marketplace"
        // with cross-contract calls: https://www.youtube.com/watch?v=971dTz6nM2g
    }

    /****************
     * READ METHODS *
     ****************/
    pub fn get_info(&self) -> (String, String, Option<String>) {
        if !self.is_public {
            env::panic(b"This contract is not public");
        }

        (
            self.title.clone(),
            self.description.clone(),
            self.image_uri.clone(),
        )
    }

    pub fn list(&self) -> Vec<&Item> {
        if !self.is_public {
            env::panic(b"This contract is not public");
        }

        let links_ref = &self.links;
        if env::current_account_id() == self.owner_account_id {
            return links_ref.iter().collect();
        } else {
            return links_ref.iter().filter(|link| link.has_access()).collect();
        }
    }

    pub fn list_public(&self) -> Vec<&Item> {
        if !self.is_public {
            env::panic(b"This contract is not public");
        }

        let links_ref = &self.links;
        return links_ref.iter().filter(|link| link.is_public()).collect();
    }

    /****************
     * CALL METHODS *
     ****************/
    pub fn update_public_status(&mut self, is_public: bool) {
        if env::signer_account_id() != self.owner_account_id {
            env::panic(b"Only the owner can change public state");
        }

        if self.is_public != is_public {
            self.is_public = is_public;
        }
    }

    pub fn create_link(
        &mut self,
        uri: String,
        title: String,
        description: String,
        image_uri: Option<String>,
        is_public: bool,
        is_premium: bool,
        price: Option<Balance>,
        image_preview_uri: Option<String>,
    ) -> &Item {
        if env::signer_account_id() != self.owner_account_id {
            env::panic(b"Only the owner can create a link");
        }

        let item = Item::new(
            uri,
            title,
            description,
            image_uri,
            is_public,
            is_premium,
            price,
            image_preview_uri,
        );

        self.links.push(item);
        // Return created item
        &self.links[self.links.len() - 1]
    }

    pub fn buy_link() {

    }
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
    fn get_context(input: Vec<u8>, is_view: bool, deposit: Option<Balance>) -> VMContext {
        VMContext {
            current_account_id: "alice.testnet".to_string(),
            signer_account_id: "alice.testnet".to_string(),
            signer_account_pk: vec![0, 1, 2],
            predecessor_account_id: "jane.testnet".to_string(),
            input,
            block_index: 0,
            block_timestamp: 0,
            account_balance: 0,
            account_locked_balance: 0,
            storage_usage: 0,
            attached_deposit: deposit.unwrap_or(0),
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    fn get_alternative_context(
        input: Vec<u8>,
        is_view: bool,
        deposit: Option<Balance>,
    ) -> VMContext {
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
            attached_deposit: deposit.unwrap_or(0),
            prepaid_gas: 10u64.pow(18),
            random_seed: vec![0, 1, 2],
            is_view,
            output_data_receivers: vec![],
            epoch_height: 19,
        }
    }

    fn generate_contract(is_public: Option<bool>) -> Link3 {
        Link3::new(
            "This is an awesome title".to_string(),
            "This is the perfect description".to_string(),
            Some("image_uri".to_string()),
            is_public,
        )
    }

    // mark individual unit tests with #[test] for them to be registered and fired
    #[test]
    #[should_panic]
    fn create_with_default_panics() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        // When
        Link3::default();
        // Then
        // - Panics
    }

    #[test]
    #[should_panic(
        expected = "A deposit of at least 1 token is required to create a Link3 contract"
    )]
    fn init_without_deposit_panics() {
        // Given
        let context = get_context(vec![], false, None);
        testing_env!(context);
        // When
        Link3::new(
            "This is an awesome title".to_string(),
            "This is the perfect description".to_string(),
            Some("image_uri".to_string()),
            None,
        );
        // Then
        // - Should panic
    }

    #[test]
    fn init_creates_with_correct_state() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        // When
        let contract = generate_contract(None);
        // Then
        assert_eq!(contract.title, "This is an awesome title".to_string());
        assert_eq!(
            contract.description,
            "This is the perfect description".to_string()
        );
        assert_eq!(contract.image_uri, Some("image_uri".to_string()));
        assert_eq!(contract.is_public, true);
    }

    #[test]
    fn init_with_public_false_is_not_public() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        // When
        let contract = generate_contract(Some(false));
        // Then
        assert_eq!(contract.is_public, false);
    }

    #[test]
    #[should_panic(expected = "This contract is not public")]
    fn get_info_panics_if_contract_is_not_public() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        // Create contract that is not public
        let contract = generate_contract(Some(false));
        // When
        contract.get_info();
        // Then
        // - Should panic
    }

    #[test]
    fn get_info_returns_correct_state() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        let contract = generate_contract(None);
        // When
        let info = contract.get_info();
        // Then
        assert_eq!(info.0, contract.title);
        assert_eq!(info.1, contract.description);
        assert_eq!(info.2, contract.image_uri);
    }

    #[test]
    #[should_panic(expected = "Only the owner can change public state")]
    fn update_public_state_wrong_owner_panics() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);

        let initial_is_public_value = false;
        let mut contract = generate_contract(Some(initial_is_public_value));

        // When
        let alterinative_context = get_alternative_context(vec![], false, None);
        testing_env!(alterinative_context);

        contract.update_public_status(!initial_is_public_value);

        // Then
        assert_eq!(contract.is_public, !initial_is_public_value);
    }

    #[test]
    fn update_public_status_updates_state() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        let initial_is_public_value = false;
        let mut contract = generate_contract(Some(initial_is_public_value));

        // When
        contract.update_public_status(!initial_is_public_value);

        // Then
        // - Should panic
    }

    #[test]
    #[should_panic(expected = "Only the owner can create a link")]
    fn create_link_with_wrong_owner_panics() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        let mut contract = generate_contract(Some(true));
        // When
        let alterinative_context = get_alternative_context(vec![], false, None);
        testing_env!(alterinative_context);
        contract.create_link(
            "some_uri".to_string(),
            "some_title".to_string(),
            "some_description".to_string(),
            Some("image".to_string()),
            true,
            false,
            None,
            None,
        );
        // Then
        // - Should panic
    }

    #[test]
    fn create_link_adds_link() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        let mut contract = generate_contract(Some(true));

        // When
        contract.create_link(
            "some_uri".to_string(),
            "some_title".to_string(),
            "some_description".to_string(),
            Some("image".to_string()),
            true,
            false,
            None,
            None,
        );

        // Then
        assert!(
            contract.list_public().len() > 0,
            "Should have at least one item"
        );
    }

    #[test]
    #[should_panic(expected = "This contract is not public")]
    fn list_public_panics_if_link3_is_not_public() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        let contract = generate_contract(Some(false));
        // When
        contract.list_public();
        // Then
        // - Should panic
    }

    #[test]
    fn list_public_only_returns_public() {
        // Given
        let context = get_context(vec![], false, Some(1));
        testing_env!(context);
        let mut contract = generate_contract(Some(true));
        contract.create_link(
            "some_uri".to_string(),
            "some_title".to_string(),
            "some_description".to_string(),
            Some("image".to_string()),
            true,
            false,
            None,
            None,
        );
        // Create a link that is not public
        contract.create_link(
            "some_uri".to_string(),
            "some_title".to_string(),
            "some_description".to_string(),
            Some("image".to_string()),
            false,
            false,
            None,
            None,
        );
        // When
        let result = contract.list_public();
        // Then
        assert_eq!(result.len(), 1, "Should've only return the public item")
    }
}
