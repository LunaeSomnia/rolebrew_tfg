use crate::{
    Character, Choice, DatabaseCollection,
    models::{Attribute, Proficiency, Skill},
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

type Collection<'a> = DatabaseCollection<User>;
type CollectionData<'a> = Data<RwLock<Collection<'a>>>;

#[get("/api/user/{user_id}/character")]
pub async fn get_characters(db: CollectionData<'_>, user_id: Path<String>) -> impl Responder {
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

// export class CharacterState {
//     name: string = $state("")
//     level: number = $state(0);
//     attributeScores: Record<Attribute, number> = $state({
//         ..
//     });
//     ancestry: string = $state("");
//     ancestryDecisions: Record<string, Choice[]> = $state({});
//     heritageDecisions: Choice[] = $state([]);
//     ancestryBoosts: Attribute[] = $state([])
//     background: string = $state("");
//     backgroundDecisions: Record<string, Choice[]> = $state({});
//     backgroundBoosts: Attribute[] = $state([])
//     class: string = $state("");
//     classDecisions: Record<string, Record<string, Choice[]>> = $state({});
//     skills: Record<Skill, Proficiency> = $state({
//         ...
//     })
//     additionalSkills: Record<string, [Attribute, Proficiency]> = $state({})
// }

#[derive(Serialize, Deserialize, Type, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct NewCharacterForm {
    pub(crate) name: String,
    pub(crate) level: u8,
    pub(crate) attribute_scores: BTreeMap<Attribute, u8>,
    pub(crate) ancestry: String,
    pub(crate) ancestry_decisions: BTreeMap<String, Vec<Choice>>,
    pub(crate) heritage_decisions: Vec<Choice>,
    pub(crate) ancestry_boosts: Vec<Attribute>,
    pub(crate) background: String,
    pub(crate) background_decisions: BTreeMap<String, Vec<Choice>>,
    pub(crate) background_boosts: Vec<Attribute>,
    pub(crate) class: String,
    pub(crate) class_decisions: BTreeMap<String, BTreeMap<String, Vec<Choice>>>,
    pub(crate) skills: BTreeMap<Skill, Proficiency>,
    pub(crate) additional_skills: BTreeMap<String, (Attribute, Proficiency)>,
}

#[post("/api/user/{user_id}/new_character")]
pub async fn create_new_character(
    db: CollectionData<'_>,
    user_id: Path<String>,
    form: actix_web::web::Json<NewCharacterForm>,
) -> impl Responder {
    println!("{:?} {:?}", user_id, form);
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
            let character: Character = form.0.into();
            user.characters.push(character);
            println!("{:?}", user);
            db.replace_user(user).await.unwrap();
            actix_web::HttpResponse::Ok().finish()
        }
        _ => actix_web::HttpResponse::BadRequest().body("Username not found"),
    }
}
