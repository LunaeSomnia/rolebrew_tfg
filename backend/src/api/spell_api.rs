use crate::dbref::DbRef;
use crate::generic_get_single;
use crate::helpers::none_single_or_vec;
use crate::models::{link_preview::LinkPreview, primary::spell::Spell, summary::Summary};
use actix_web::post;
use actix_web::{
    Responder, get,
    web::{Data, Path, Query},
};
use bson::Document;
use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Type)]
pub struct GetSpellsFilterForm {
    #[serde(default, deserialize_with = "none_single_or_vec")]
    has_traits: Vec<String>,
}

#[get("/api/spell/summary")]
pub async fn get_spell_summaries(
    db: Data<DbRef>,
    filters: Query<GetSpellsFilterForm>,
) -> impl Responder {
    let coll = db.spell_coll.clone();
    let db = coll.read().await;
    let spells: Vec<Spell> = db.get_all().await.unwrap();
    let spells_iter = spells.into_iter().filter(|v| {
        let mut contains = true;
        for trait_v in filters.has_traits.iter() {
            contains &= v.traits.contains(trait_v)
        }
        contains
    });

    let summaries: Vec<Summary> = spells_iter.map(|v| v.into()).collect();

    actix_web::HttpResponse::Ok().json(summaries)
}

#[get("/api/spell/{slug}")]
pub async fn get_spell(db: Data<DbRef>, slug: Path<String>) -> impl Responder {
    let coll = db.spell_coll.clone();
    let data = generic_get_single(coll, slug.to_string()).await;
    actix_web::HttpResponse::Ok().json(data)
}

#[get("/api/spell/{slug}/preview")]
pub async fn get_spell_preview(db: Data<DbRef>, slug: Path<String>) -> impl Responder {
    let coll = db.spell_coll.clone();
    match generic_get_single(coll, slug.to_string()).await {
        Some(data) => {
            let preview: LinkPreview = data.into();
            actix_web::HttpResponse::Ok().json(preview)
        }
        None => actix_web::HttpResponse::NotFound().finish(),
    }
}

#[post("/api/spell/filtered")]
pub async fn get_spell_filtered(
    db: Data<DbRef>,
    filters: actix_web::web::Json<Document>,
) -> impl Responder {
    let coll = db.spell_coll.clone();
    let db = coll.read().await;
    let data: Vec<Spell> = db.get_all_filtered(filters.0).await.unwrap();

    actix_web::HttpResponse::Ok().json(data)
}
