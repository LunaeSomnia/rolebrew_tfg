use argon2::{
    Argon2, PasswordHasher, PasswordVerifier,
    password_hash::{SaltString, rand_core::OsRng},
};

pub fn hash_password(password: &str) -> argon2::password_hash::Result<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)?
        .to_string();

    Ok(password_hash)
}

pub fn verify_hash(hashed_password_1: &str, hashed_password_2: &str) -> bool {
    match argon2::PasswordHash::new(hashed_password_1) {
        Err(_e) => false,
        Ok(parsed_hash) => {
            let argon2 = Argon2::default();
            argon2
                .verify_password(hashed_password_2.as_bytes(), &parsed_hash)
                .is_ok()
        }
    }
}
