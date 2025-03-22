use actix_web::{
    Responder,
    cookie::{Cookie, time::Duration},
    get, post,
    web::{Data, Path},
};
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;
use tokio::sync::RwLock;

use crate::{
    DatabaseCollection,
    auth::{generate_tokens, verify_token},
    hash::{hash_password, verify_hash},
    user::User,
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
                return actix_web::HttpResponse::BadRequest().body("username not found");
            }

            let user = user_option.unwrap();

            if verify_hash(&user.password_hash, &form.password) {
                let (access_token, refresh_token) = generate_tokens(&form.username);

                actix_web::HttpResponse::Ok()
                    .cookie(
                        Cookie::build("access_token", access_token)
                            .path("/")
                            .secure(true)
                            .http_only(true)
                            .finish(),
                    )
                    .cookie(
                        Cookie::build("refresh_token", refresh_token)
                            .path("/")
                            .secure(true)
                            .http_only(true)
                            .finish(),
                    )
                    .finish()
            } else {
                actix_web::HttpResponse::BadRequest().body("incorrect password")
            }
        }
        Err(_e) => actix_web::HttpResponse::BadRequest().body("username not found"),
    }
}

#[post("/api/auth/logout")]
async fn logout() -> impl Responder {
    actix_web::HttpResponse::Ok()
        .cookie(
            Cookie::build("access_token", "")
                .path("/")
                .secure(true)
                .http_only(true)
                .max_age(Duration::new(0, 0))
                .finish(),
        )
        .cookie(
            Cookie::build("refresh_token", "")
                .path("/")
                .secure(true)
                .http_only(true)
                .max_age(Duration::new(0, 0))
                .finish(),
        )
        .json("Logged out")
}

#[post("/api/auth/refresh")]
async fn refresh(req: actix_web::HttpRequest) -> impl Responder {
    let refresh_secret = std::env::var("REFRESH_SECRET").expect("REFRESH_SECRET not set");

    if let Some(cookie) = req.cookie("refresh_token") {
        if let Some(claims) = verify_token(cookie.value(), &refresh_secret) {
            let (access_token, new_refresh_token) = generate_tokens(&claims.sub);

            return actix_web::HttpResponse::Ok()
                .insert_header((
                    "Set-Cookie",
                    format!("access_token={}; HttpOnly; Secure; Path=/", access_token),
                ))
                .insert_header((
                    "Set-Cookie",
                    format!(
                        "refresh_token={}; HttpOnly; Secure; Path=/",
                        new_refresh_token
                    ),
                ))
                .json("Token refreshed");
        }
    }

    actix_web::HttpResponse::Unauthorized().body("Invalid refresh token")
}

#[derive(Serialize, Deserialize, Type)]
pub struct CreateUserForm {
    username: String,
    password: String,
    email: String,
}

#[post("/api/auth/signup")]
pub async fn create_user(
    db: CollectionData<'_>,
    form: actix_web::web::Json<CreateUserForm>,
) -> impl Responder {
    let db = db.read().await;
    if let Ok(db_user_result) = db.get_from_username(&form.username).await {
        if db_user_result.is_some() {
            return actix_web::HttpResponse::BadRequest().body("user already exists");
        }
    }

    let password_hashed_result = hash_password(&form.password);
    if password_hashed_result.is_err() {
        return actix_web::HttpResponse::InternalServerError().finish();
    }

    let new_user = User {
        id: ObjectId::new(),
        username: form.username.to_string(),
        password_hash: password_hashed_result.unwrap(),
        email: form.email.to_string(),
    };

    if let Err(_e) = db.insert(&new_user).await {
        return actix_web::HttpResponse::InternalServerError().finish();
    }

    actix_web::HttpResponse::Ok().finish()
}

#[get("/api/user/hash/{password}")]
pub async fn hash(password: Path<String>) -> impl Responder {
    actix_web::HttpResponse::Ok().json(hash_password(&password).unwrap())
}
