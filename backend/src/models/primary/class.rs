use crate::helpers::null_to_default;
use crate::models::{
    Attribute, LinkPreview, Proficiency, Publication, Rule, Skill, Summary, SummaryData,
};
use crate::storeable::Storeable;
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

use super::Feat;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Class {
    #[serde(rename = "_id")]
    pub mongo_id: ObjectId,
    pub fvtt_id: String,
    pub name: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub ancestry_feat_levels: Vec<u8>,
    pub attacks: ClassAttacks,
    #[serde(default, deserialize_with = "null_to_default")]
    pub class_feat_levels: Vec<u8>,
    pub defenses: ClassDefenses,
    pub description: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub general_feat_levels: Vec<u8>,
    pub hp: u8,
    #[serde(default, deserialize_with = "null_to_default")]
    pub features: Vec<Feat>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub key_ability: Vec<Attribute>,
    pub perception: Proficiency,
    pub publication: Publication,
    #[serde(default, deserialize_with = "null_to_default")]
    pub rules: Vec<Rule>,
    pub saving_throws: ClassSavingThrows,
    #[serde(default, deserialize_with = "null_to_default")]
    pub skill_feat_levels: Vec<u8>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub skill_increase_levels: Vec<u8>,
    pub spellcasting: bool,
    pub trained_skills: ClassTrainedSkills,
    pub rarity: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub traits: Vec<String>,
    pub slug: String,
    #[serde(rename = "type")]
    pub data_type: String,
}

impl Storeable for Class {
    fn table_name() -> &'static str {
        "class"
    }
}

impl From<Class> for Summary {
    fn from(value: Class) -> Self {
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

impl From<Class> for LinkPreview {
    fn from(value: Class) -> Self {
        Self {
            slug: value.slug,
            name: value.name,
            description: value.description,
            rarity: Some(value.rarity),
            traits: value.traits,
        }
    }
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ClassAttacks {
    pub unarmed: bool,
    pub simple: bool,
    pub martial: bool,
    pub advanced: bool,
    pub other: ClassAttacksOther,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ClassAttacksOther {
    pub name: String,
    pub rank: Proficiency,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ClassDefenses {
    pub unarmored: bool,
    pub light: bool,
    pub medium: bool,
    pub heavy: bool,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ClassSavingThrows {
    pub fortitude: Proficiency,
    pub reflex: Proficiency,
    pub will: Proficiency,
}

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct ClassTrainedSkills {
    pub additional: u8,
    pub value: Vec<Skill>,
    pub custom: Option<String>,
}
