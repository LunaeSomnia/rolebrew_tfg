use serde::{Deserialize, Serialize};
use specta::Type;
use strum::{Display, EnumString};

use super::Proficiency;

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
#[serde(rename_all = "kebab-case")]
pub enum SavingThrow {
    Fortitude,
    Reflex,
    Will,

    // Other
    Ac,
    FortitudeDc,
    ReflexDc,
    WillDc,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SavingThrows {
    pub fortitude: Proficiency,
    pub reflex: Proficiency,
    pub will: Proficiency,
    pub class_dc: Proficiency,
    pub perception: Proficiency,
}
