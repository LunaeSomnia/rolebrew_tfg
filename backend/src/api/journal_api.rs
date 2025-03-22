use crate::{DatabaseCollection, models::primary::journal::Journal};
use actix_web::{
    Responder, get,
    web::{Data, Path},
};
use tokio::sync::RwLock;

type Collection<'a> = DatabaseCollection<Journal>;
type CollectionData<'a> = Data<RwLock<Collection<'a>>>;

#[get("/api/journal/{id}")]
pub async fn get_journal(db: CollectionData<'_>, id: Path<String>) -> impl Responder {
    let db = db.read().await;
    let journal = db.get(&id).await.unwrap();

    if let Some(journal) = journal {
        return actix_web::HttpResponse::Ok().json(journal);
    }

    actix_web::HttpResponse::NotFound().finish()
}
