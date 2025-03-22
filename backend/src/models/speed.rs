use serde::{Deserialize, Serialize};
use specta::Type;

#[derive(Serialize, Deserialize, Debug, Type)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Speed {
    pub walk: u8,
    pub swim: Option<u8>,
}

impl ToString for Speed {
    fn to_string(&self) -> String {
        let mut str = self.walk.to_string();
        if let Some(swim) = self.swim {
            str.push_str(&format!(", {}", swim));
        }
        str
    }
}
