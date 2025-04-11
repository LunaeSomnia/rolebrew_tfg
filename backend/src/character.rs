use std::collections::BTreeMap;

use actix_web::web::Data;
use bson::oid::ObjectId;
use serde::{Deserialize, Serialize};
use specta::Type;
use tokio::sync::RwLock;

use crate::{
    DatabaseCollection, NewCharacterForm,
    models::{
        Ancestry, Attribute, Background, Class, Proficiency, SavingThrows, Size, Skill, Speed,
        Vision,
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

    pub ancestry: String,
    pub class: String,
    pub background: String,
}

type CollectionData<'a, T> = Data<RwLock<DatabaseCollection<T>>>;

impl Character {
    pub async fn construct(
        form: NewCharacterForm,
        ancestry_col: CollectionData<'_, Ancestry>,
        background_col: CollectionData<'_, Background>,
        class_col: CollectionData<'_, Class>,
    ) -> Self {
        let ancestry_col = ancestry_col.read().await;
        let background_col = background_col.read().await;
        let class_col = class_col.read().await;

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
        }
    }
}
