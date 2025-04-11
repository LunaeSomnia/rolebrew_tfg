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
#[serde(rename_all = "camelCase")]
pub enum SavingThrow {
    Fortitude,
    Reflex,
    Will,
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
