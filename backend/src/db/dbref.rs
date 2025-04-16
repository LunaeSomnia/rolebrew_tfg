use std::sync::Arc;

use actix_web::web::Data;
use tokio::sync::RwLock;

use crate::{
    models::{Action, Ancestry, Background, Class, Condition, Equipment, Feat, Heritage},
    user::User,
};

use super::{CollectionData, Database, DatabaseCollection, storeable::Storeable};

#[derive(Clone, Debug)]
pub struct DbRef {
    pub user_coll: CollectionData<User>,
    pub feat_coll: CollectionData<Feat>,
    pub heritage_coll: CollectionData<Heritage>,
    pub ancestry_coll: CollectionData<Ancestry>,
    pub action_coll: CollectionData<Action>,
    pub class_coll: CollectionData<Class>,
    pub background_coll: CollectionData<Background>,
    pub equipment_coll: CollectionData<Equipment>,
    pub condition_coll: CollectionData<Condition>,
}

fn create_collection_and_data<T>(db_ref: Arc<Database>) -> Data<RwLock<DatabaseCollection<T>>>
where
    T: Storeable,
{
    let collection = DatabaseCollection::<T>::new(db_ref.clone());
    let data = Data::new(RwLock::new(collection));
    data
}

impl DbRef {
    pub fn new(db: Database) -> Self {
        let db_ref = Arc::new(db);
        let user_coll = create_collection_and_data::<User>(db_ref.clone());
        let feat_coll = create_collection_and_data::<Feat>(db_ref.clone());
        let heritage_coll = create_collection_and_data::<Heritage>(db_ref.clone());
        let ancestry_coll = create_collection_and_data::<Ancestry>(db_ref.clone());
        let action_coll = create_collection_and_data::<Action>(db_ref.clone());
        let class_coll = create_collection_and_data::<Class>(db_ref.clone());
        let background_coll = create_collection_and_data::<Background>(db_ref.clone());
        let equipment_coll = create_collection_and_data::<Equipment>(db_ref.clone());
        let condition_coll = create_collection_and_data::<Condition>(db_ref.clone());

        Self {
            user_coll,
            feat_coll,
            heritage_coll,
            ancestry_coll,
            action_coll,
            class_coll,
            background_coll,
            equipment_coll,
            condition_coll,
        }
    }
}
