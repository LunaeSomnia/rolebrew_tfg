use crate::{
    DatabaseCollection, generic_get_single, generic_get_summaries, models::primary::Heritage,
};
use actix_web::{
    Responder, get,
    web::{Data, Path},
};
use tokio::sync::RwLock;

type Collection<'a> = DatabaseCollection<Heritage>;
type CollectionData<'a> = Data<RwLock<Collection<'a>>>;

#[get("/api/heritage/summary")]
pub async fn get_heritage_summaries(db: CollectionData<'_>) -> impl Responder {
    let summaries = generic_get_summaries(db).await;
    actix_web::HttpResponse::Ok().json(summaries)
}

#[get("/api/heritage/{slug}")]
pub async fn get_heritage(db: CollectionData<'_>, slug: Path<String>) -> impl Responder {
    match generic_get_single(db, slug.to_string()).await {
        Some(data) => actix_web::HttpResponse::Ok().json(data),
        None => actix_web::HttpResponse::NotFound().finish(),
    }
}
