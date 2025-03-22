use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Default, Type)]
#[serde(untagged)]
pub enum MVec<T> {
    #[default]
    None,
    Single(T),
    Vec(Vec<T>),
}

pub fn null_to_default<'de, D, T>(deserializer: D) -> Result<T, D::Error>
where
    D: serde::Deserializer<'de>,
    T: Default + serde::Deserialize<'de>,
{
    Ok(Option::deserialize(deserializer)?.unwrap_or_default())
}
