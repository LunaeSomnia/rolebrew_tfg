use crate::{
    Character, Choice, DatabaseCollection,
    models::{Ancestry, Attribute, Background, Class, Proficiency, Skill},
    user::User,
    users_db_impl::UserDBImpl,
};
use actix_web::{
    Responder, get, post,
    web::{Data, Path},
};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::BTreeMap;
use tokio::sync::RwLock;

type CollectionData<'a, T> = Data<RwLock<DatabaseCollection<T>>>;

#[get("/api/user/{user_id}/character")]
pub async fn get_characters(db: CollectionData<'_, User>, user_id: Path<String>) -> impl Responder {
    let db = db.read().await;
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
    db: CollectionData<'_, User>,
    query_parameters: Path<(String, String)>,
) -> impl Responder {
    let (user_id, character_id) = query_parameters.into_inner();
    let db = db.read().await;
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
    db: CollectionData<'_, User>,
    ancestry_col: CollectionData<'_, Ancestry>,
    background_col: CollectionData<'_, Background>,
    class_col: CollectionData<'_, Class>,
    form: actix_web::web::Json<NewCharacterForm>,
    user_id: Path<String>,
) -> impl Responder {
    println!("{:?}", serde_json::to_string(&form.clone()));
    let db = db.read().await;
    match db.get_from_username(user_id.as_str()).await {
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
            let character =
                Character::construct(form.into_inner(), ancestry_col, background_col, class_col)
                    .await;
            user.characters.push(character);
            db.replace_user(user).await.unwrap();
            actix_web::HttpResponse::Ok().finish()
        }
        _ => actix_web::HttpResponse::BadRequest().body("Username not found"),
    }
}
