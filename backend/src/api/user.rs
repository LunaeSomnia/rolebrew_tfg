// use actix_web::{
//     Responder,
//     cookie::Cookie,
//     get, post,
//     web::{Data, Path},
// };
// use bson::oid::ObjectId;
// use chrono::{Days, Duration, Utc};
// use jsonwebtoken::EncodingKey;
// use serde::{Deserialize, Serialize};
// use specta::Type;
// use tokio::sync::RwLock;

// use crate::{
//     DatabaseCollection,
//     hash::{hash_password, verify_hash},
//     user::{User, UserClaims},
//     users_db_impl::UserDBImpl,
// };

// type Collection<'a> = DatabaseCollection<User>;
// type CollectionData<'a> = Data<RwLock<Collection<'a>>>;

// #[derive(Serialize, Deserialize, Type)]
// pub struct CreateUserForm {
//     username: String,
//     password: String,
//     email: String,
// }
