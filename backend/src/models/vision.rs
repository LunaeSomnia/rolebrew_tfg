use serde::{Deserialize, Serialize};
use specta::Type;
use strum::{Display, EnumString};

#[derive(Serialize, Deserialize, Debug, Type, Clone, Copy, EnumString, Display)]
#[serde(rename_all = "kebab-case")]
pub enum Vision {
    Normal,
    LowLightVision,
    Darkvision,
    GreaterDarkvision,
    Scent,
    Tremorsense,
}
