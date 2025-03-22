use serde::{Deserialize, Serialize};
use specta::Type;
use strum::{Display, EnumString};

#[derive(Serialize, Deserialize, Debug, Type, Clone, Copy, EnumString, Display)]
#[serde(deny_unknown_fields)]
pub enum Size {
    #[serde(alias = "tiny")]
    Tiny,
    #[serde(alias = "sm")]
    Small,
    #[serde(alias = "med")]
    Medium,
    #[serde(alias = "lg")]
    Large,
}
