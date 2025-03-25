use crate::helpers::none_single_or_vec;
use crate::{
    DatabaseCollection,
    models::{link_preview::LinkPreview, primary::feat::Feat, summary::Summary},
};
use actix_web::{
    Responder, get,
    web::{Data, Path, Query},
};
use serde::{Deserialize, Serialize};
use specta::Type;
use tokio::sync::RwLock;

type Collection<'a> = DatabaseCollection<Feat>;
type CollectionData<'a> = Data<RwLock<Collection<'a>>>;

#[derive(Serialize, Deserialize, Type)]
pub struct GetFeatsFilterForm {
    #[serde(default, deserialize_with = "none_single_or_vec")]
    has_traits: Vec<String>,
}

#[get("/api/feat/summary")]
pub async fn get_feat_summaries(
    db: CollectionData<'_>,
    filters: Query<GetFeatsFilterForm>,
) -> impl Responder {
    let db = db.read().await;
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
pub async fn get_feat(db: CollectionData<'_>, slug: Path<String>) -> impl Responder {
    let db = db.read().await;
    let found_result = db.get_secondary(&slug, "slug").await;
    if found_result.is_err() {
        return actix_web::HttpResponse::NotFound().finish();
    }

    let found_feat = found_result.unwrap(); // Safe unwrap
    if found_feat.is_none() {
        return actix_web::HttpResponse::NotFound().finish();
    }

    actix_web::HttpResponse::Ok().json(found_feat)
}

#[get("/api/feat/{slug}/preview")]
pub async fn get_feat_preview(db: CollectionData<'_>, slug: Path<String>) -> impl Responder {
    let db = db.read().await;
    let found_result = db.get_secondary(&slug, "slug").await;
    if found_result.is_err() {
        return actix_web::HttpResponse::NotFound().finish();
    }

    let found_feat = found_result.unwrap(); // Safe unwrap
    if found_feat.is_none() {
        return actix_web::HttpResponse::NotFound().finish();
    }

    let preview: LinkPreview = found_feat.unwrap().into();

    actix_web::HttpResponse::Ok().json(preview)
}
