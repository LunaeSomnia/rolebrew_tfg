use actix_cors::Cors;
use actix_web::{App, HttpServer, http::header, middleware::Logger, web::Data};
use db::dbref::DbRef;
use dotenv::dotenv;

pub mod api;
pub use api::*;

pub mod helpers;

pub mod db;
pub use db::*;

pub mod models;

pub mod auth;
pub mod hash;
pub mod user;

pub mod character_creator;
pub use character_creator::*;

pub mod character;
pub use character::*;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    unsafe {
        std::env::set_var("RUST_LOG", "debug");
    }
    env_logger::init();

    let db = Database::connect()
        .await
        .expect("error while creating mongodb connection");
    let db_ref = Data::new(DbRef::new(db));

    println!("Running rolebrew backend...");

    HttpServer::new(move || {
        App::new()
            .app_data(db_ref.clone())
            // auth
            .service(login)
            .service(hash)
            // characters
            .service(get_character)
            .service(get_characters)
            .service(save_character_state)
            .service(create_new_character)
            // users
            .service(create_user)
            // condition
            .service(get_condition_summaries)
            .service(get_condition_preview)
            .service(get_conditions)
            .service(get_condition)
            // equipment
            .service(get_equipment_summaries)
            .service(get_equipment_preview)
            .service(get_equipment)
            // action
            .service(get_action_summaries)
            .service(get_action_preview)
            .service(get_actions)
            .service(get_action)
            // class
            .service(get_class_summaries)
            .service(get_class_preview)
            .service(get_class)
            // background
            .service(get_background_summaries)
            .service(get_background_preview)
            .service(get_background)
            // feat
            .service(get_feat_summaries)
            .service(get_feat_preview)
            .service(get_feat)
            .service(get_feat_filtered)
            // ancestries
            .service(get_ancestry_summaries)
            .service(get_ancestry)
            // heritages
            .service(get_heritage_summaries)
            .service(get_heritage)
            //
            .wrap(actix_web::middleware::DefaultHeaders::new())
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:5173")
                    .allowed_origin("http://localhost:4173")
                    .allowed_origin("http://localhost:3000")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
                    .allowed_header(header::CONTENT_TYPE)
                    .supports_credentials()
                    .max_age(3600),
            )
            .wrap(Logger::default())
    })
    .bind(("0.0.0.0", 8080))?
    .workers(1)
    .run()
    .await
}

#[tokio::test]
async fn test_database_data() {
    use models::{Action, Ancestry, Background, Class, Condition, Equipment, Feat, Heritage};
    use std::sync::Arc;

    dotenv().ok();
    unsafe {
        std::env::set_var("RUST_LOG", "debug");
    }
    env_logger::init();

    let db = Database::connect()
        .await
        .expect("error while creating mongodb connection");
    let db_ref = Arc::new(db);

    let feat_collection = DatabaseCollection::<Feat>::new(db_ref.clone());
    let heritage_collection = DatabaseCollection::<Heritage>::new(db_ref.clone());
    let ancestry_collection = DatabaseCollection::<Ancestry>::new(db_ref.clone());
    let action_collection = DatabaseCollection::<Action>::new(db_ref.clone());
    let class_collection = DatabaseCollection::<Class>::new(db_ref.clone());
    let background_collection = DatabaseCollection::<Background>::new(db_ref.clone());
    let equipment_collection = DatabaseCollection::<Equipment>::new(db_ref.clone());
    let condition_collection = DatabaseCollection::<Condition>::new(db_ref.clone());

    let _feats: Vec<Feat> = feat_collection.get_all().await.unwrap();
    let _heritages: Vec<Heritage> = heritage_collection.get_all().await.unwrap();
    let _ancestries: Vec<Ancestry> = ancestry_collection.get_all().await.unwrap();
    let _actions: Vec<Action> = action_collection.get_all().await.unwrap();
    let _classes: Vec<Class> = class_collection.get_all().await.unwrap();
    let _backgrounds: Vec<Background> = background_collection.get_all().await.unwrap();
    let _equipment: Vec<Equipment> = equipment_collection.get_all().await.unwrap();
    let _conditions: Vec<Condition> = condition_collection.get_all().await.unwrap();
}

#[tokio::test]
async fn export_bindings() {
    use crate::models::*;
    use models::summary::Summary;
    use specta_typescript::Typescript;
    use specta_util::TypeCollection;
    use user::UserClaims;

    // Export types to Typescript file
    TypeCollection::default()
        .register::<Condition>()
        .register::<Equipment>()
        .register::<Heritage>()
        .register::<Ancestry>()
        .register::<Feat>()
        .register::<Action>()
        .register::<Class>()
        .register::<Background>()
        .register::<SavingThrow>()
        //
        .register::<Character>()
        .register::<Summary>()
        .register::<LinkPreview>()
        .register::<UserClaims>()
        // forms
        .register::<LoginForm>()
        .register::<SignupForm>()
        .register::<GetFeatsFilterForm>()
        .register::<NewCharacterForm>()
        .export_to(Typescript::new(), "../frontend/src/lib/bindings.ts")
        .unwrap();
}
