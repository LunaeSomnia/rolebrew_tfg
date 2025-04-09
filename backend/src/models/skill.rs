use serde::{Deserialize, Serialize};
use specta::Type;
use strum::{Display, EnumString};

#[derive(
    Serialize,
    Deserialize,
    Debug,
    Type,
    Clone,
    Copy,
    EnumString,
    Display,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
)]
pub enum Skill {
    #[serde(alias = "acrobatics")]
    Acrobatics,
    #[serde(alias = "arcana")]
    Arcana,
    #[serde(alias = "athletics")]
    Athletics,
    #[serde(alias = "crafting")]
    Crafting,
    #[serde(alias = "deception")]
    Deception,
    #[serde(alias = "diplomacy")]
    Diplomacy,
    #[serde(alias = "intimidation")]
    Intimidation,
    #[serde(alias = "medicine")]
    Medicine,
    #[serde(alias = "nature")]
    Nature,
    #[serde(alias = "occultism")]
    Occultism,
    #[serde(alias = "performance")]
    Performance,
    #[serde(alias = "religion")]
    Religion,
    #[serde(alias = "society")]
    Society,
    #[serde(alias = "stealth")]
    Stealth,
    #[serde(alias = "survival")]
    Survival,
    #[serde(alias = "thievery")]
    Thievery,
}
