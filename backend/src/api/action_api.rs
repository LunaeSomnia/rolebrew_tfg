use crate::{
    DatabaseCollection, generic_get_single, generic_get_summaries,
    models::{Action, LinkPreview},
};
use actix_web::{
    Responder, get,
    web::{Data, Path},
};
use tokio::sync::RwLock;

type Collection<'a> = DatabaseCollection<Action>;
type CollectionData<'a> = Data<RwLock<Collection<'a>>>;

#[get("/api/action/summary")]
pub async fn get_action_summaries(db: CollectionData<'_>) -> impl Responder {
    let summaries = generic_get_summaries(db).await;
    actix_web::HttpResponse::Ok().json(summaries)
}

#[get("/api/action/{slug}")]
pub async fn get_action(db: CollectionData<'_>, slug: Path<String>) -> impl Responder {
    match generic_get_single(db, slug.to_string()).await {
        Some(data) => actix_web::HttpResponse::Ok().json(data),
        None => actix_web::HttpResponse::NotFound().finish(),
    }
}

#[get("/api/action/{slug}/preview")]
pub async fn get_action_preview(db: CollectionData<'_>, slug: Path<String>) -> impl Responder {
    match generic_get_single(db, slug.to_string()).await {
        Some(data) => {
            let preview: LinkPreview = data.into();
            actix_web::HttpResponse::Ok().json(preview)
        }
        None => actix_web::HttpResponse::NotFound().finish(),
    }
}
