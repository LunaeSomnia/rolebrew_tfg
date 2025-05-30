use crate::dbref::DbRef;
use crate::generic_get_single;
use crate::helpers::none_single_or_vec;
use crate::models::{link_preview::LinkPreview, primary::feat::Feat, summary::Summary};
use actix_web::post;
use actix_web::{
    Responder, get,
    web::{Data, Path, Query},
};
use bson::Document;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
pub struct GetFeatsFilterForm {
    #[serde(default, deserialize_with = "none_single_or_vec")]
    has_traits: Vec<String>,
}

#[get("/api/feat/summary")]
pub async fn get_feat_summaries(
    db: Data<DbRef>,
    filters: Query<GetFeatsFilterForm>,
) -> impl Responder {
    let coll = db.feat_coll.clone();
    let db = coll.read().await;
    let feats: Vec<Feat> = db.get_all().await.unwrap();
    let feats_iter = feats.into_iter().filter(|v| {
        let mut contains = true;
        for trait_v in filters.has_traits.iter() {
            contains &= v.traits.contains(trait_v)
        }
        contains
    });

    let summaries: Vec<Summary> = feats_iter.map(|v| v.into()).collect();

    actix_web::HttpResponse::Ok().json(summaries)
}

#[get("/api/feat/{slug}")]
pub async fn get_feat(db: Data<DbRef>, slug: Path<String>) -> impl Responder {
    let coll = db.feat_coll.clone();
    let data = generic_get_single(coll, slug.to_string()).await;
    actix_web::HttpResponse::Ok().json(data)
}

#[get("/api/feat/{slug}/preview")]
pub async fn get_feat_preview(db: Data<DbRef>, slug: Path<String>) -> impl Responder {
    let coll = db.feat_coll.clone();
    match generic_get_single(coll, slug.to_string()).await {
        Some(data) => {
            let preview: LinkPreview = data.into();
            actix_web::HttpResponse::Ok().json(preview)
        }
        None => actix_web::HttpResponse::NotFound().finish(),
    }
}

#[post("/api/feat/filtered")]
pub async fn get_feat_filtered(
    db: Data<DbRef>,
    filters: actix_web::web::Json<Document>,
) -> impl Responder {
    let coll = db.feat_coll.clone();
    let db = coll.read().await;
    let data: Vec<Feat> = db.get_all_filtered(filters.0).await.unwrap();

    actix_web::HttpResponse::Ok().json(data)
}
