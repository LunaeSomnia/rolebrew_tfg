use bson::{doc, oid::ObjectId};

use crate::{SaveCharacterForm, user::User};

use super::{DATABASE_NAME, DatabaseCollection, storeable::Storeable};

pub trait CharacterDBImpl {
    fn save_character_state(
        &self,
        user_id: &str,
        id: &str,
        state: SaveCharacterForm,
    ) -> impl Future<Output = Result<(), mongodb::error::Error>>;
}

impl CharacterDBImpl for DatabaseCollection<User> {
    async fn save_character_state(
        &self,
        user_id: &str,
        id: &str,
        state: SaveCharacterForm,
    ) -> Result<(), mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection: mongodb::Collection<User> = client
            .database(DATABASE_NAME)
            .collection(User::table_name());
        let state_json = serde_json::to_value(state).unwrap();
        let state_bson = bson::to_document(&state_json).unwrap();
        let result = collection
            .update_one(
                doc! { "username": user_id, "characters._id": ObjectId::parse_str(id).unwrap() },
                doc! { "$set": { "characters.$.state": state_bson }},
            )
            .await;
        println!("{:?}", result);
        Ok(())
    }
}
