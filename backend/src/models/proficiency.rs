use serde::{Deserialize, Deserializer, Serialize};
use specta::Type;
use strum::{Display, EnumString};

#[derive(Serialize, Debug, Type, Clone, Copy, EnumString, Display)]
#[serde(try_from = "u8")]
pub enum Proficiency {
    #[serde(alias = "Untrained")]
    Untrained = 0,
    #[serde(alias = "Trained")]
    Trained = 1,
    #[serde(alias = "Expert")]
    Expert = 2,
    #[serde(alias = "Master")]
    Master = 3,
    #[serde(alias = "Legendary")]
    Legendary = 4,
}

impl From<u8> for Proficiency {
    fn from(value: u8) -> Self {
        match value {
            0 => Self::Untrained,
            1 => Self::Trained,
            2 => Self::Expert,
            3 => Self::Master,
            4 => Self::Legendary,
            _ => panic!("invalid proficiency value: {}", value),
        }
    }
}

#[derive(Deserialize)]
#[serde(untagged)]
enum ProficiencyDef {
    Index(u8),
    Name(String),
}

impl<'de> Deserialize<'de> for Proficiency {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let val = ProficiencyDef::deserialize(deserializer)?;
        match val {
            ProficiencyDef::Index(i) => match i {
                0 => Ok(Proficiency::Untrained),
                1 => Ok(Proficiency::Trained),
                2 => Ok(Proficiency::Expert),
                3 => Ok(Proficiency::Master),
                4 => Ok(Proficiency::Legendary),
                _ => Err(serde::de::Error::custom(format!(
                    "Invalid proficiency index: {}",
                    i
                ))),
            },
            ProficiencyDef::Name(s) => s.parse::<Proficiency>().map_err(|_| {
                serde::de::Error::custom(format!("Invalid proficiency string: {}", s))
            }),
        }
    }
}
