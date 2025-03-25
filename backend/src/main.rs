use std::sync::Arc;

use actix_cors::Cors;
use actix_web::{App, HttpServer, http::header, middleware::Logger, web::Data};
use dotenv::dotenv;
use models::{
    link_preview::LinkPreview,
    primary::{ancestry::Ancestry, feat::Feat, journal::Journal},
};
use tokio::sync::RwLock;
use user::User;

pub mod api;
pub use api::*;

pub mod helpers;

pub mod db;
pub use db::*;

pub mod models;

pub mod auth;
pub mod hash;
pub mod user;

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
    let db_ref = Arc::new(db);

    HttpServer::new(move || {
        let users_collection = DatabaseCollection::<User>::new(db_ref.clone());
        let users_data = Data::new(RwLock::new(users_collection));

        let feat_collection = DatabaseCollection::<Feat>::new(db_ref.clone());
        let feat_data = Data::new(RwLock::new(feat_collection));

        let ancestry_collection = DatabaseCollection::<Ancestry>::new(db_ref.clone());
        let ancestry_data = Data::new(RwLock::new(ancestry_collection));

        let journal_collection = DatabaseCollection::<Journal>::new(db_ref.clone());
        let journal_data = Data::new(RwLock::new(journal_collection));

        App::new()
            .app_data(users_data)
            .app_data(feat_data)
            .app_data(ancestry_data)
            .app_data(journal_data)
            // auth
            .service(login)
            .service(logout)
            .service(refresh)
            .service(hash)
            // users
            .service(create_user)
            //feat
            .service(get_feat_summaries)
            .service(get_feat_preview)
            .service(get_feat)
            // ancestries
            .service(get_ancestry_summaries)
            .service(get_ancestry)
            // journals
            .service(get_journal)
            .wrap(actix_web::middleware::DefaultHeaders::new())
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:5173")
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![header::AUTHORIZATION, header::ACCEPT])
                    .allowed_header(header::CONTENT_TYPE)
                    .supports_credentials()
                    .max_age(3600),
            )
            .wrap(Logger::default())
    })
    .bind(("127.0.0.1", 8080))?
    .workers(1)
    .run()
    .await
}

#[tokio::test]
async fn test_database_data() {
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
    let ancestry_collection = DatabaseCollection::<Ancestry>::new(db_ref.clone());
    let journal_collection = DatabaseCollection::<Journal>::new(db_ref.clone());

    feat_collection.get_all().await.unwrap();
    ancestry_collection.get_all().await.unwrap();
    journal_collection.get_all().await.unwrap();
}

#[tokio::test]
async fn export_bindings() {
    use crate::models::primary::ancestry::Ancestry;
    use models::summary::Summary;
    use specta_typescript::Typescript;
    use specta_util::TypeCollection;

    // Export types to Typescript file
    TypeCollection::default()
        .register::<Ancestry>()
        .register::<Journal>()
        .register::<Feat>()
        //
        .register::<Summary>()
        .register::<LinkPreview>()
        // forms
        .register::<LoginForm>()
        .register::<CreateUserForm>()
        .register::<GetFeatsFilterForm>()
        .export_to(Typescript::new(), "../frontend/src/lib/bindings.ts")
        .unwrap();
}
