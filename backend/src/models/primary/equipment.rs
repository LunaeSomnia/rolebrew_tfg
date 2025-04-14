use std::collections::{BTreeMap, HashMap};

use crate::helpers::{Either, null_to_default};
use crate::models::{
    Attribute, BoostOrFlaw, DamageRoll, LinkPreview, Publication, Rule, Skill, Summary, SummaryData,
};
use crate::storeable::Storeable;
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

use super::Feat;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Equipment {
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub fvtt_id: String,
    pub name: String,

    pub ac_bonus: Option<u8>,
    pub apex: Option<Attribute>,
    pub base_item: Option<String>,
    pub bonus: Option<u8>,
    pub bulk: Option<EquipmentBulk>,
    pub category: Option<String>,
    pub check_penalty: Option<i8>,
    pub damage: Option<DamageRoll>,
    pub description: String,
    pub dex_cap: Option<u8>,
    pub carry_type: Option<String>,
    pub group: Option<String>,
    pub level: Option<u8>,
    pub price: Option<EquipmentPrice>,
    pub quantity: Option<u8>,
    pub range: Option<u32>,
    pub runes: Option<EquipmentRunes>,
    pub size: Option<String>,
    pub speed_penalty: Option<i8>,
    pub splash_damage: Option<u8>,
    pub stack_group: Option<String>,
    pub stowing: Option<bool>,
    pub strength: Option<u8>,
    pub usage: Option<EquipmentUsage>,
    pub uses: Option<EquipmentUses>,

    pub rules: Vec<Rule>,
    pub publication: Publication,
    pub rarity: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traits: Vec<String>,
    pub slug: String,
    #[serde(rename = "type")]
    pub data_type: String,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct EquipmentUses {
    auto_destroy: Option<bool>,
    max: u32,
    value: u32,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct EquipmentUsage {
    can_be_ammo: Option<bool>,
    value: String,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct EquipmentRunes {
    potency: Option<u8>,
    #[serde(default, deserialize_with = "null_to_default")]
    property: Vec<String>,
    reinforcing: Option<u8>,
    resilient: Option<u8>,
    striking: Option<u8>,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct EquipmentPrice {
    per: Option<u8>,
    cp: Option<u32>,
    sp: Option<u32>,
    gp: Option<u32>,
    pp: Option<u32>,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct EquipmentBulk {
    held_or_stowed: Option<Either<bool, f32>>,
    capacity: Option<u32>,
    ignored: Option<u32>,
    value: f32,
}

impl Storeable for Equipment {
    fn table_name() -> &'static str {
        "equipment"
    }
}

impl From<Equipment> for Summary {
    fn from(value: Equipment) -> Self {
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

impl From<Equipment> for LinkPreview {
    fn from(value: Equipment) -> Self {
        Self {
            slug: value.slug,
            name: value.name,
            description: value.description,
            rarity: Some(value.rarity),
            traits: value.traits,
        }
    }
}
