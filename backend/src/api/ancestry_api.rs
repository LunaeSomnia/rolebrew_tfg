use crate::{
    DatabaseCollection,
    models::{primary::ancestry::Ancestry, summary::Summary},
};
use actix_web::{
    Responder, get,
    web::{Data, Path},
};
use tokio::sync::RwLock;

type Collection<'a> = DatabaseCollection<Ancestry>;
type CollectionData<'a> = Data<RwLock<Collection<'a>>>;

#[get("/api/ancestry/summary")]
pub async fn get_ancestry_summaries(db: CollectionData<'_>) -> impl Responder {
    let db = db.read().await;
    let ancestries: Vec<Ancestry> = db.get_all().await.unwrap();

    let summaries: Vec<Summary> = ancestries.into_iter().map(|v| v.into()).collect();

    actix_web::HttpResponse::Ok().json(summaries)
}

#[get("/api/ancestry/{slug}")]
pub async fn get_ancestry(db: CollectionData<'_>, slug: Path<String>) -> impl Responder {
    let db = db.read().await;
    let found_result = db.get_secondary(&slug, "slug").await;
    if found_result.is_err() {
        return actix_web::HttpResponse::NotFound().finish();
    }

    let found_ancestry = found_result.unwrap(); // Safe unwrap
    if found_ancestry.is_none() {
        return actix_web::HttpResponse::NotFound().finish();
    }

    actix_web::HttpResponse::Ok().json(found_ancestry)
}
