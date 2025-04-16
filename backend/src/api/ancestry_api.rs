use crate::{dbref::DbRef, generic_get_single, generic_get_summaries};
use actix_web::{
    Responder, get,
    web::{Data, Path},
};

#[get("/api/ancestry/summary")]
pub async fn get_ancestry_summaries(db: Data<DbRef>) -> impl Responder {
    let coll = db.ancestry_coll.clone();
    let summaries = generic_get_summaries(coll).await;
    actix_web::HttpResponse::Ok().json(summaries)
}

#[get("/api/ancestry/{slug}")]
pub async fn get_ancestry(db: Data<DbRef>, slug: Path<String>) -> impl Responder {
    let coll = db.ancestry_coll.clone();
    match generic_get_single(coll, slug.to_string()).await {
        Some(data) => actix_web::HttpResponse::Ok().json(data),
        None => actix_web::HttpResponse::NotFound().finish(),
    }
}
