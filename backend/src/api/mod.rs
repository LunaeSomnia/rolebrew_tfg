use crate::{DatabaseCollection, models::summary::Summary, storeable::Storeable};
use actix_web::web::Data;
use tokio::sync::RwLock;

pub mod user;
// pub use user::*;

pub mod auth;
pub use auth::*;

pub mod action_api;
pub use action_api::*;

pub mod feat_api;
pub use feat_api::*;

pub mod ancestry_api;
pub use ancestry_api::*;

type Collection<'a, T> = DatabaseCollection<T>;
type CollectionData<'a, T> = Data<RwLock<Collection<'a, T>>>;

pub async fn generic_get_summaries<T>(db: CollectionData<'_, T>) -> Vec<Summary>
where
    T: Storeable + Into<Summary>,
{
    let db = db.read().await;
    let data: Vec<T> = db.get_all().await.unwrap();

    data.into_iter().map(|v| v.into()).collect()
}

pub async fn generic_get_single<T>(db: CollectionData<'_, T>, slug: String) -> Option<T>
where
    T: Storeable + Into<Summary>,
{
    let db = db.read().await;
    let found_data = db.get_secondary(&slug, "slug").await;
    if found_data.is_err() {
        return None;
    }

    let found_data = found_data.unwrap(); // Safe unwrap
    if found_data.is_none() {
        return None;
    }

    found_data
}
