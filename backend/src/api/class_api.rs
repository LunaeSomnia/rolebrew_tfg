use crate::{dbref::DbRef, generic_get_single, generic_get_summaries, models::LinkPreview};
use actix_web::{
    Responder, get,
    web::{Data, Path},
};

#[get("/api/class/summary")]
pub async fn get_class_summaries(db: Data<DbRef>) -> impl Responder {
    let coll = db.class_coll.clone();
    let summaries = generic_get_summaries(coll).await;
    actix_web::HttpResponse::Ok().json(summaries)
}

#[get("/api/class/{slug}")]
pub async fn get_class(db: Data<DbRef>, slug: Path<String>) -> impl Responder {
    let coll = db.class_coll.clone();
    match generic_get_single(coll, slug.to_string()).await {
        Some(data) => actix_web::HttpResponse::Ok().json(data),
        None => actix_web::HttpResponse::NotFound().finish(),
    }
}

#[get("/api/class/{slug}/preview")]
pub async fn get_class_preview(db: Data<DbRef>, slug: Path<String>) -> impl Responder {
    let coll = db.class_coll.clone();
    match generic_get_single(coll, slug.to_string()).await {
        Some(data) => {
            let preview: LinkPreview = data.into();
            actix_web::HttpResponse::Ok().json(preview)
        }
        None => actix_web::HttpResponse::NotFound().finish(),
    }
}
