use std::env;

use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

const ACCESS_EXPIRY: usize = 7 * 24 * 60 * 60; // 7 days

pub fn generate_tokens(user_id: &str) -> String {
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET not set");

    let claims = Claims {
        sub: user_id.to_owned(),
        exp: chrono::Utc::now().timestamp() as usize + ACCESS_EXPIRY,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
    .unwrap();

    token
}

pub fn verify_token(token: &str, secret: &str) -> Option<Claims> {
    decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret.as_ref()),
        &Validation::default(),
    )
    .ok()
    .map(|t| t.claims)
}
