use std::sync::Arc;

use actix_cors::Cors;
use actix_web::{App, HttpServer, http::header, middleware::Logger, web::Data};
use db::storeable::Storeable;
use dotenv::dotenv;
use models::primary::{action::Action, ancestry::Ancestry, feat::Feat};
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

fn create_collection_and_data<T>(db_ref: Arc<Database>) -> Data<RwLock<DatabaseCollection<T>>>
where
    T: Storeable,
{
    let collection = DatabaseCollection::<T>::new(db_ref.clone());
    let data = Data::new(RwLock::new(collection));
    data
}

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

    println!("Running rolebrew backend...");

    HttpServer::new(move || {
        let users_data = create_collection_and_data::<User>(db_ref.clone());
        let feat_data = create_collection_and_data::<Feat>(db_ref.clone());
        let ancestry_data = create_collection_and_data::<Ancestry>(db_ref.clone());
        let action_data = create_collection_and_data::<Action>(db_ref.clone());

        App::new()
            .app_data(users_data)
            .app_data(feat_data)
            .app_data(ancestry_data)
            .app_data(action_data)
            // auth
            .service(login)
            .service(hash)
            // users
            .service(create_user)
            // action
            .service(get_action_summaries)
            .service(get_action_preview)
            .service(get_action)
            // feat
            .service(get_feat_summaries)
            .service(get_feat_preview)
            .service(get_feat)
            // ancestries
            .service(get_ancestry_summaries)
            .service(get_ancestry)
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
    let action_collection = DatabaseCollection::<Action>::new(db_ref.clone());

    feat_collection.get_all().await.unwrap();
    ancestry_collection.get_all().await.unwrap();
    action_collection.get_all().await.unwrap();
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
        .register::<Ancestry>()
        .register::<Feat>()
        .register::<Action>()
        //
        .register::<Summary>()
        .register::<LinkPreview>()
        .register::<UserClaims>()
        // forms
        .register::<LoginForm>()
        .register::<SignupForm>()
        .register::<GetFeatsFilterForm>()
        .export_to(Typescript::new(), "../frontend/src/lib/bindings.ts")
        .unwrap();
}
