use serde::{Deserialize, Serialize, Serializer, ser::SerializeSeq};
use specta::Type;

#[derive(Deserialize, Debug, Clone, Default)]
#[serde(untagged)]
pub enum MVec<T> {
    #[default]
    None,
    Single(T),
    Vec(Vec<T>),
}

#[allow(dead_code)]
#[derive(Type)]
#[serde(remote = MVec)]
pub struct MVecType<T>(Vec<T>);

impl<T: Serialize> Serialize for MVec<T> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        match self {
            MVec::None => serializer.serialize_seq(Some(0))?.end(),
            MVec::Single(item) => serializer.collect_seq(std::iter::once(item)),
            MVec::Vec(vec) => serializer.collect_seq(vec),
        }
    }
}

pub fn none_single_or_vec<'de, D>(deserializer: D) -> Result<Vec<String>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let opt = Option::<serde_json::Value>::deserialize(deserializer)?;
    match opt {
        Some(serde_json::Value::String(s)) => Ok(vec![s]), // Single string → Vec
        Some(serde_json::Value::Array(arr)) => {
            let vec = arr
                .into_iter()
                .map(serde_json::from_value)
                .collect::<Result<Vec<String>, _>>()
                .map_err(serde::de::Error::custom)?;
            Ok(vec) // Already a Vec<String>
        }
        None => Ok(vec![]), // Default to an empty Vec
        _ => Err(serde::de::Error::custom(
            "Invalid format for none_single_or_vec deserializer",
        )),
    }
}

pub fn null_to_default<'de, D, T>(deserializer: D) -> Result<T, D::Error>
where
    D: serde::Deserializer<'de>,
    T: Default + serde::Deserialize<'de>,
{
    Ok(Option::deserialize(deserializer)?.unwrap_or_default())
}

#[derive(
    Serialize, Deserialize, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Debug, Type,
)]
#[serde(untagged)]
pub enum Either<L, R> {
    /// A value of type `L`.
    Left(L),
    /// A value of type `R`.
    Right(R),
}
