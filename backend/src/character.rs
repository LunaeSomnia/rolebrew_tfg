use std::{collections::BTreeMap, sync::Arc};

use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;

use crate::{
    NewCharacterForm,
    dbref::DbRef,
    models::{
        Attribute, ClassAttacks, ClassDefenses, Feat, GrantItemResult, Proficiency, Rule,
        SavingThrows, Size, Skill, Speed, Vision,
    },
};

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Character {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub name: String,
    pub level: u8,
    pub attribute_modifiers: BTreeMap<Attribute, i8>,
    pub hp: u8,
    pub skills: BTreeMap<Skill, Proficiency>,
    pub additional_skills: BTreeMap<String, (Attribute, Proficiency)>,
    pub vision: Vision,
    pub speed: Speed,
    pub size: Size,
    pub saving_throws: SavingThrows,
    pub key_ability: Vec<Attribute>,
    pub armor_proficiencies: ClassDefenses,
    pub weapon_proficiencies: ClassAttacks,

    pub ancestry: String,
    pub class: String,
    pub background: String,

    pub features: Vec<Feat>,
    pub rules: Vec<Rule>,

    pub state: Option<CharacterState>,
}

pub type CharacterState = serde_json::Value;

impl Character {
    pub async fn construct(form: NewCharacterForm, db: Arc<DbRef>) -> Self {
        let ancestry_col = db.ancestry_coll.read().await;
        let background_col = db.background_coll.read().await;
        let class_col = db.class_coll.read().await;

        let ancestry = ancestry_col
            .get_secondary(&form.ancestry, "slug")
            .await
            .unwrap()
            .unwrap();
        let background = background_col
            .get_secondary(&form.background, "slug")
            .await
            .unwrap()
            .unwrap();
        let class = class_col
            .get_secondary(&form.class, "slug")
            .await
            .unwrap()
            .unwrap();

        let lvl = form.level;

        let con = *form
            .attribute_modifiers
            .get(&Attribute::Constitution)
            .unwrap();

        let hp = ancestry.hp as i16 + class.hp as i16 + con as i16 * lvl as i16; // we multiply with higher bits so we can't possibly overflow
        let vision = ancestry.vision;
        let speed = ancestry.speed;
        let size = ancestry.size;
        let saving_throws = SavingThrows {
            fortitude: class.saving_throws.fortitude,
            reflex: class.saving_throws.reflex,
            will: class.saving_throws.will,
            class_dc: Proficiency::Trained,
            perception: class.perception,
        };
        let key_ability: Vec<Attribute> = class.key_ability;

        let armor_proficiencies = class.defenses;
        let weapon_proficiencies = class.attacks;

        let ancestry_features: Vec<Feat> = ancestry
            .features
            .into_iter()
            .filter(|v| v.level <= lvl)
            .collect();

        let background_features: Vec<Feat> = background
            .features
            .into_iter()
            .filter(|v| v.level <= lvl)
            .collect();

        let class_features: Vec<Feat> = class
            .features
            .into_iter()
            .filter(|v| v.level <= lvl)
            .collect();

        let features: Vec<Feat> = ancestry_features
            .into_iter()
            .chain(background_features.into_iter())
            .chain(class_features.into_iter())
            .collect();

        let rules: Vec<Rule> = features
            .iter()
            .cloned()
            .map(|v| v.rules)
            .flatten()
            .collect();

        let grant_rules = futures::future::join_all(
            rules
                .iter()
                .filter_map(|v| {
                    if let Rule::ChoiceSet(_r) = v {
                        return None;
                    }

                    if let Rule::GrantItem(r) = v {
                        return Some(r);
                    }
                    None
                })
                .map(|v| v.execute(db.clone())),
        )
        .await;
        let grant_rules: Vec<GrantItemResult> = grant_rules.into_iter().filter_map(|v| v).collect();

        println!("{:?}", grant_rules);

        Self {
            id: ObjectId::new(),
            name: form.name,
            level: form.level,
            attribute_modifiers: form.attribute_modifiers,
            hp: hp as u8,
            skills: form.skills,
            additional_skills: form.additional_skills,
            vision,
            speed,
            size,
            saving_throws,
            ancestry: form.ancestry,
            background: form.background,
            class: form.class,
            key_ability,
            armor_proficiencies,
            weapon_proficiencies,
            features,
            rules,
            state: None,
        }
    }
}
