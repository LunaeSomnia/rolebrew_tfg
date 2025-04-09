use std::{marker::PhantomData, process::exit, sync::Arc};

use bson::{Document, doc};
use futures::TryStreamExt;
use mongodb::Client;
use storeable::Storeable;

pub mod storeable;
pub mod users_db_impl;

pub const DATABASE_NAME: &str = "rolebrew";

#[derive(Clone, Debug)]
pub struct Database {
    connection: Client,
}

impl Database {
    /// Creates or open a database from the path given.
    pub async fn connect() -> Result<Self, mongodb::error::Error> {
        let uri = std::env::var("MONGO_URL").unwrap();

        let client = Client::with_uri_str(uri).await.expect("failed to connect");

        Ok(Self { connection: client })
    }

    pub async fn get_client(&self) -> Result<Client, mongodb::error::Error> {
        Ok(self.connection.clone())
    }
}

#[derive(Debug)]
pub struct DatabaseCollection<T> {
    phantom: PhantomData<T>,
    database: Arc<Database>,
}

impl<T> DatabaseCollection<T>
where
    T: Storeable,
{
    pub fn new(db: Arc<Database>) -> Self {
        Self {
            database: db.clone(),
            phantom: PhantomData,
        }
    }

    pub async fn get(&self, id: &str) -> Result<Option<T>, mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection: mongodb::Collection<T> =
            client.database(DATABASE_NAME).collection(T::table_name());
        let result: Option<T> = match collection.find_one(doc! { "id": id }).await {
            Ok(Some(v)) => Some(v),
            Ok(None) => None,
            Err(err) => return Err(err),
        };
        Ok(result)
    }

    pub async fn get_secondary(
        &self,
        id: &str,
        secondary_col: &str,
    ) -> Result<Option<T>, mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection: mongodb::Collection<serde_json::Value> =
            client.database(DATABASE_NAME).collection(T::table_name());
        let json_value: Result<Option<serde_json::Value>, mongodb::error::Error> =
            collection.find_one(doc! { secondary_col: id }).await;
        let result: Option<T> = match json_value {
            Ok(Some(v)) => {
                let str = serde_json::to_string(&v).unwrap();
                let parse_result = serde_json::from_str(&str);
                if let Err(e) = parse_result {
                    eprintln!("This value failed to parse {}\n with error: {}", v, e);
                    exit(1)
                } else {
                    parse_result.unwrap()
                }
            }
            Ok(None) => None,
            Err(err) => return Err(err),
        };
        Ok(result)
    }

    pub async fn get_all(&self) -> Result<Vec<T>, mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection: mongodb::Collection<serde_json::Value> =
            client
                .database(DATABASE_NAME)
                .collection::<serde_json::Value>(T::table_name());
        let cursor = collection.find(doc! {}).await?;
        let col: Vec<serde_json::Value> = cursor.try_collect().await?;
        let transformed_col: Vec<T> = col
            .into_iter()
            .map(|v| {
                let str = serde_json::to_string(&v).unwrap();
                let parse_result = serde_json::from_str(&str);
                if let Err(e) = parse_result {
                    eprintln!("This value failed to parse {}\n with error: {}", v, e);
                    exit(1)
                } else {
                    parse_result.unwrap()
                }
            })
            .collect();
        Ok(transformed_col)
    }

    pub async fn get_all_filtered(
        &self,
        filter: Document,
    ) -> Result<Vec<T>, mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection: mongodb::Collection<serde_json::Value> =
            client
                .database(DATABASE_NAME)
                .collection::<serde_json::Value>(T::table_name());
        println!("{:?}", filter);
        let cursor = collection.find(filter).await?;
        let col: Vec<serde_json::Value> = cursor.try_collect().await?;
        let transformed_col: Vec<T> = col
            .into_iter()
            .map(|v| {
                let str = serde_json::to_string(&v).unwrap();
                let parse_result = serde_json::from_str(&str);
                if let Err(e) = parse_result {
                    eprintln!("This value failed to parse {}\n with error: {}", v, e);
                    exit(1)
                } else {
                    parse_result.unwrap()
                }
            })
            .collect();
        Ok(transformed_col)
    }

    pub async fn insert(&self, value: &T) -> Result<(), mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection = client
            .database(DATABASE_NAME)
            .collection::<T>(T::table_name());
        let _result = collection.insert_one(value).await?;
        Ok(())
    }

    pub async fn insert_vec(&self, vec: &[T]) -> Result<(), mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection = client
            .database(DATABASE_NAME)
            .collection::<T>(T::table_name());
        let _result = collection.insert_many(vec).await?;
        Ok(())
    }

    pub async fn delete(&self, id: &str) -> Result<(), mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection = client
            .database(DATABASE_NAME)
            .collection::<T>(T::table_name());
        let _result = collection.delete_one(doc! { "id": id}).await?;
        Ok(())
    }

    pub async fn delete_all(&self) -> Result<(), mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection = client
            .database(DATABASE_NAME)
            .collection::<T>(T::table_name());
        collection.drop().await?;
        Ok(())
    }

    pub async fn count(&self) -> Result<u64, mongodb::error::Error> {
        let client = self.database.get_client().await?;
        let collection = client
            .database(DATABASE_NAME)
            .collection::<T>(T::table_name());
        let result = collection.count_documents(doc! {}).await?;
        Ok(result)
    }
}
