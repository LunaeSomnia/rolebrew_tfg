use std::fmt::Debug;

use serde::{Serialize, de::DeserializeOwned};

pub trait Storeable: Send + Sync + DeserializeOwned + Serialize + Debug {
    fn table_name() -> &'static str;
}
