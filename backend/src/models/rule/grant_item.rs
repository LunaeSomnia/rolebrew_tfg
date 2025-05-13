use super::RulePredicateFilter;
use crate::{
    dbref::DbRef,
    helpers::{MVec, null_to_default},
    models::{Action, Condition, Equipment, Feat},
};
use serde::{Deserialize, Serialize};
use specta::Type;
use std::{collections::BTreeMap, sync::Arc};

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct GrantItemRule {
    pub track: Option<bool>,
    pub in_memory_only: Option<bool>,
    pub reevaluate_on_update: Option<bool>,
    pub allow_duplicate: Option<bool>,
    pub nest_feat: Option<bool>,

    pub preselect_coices: Option<serde_json::Value>, // lmao typo
    pub flag: Option<String>,
    pub uuid: String,
    #[serde(default, deserialize_with = "null_to_default")]
    pub predicate: MVec<RulePredicateFilter>,
    #[serde(default, deserialize_with = "null_to_default")]
    pub preselect_choices: BTreeMap<String, String>,
    pub on_delete_actions: Option<serde_json::Value>, // Worth nothing
    pub alterations: Option<serde_json::Value>,       // TODO: Check
    pub priority: Option<i16>,
}

#[derive(Serialize, Deserialize, Debug, Clone, Type)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub enum GrantItemResult {
    Condition(Condition),
    Equipment(Equipment),
    // Spell(Spell)
    Feat(Feat),
    Action(Action),
}

impl GrantItemRule {
    pub async fn execute(&self, db: Arc<DbRef>) -> Option<GrantItemResult> {
        let split = self.uuid.split(".").collect::<Vec<&str>>();

        if split.len() != 2 {
            return None;
        }

        let source = split[0];
        let uuid = split[1];

        let item = match source {
            "condition" => {
                let coll = db.condition_coll.read().await;
                if let Ok(Some(item)) = coll.get(uuid).await {
                    Some(GrantItemResult::Condition(item))
                } else {
                    None
                }
            }
            "equipment" => {
                let coll = db.equipment_coll.read().await;
                if let Ok(Some(item)) = coll.get(uuid).await {
                    Some(GrantItemResult::Equipment(item))
                } else {
                    None
                }
            }
            // "spell" => {
            //     let coll = db.condition_coll.read().await;
            //     if let Ok(Some(item)) = coll.get(uuid).await {
            //         return GrantItemResult::Condition(item);
            //     }
            // }
            "feat" => {
                let coll = db.feat_coll.read().await;
                if let Ok(Some(item)) = coll.get(uuid).await {
                    Some(GrantItemResult::Feat(item))
                } else {
                    None
                }
            }
            "action" => {
                let coll = db.action_coll.read().await;
                if let Ok(Some(item)) = coll.get(uuid).await {
                    Some(GrantItemResult::Action(item))
                } else {
                    None
                }
            }
            _ => {
                println!(
                    "cannot execute: Grant Item with source {} not found",
                    source
                );
                None
            }
        };

        item
    }
}
