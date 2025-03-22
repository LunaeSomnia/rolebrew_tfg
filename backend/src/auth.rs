use std::env;

use jsonwebtoken::{DecodingKey, EncodingKey, Header, Validation, decode, encode};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
}

const ACCESS_EXPIRY: usize = 15 * 60; // 15 minutes
const REFRESH_EXPIRY: usize = 7 * 24 * 60 * 60; // 7 days

pub fn generate_tokens(user_id: &str) -> (String, String) {
    let secret = env::var("JWT_SECRET").expect("JWT_SECRET not set");
    let refresh_secret = env::var("REFRESH_SECRET").expect("REFRESH_SECRET not set");

    let access_claims = Claims {
        sub: user_id.to_owned(),
        exp: chrono::Utc::now().timestamp() as usize + ACCESS_EXPIRY,
    };

    let refresh_claims = Claims {
        sub: user_id.to_owned(),
        exp: chrono::Utc::now().timestamp() as usize + REFRESH_EXPIRY,
    };

    let access_token = encode(
        &Header::default(),
        &access_claims,
        &EncodingKey::from_secret(secret.as_ref()),
    )
    .unwrap();
    let refresh_token = encode(
        &Header::default(),
        &refresh_claims,
        &EncodingKey::from_secret(refresh_secret.as_ref()),
    )
    .unwrap();

    (access_token, refresh_token)
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
