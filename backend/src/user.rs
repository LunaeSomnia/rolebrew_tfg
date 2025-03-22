use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

use crate::storeable::Storeable;

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: ObjectId,

    pub username: String,
    pub password_hash: String,
    pub email: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct UserClaims {
    pub sub: String, // username
    pub iat: usize,  // timestamp of creation
    pub exp: usize,  // expiration (1day)
}

impl Storeable for User {
    fn table_name() -> &'static str {
        "user"
    }
}
