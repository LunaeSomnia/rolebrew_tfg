use crate::{
    Character, Choice,
    characters_db_impl::CharacterDBImpl,
    dbref::DbRef,
    models::{Attribute, Proficiency, Skill},
    users_db_impl::UserDBImpl,
};
use actix_web::{
    Responder, get, post,
    web::{Data, Path},
};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::BTreeMap;

#[get("/api/user/{user_id}/character")]
pub async fn get_characters(db: Data<DbRef>, user_id: Path<String>) -> impl Responder {
    let coll = db.user_coll.clone();
    let db = coll.read().await;
    match db.get_from_username(user_id.as_str()).await {
        Ok(Some(user)) => actix_web::HttpResponse::Ok().json(user.characters),
        Ok(None) => actix_web::HttpResponse::BadRequest().body("Username not found"),
        Err(e) => {
            eprintln!("{}", e);
            actix_web::HttpResponse::InternalServerError()
                .body("Error while searching for the characters")
        }
    }
}

#[get("/api/user/{user_id}/character/{character_id}")]
pub async fn get_character(
    db: Data<DbRef>,
    query_parameters: Path<(String, String)>,
) -> impl Responder {
    let (user_id, character_id) = query_parameters.into_inner();
    let coll = db.user_coll.clone();
    let db = coll.read().await;
    let user_result = db.get_from_username(user_id.as_str()).await;
    if let Err(e) = user_result {
        eprintln!("{}", e);
        return actix_web::HttpResponse::InternalServerError()
            .body("Error while searching for the characters");
    }

    let user_option = user_result.unwrap();
    if user_option.is_none() {
        return actix_web::HttpResponse::BadRequest().body("Username not found");
    }

    let user = user_option.unwrap();
    let character_option = user
        .characters
        .iter()
        .find(|v| v.id.to_string() == *character_id);
    if character_option.is_none() {
        return actix_web::HttpResponse::BadRequest().body("Character not found");
    }

    actix_web::HttpResponse::Ok().json(character_option.unwrap())
}

#[derive(Serialize, Deserialize, Type, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct SaveCharacterForm {
    pub(crate) hp: Option<serde_json::Value>,
    pub(crate) temp_hp: Option<serde_json::Value>,
    pub(crate) hero_points: Option<serde_json::Value>,
    pub(crate) current_armor: Option<serde_json::Value>,
    pub(crate) current_shield: Option<serde_json::Value>,
    pub(crate) initiative: Option<serde_json::Value>,
    pub(crate) chat: Option<serde_json::Value>,
    pub(crate) money: Option<serde_json::Value>,
    pub(crate) equipment: Option<serde_json::Value>,
    pub(crate) conditions: Option<serde_json::Value>,
    pub(crate) info: Option<serde_json::Value>,
}

#[post("/api/user/{user_id}/character/{character_id}")]
pub async fn save_character_state(
    db: Data<DbRef>,
    query_parameters: Path<(String, String)>,
    form: actix_web::web::Json<SaveCharacterForm>,
) -> impl Responder {
    let (user_id, character_id) = query_parameters.into_inner();
    let coll = db.user_coll.clone();
    let db = coll.read().await;
    let result = db
        .save_character_state(&user_id, &character_id, form.into_inner())
        .await;
    if result.is_err() {
        return actix_web::HttpResponse::BadRequest().body("State not updated correctly");
    }

    actix_web::HttpResponse::Ok().finish()
}

#[derive(Serialize, Deserialize, Type, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NewCharacterForm {
    pub(crate) name: String,
    pub(crate) level: u8,
    pub(crate) attribute_modifiers: BTreeMap<Attribute, i8>,
    pub(crate) key_ability: Attribute,

    pub(crate) ancestry: String,
    pub(crate) ancestry_decisions: BTreeMap<String, Vec<Choice>>,
    pub(crate) heritage_decisions: Vec<Choice>,
    pub(crate) background: String,
    pub(crate) background_decisions: BTreeMap<String, Vec<Choice>>,
    pub(crate) class: String,
    pub(crate) class_decisions: BTreeMap<String, BTreeMap<String, Vec<Choice>>>,
    pub(crate) skills: BTreeMap<Skill, Proficiency>,
    pub(crate) additional_skills: BTreeMap<String, (Attribute, Proficiency)>,
}

#[post("/api/user/{user_id}/new_character")]
pub async fn create_new_character(
    db: Data<DbRef>,
    form: actix_web::web::Json<NewCharacterForm>,
    user_id: Path<String>,
) -> impl Responder {
    let coll = db.user_coll.clone();
    let user_coll = coll.read().await;
    match user_coll.get_from_username(user_id.as_str()).await {
        Ok(Some(mut user)) => {
            if user
                .characters
                .iter()
                .find(|v| v.name == form.name)
                .is_some()
            {
                return actix_web::HttpResponse::BadRequest()
                    .body("User already has character with said name");
            }
            let character = Character::construct(form.into_inner(), db.into_inner().clone()).await;
            user.characters.push(character);
            user_coll.replace_user(user).await.unwrap();
            actix_web::HttpResponse::Ok().finish()
        }
        _ => actix_web::HttpResponse::BadRequest().body("Username not found"),
    }
}
