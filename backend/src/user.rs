use bson::oid::ObjectId;
use chrono::{Days, Utc};
use serde::{Deserialize, Serialize};
use specta::Type;

use crate::{Character, storeable::Storeable};

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct User {
    #[serde(rename = "_id")]
    pub id: ObjectId,

    pub username: String,
    pub password_hash: String,
    pub email: String,

    pub characters: Vec<Character>,
}

impl User {
    pub fn new(username: String, password_hash: String, email: String) -> Self {
        Self {
            id: ObjectId::new(),
            username,
            password_hash,
            email,
            characters: Vec::new(),
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Type)]
pub struct UserClaims {
    pub sub: String, // username
    pub iat: String, // timestamp of creation
    pub exp: String, // expiration (1day)
}

impl From<&User> for UserClaims {
    fn from(value: &User) -> Self {
        Self {
            sub: value.username.clone(),
            iat: Utc::now().timestamp_millis().to_string(),
            exp: Utc::now()
                .checked_add_days(Days::new(1))
                .expect("couldnt add days to token expiration date")
                .timestamp_millis()
                .to_string(),
        }
    }
}

impl Storeable for User {
    fn table_name() -> &'static str {
        "user"
    }
}
