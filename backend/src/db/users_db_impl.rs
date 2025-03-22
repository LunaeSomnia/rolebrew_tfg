use bson::doc;

use crate::user::User;

use super::{DATABASE_NAME, DatabaseCollection, storeable::Storeable};

pub trait UserDBImpl {
    fn get_from_username(
        &self,
        id: &str,
    ) -> impl Future<Output = Result<Option<User>, mongodb::error::Error>>;
}

impl UserDBImpl for DatabaseCollection<User> {
    async fn get_from_username(
        &self,
        username: &str,
    ) -> Result<Option<User>, mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection: mongodb::Collection<User> = client
            .database(DATABASE_NAME)
            .collection(User::table_name());
        let result: Option<User> = match collection.find_one(doc! { "username": username }).await {
            Ok(Some(v)) => Some(v),
            Ok(None) => None,
            Err(err) => return Err(err),
        };
        Ok(result)
    }
}
