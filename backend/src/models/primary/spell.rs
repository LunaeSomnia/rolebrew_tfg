use crate::helpers::{Either, null_to_default};
use crate::models::{
    Attribute, Damage, DamageRoll, LinkPreview, Publication, Rule, SavingThrow, Summary,
    SummaryData,
};
use crate::storeable::Storeable;
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;
use std::collections::BTreeMap;

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Spell {
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub fvtt_id: String,
    pub name: String,

    pub area: Option<SpellArea>,
    pub cost: Option<String>,
    pub counteraction: bool,
    #[serde(default, deserialize_with = "null_to_default")]
    pub damage: Vec<DamageRoll>,
    pub defense: Option<SpellDefense>,
    pub description: String,
    pub heightening: Option<SpellHeightening>,
    pub level: u8,
    pub publication: Publication,
    pub range: Option<String>,
    pub requirements: Option<String>,
    pub target: Option<String>,
    pub time: Option<String>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub rules: Vec<Rule>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traditions: Vec<String>,
    pub rarity: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traits: Vec<String>,
    pub slug: String,
    #[serde(rename = "type")]
    pub data_type: String,
}

impl Storeable for Spell {
    fn table_name() -> &'static str {
        "spell"
    }
}

impl From<Spell> for Summary {
    fn from(value: Spell) -> Self {
        let data = vec![SummaryData::String {
            value: value.name.clone(),
            link: None,
            tooltip: None,
            abbreviation: None,
        }];

        Self {
            id: value.fvtt_id,
            name: value.name,
            slug: value.slug,
            data,
        }
    }
}

impl From<Spell> for LinkPreview {
    fn from(value: Spell) -> Self {
        Self {
            slug: value.slug,
            name: value.name,
            description: value.description,
            rarity: Some(value.rarity),
            traits: value.traits,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub enum SpellAreaType {
    Burst,
    Cone,
    Line,
    Emanation,
    Square,
    Cylinder,
    Cube,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SpellArea {
    area_type: Option<SpellAreaType>,
    #[serde(rename = "type")]
    atype: SpellAreaType,
    value: u32,
    details: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SpellDefense {
    save: Option<SpellDefenseSave>,
    passive: Option<SpellDefenseSavePassive>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SpellDefenseSavePassive {
    statistic: SavingThrow,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SpellDefenseSave {
    basic: bool,
    statistic: SavingThrow,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub enum SpellHeighteningType {
    Interval,
    Fixed,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SpellHeightening {
    damage: Option<BTreeMap<String, String>>,
    levels: Option<BTreeMap<String, SpellHeighteningLevel>>,
    interval: Option<u8>,
    #[serde(rename = "type")]
    heightening_type: Option<SpellHeighteningType>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct SpellHeighteningLevel {
    damage: Option<BTreeMap<String, DamageRoll>>,
    area: Option<SpellArea>,
    range: Option<String>,
    target: Option<String>,
    time: Option<String>,
    #[serde(default, deserialize_with = "null_to_default")]
    traits: Vec<String>,
}
