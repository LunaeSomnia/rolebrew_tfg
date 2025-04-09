use actix_web::{
    Responder,
    cookie::Cookie,
    get, post,
    web::{Data, Path},
};
use serde::{Deserialize, Serialize};
use specta::Type;
use tokio::sync::RwLock;

use crate::{
    DatabaseCollection,
    auth::generate_tokens,
    hash::{hash_password, verify_hash},
    user::{User, UserClaims},
    users_db_impl::UserDBImpl,
};

type Collection<'a> = DatabaseCollection<User>;
type CollectionData<'a> = Data<RwLock<Collection<'a>>>;

#[derive(Serialize, Deserialize, Type)]
pub struct LoginForm {
    username: String,
    password: String,
}

#[post("/api/auth/login")]
pub async fn login(
    db: CollectionData<'_>,
    form: actix_web::web::Json<LoginForm>,
) -> impl Responder {
    let db = db.read().await;
    match db.get_from_username(&form.username).await {
        Ok(user_option) => {
            if user_option.is_none() {
                return actix_web::HttpResponse::BadRequest().body("Username not found");
            }

            let user = user_option.unwrap();

            if verify_hash(&user.password_hash, &form.password) {
                let token = generate_tokens(&form.username);

                actix_web::HttpResponse::Ok()
                    .cookie(
                        Cookie::build("token", token)
                            .path("/")
                            .secure(true)
                            .http_only(true)
                            .finish(),
                    )
                    .json(UserClaims::from(&user))
            } else {
                actix_web::HttpResponse::BadRequest().body("Incorrect password")
            }
        }
        Err(_e) => actix_web::HttpResponse::BadRequest().body("Username not found"),
    }
}

#[derive(Serialize, Deserialize, Type, Debug)]
pub struct SignupForm {
    username: String,
    password: String,
    email: String,
}

#[post("/api/auth/signup")]
pub async fn create_user(
    db: CollectionData<'_>,
    form: actix_web::web::Json<SignupForm>,
) -> impl Responder {
    println!("{:?}", &form.0);
    let db = db.read().await;
    if let Ok(db_user_result) = db.get_from_username(&form.username).await {
        if db_user_result.is_some() {
            return actix_web::HttpResponse::BadRequest().body("User already exists");
        }
    }

    let password_hashed_result = hash_password(&form.password);
    if password_hashed_result.is_err() {
        return actix_web::HttpResponse::InternalServerError().finish();
    }

    let new_user = User::new(
        form.username.to_string(),
        password_hashed_result.unwrap(),
        form.email.to_string(),
    );

    if let Err(_e) = db.insert(&new_user).await {
        return actix_web::HttpResponse::InternalServerError().finish();
    }

    actix_web::HttpResponse::Ok().finish()
}

#[get("/api/user/hash/{password}")]
pub async fn hash(password: Path<String>) -> impl Responder {
    actix_web::HttpResponse::Ok().json(hash_password(&password).unwrap())
}
