import { exit } from "node:process";
import "reflect-metadata";
import "es6-shim";
import * as mongoDB from "mongodb";
import {
    ACTIONS,
    ANCESTRIES,
    ANCESTRY_FEATURES,
    BACKGROUNDS,
    CLASS_FEATURES,
    CLASSES,
    CONDITIONS,
    EQUIPMENT,
    FEATS,
    HERITAGES,
    SPELLS,
} from "./models/index.ts";

const dbConnectionString = process.env.MONGO_URL ?? "";
console.info("Connecting to", dbConnectionString);

export const mongoDBClient: mongoDB.MongoClient = new mongoDB.MongoClient(
    dbConnectionString,
);
await mongoDBClient.connect();
export const db: mongoDB.Db = mongoDBClient.db("rolebrew");

console.info(`Successfully connected to database`);
export const docMap: Map<string, any[]> = new Map();

await collectionDropAndInsertAll(db, "feat", FEATS);
await collectionInsertAll(db, "feat", ANCESTRY_FEATURES);
await collectionInsertAll(db, "feat", CLASS_FEATURES);
await collectionDropAndInsertAll(db, "ancestry", ANCESTRIES);
await collectionDropAndInsertAll(db, "action", ACTIONS);
await collectionDropAndInsertAll(db, "heritage", HERITAGES);
await collectionDropAndInsertAll(db, "class", CLASSES);
await collectionDropAndInsertAll(db, "background", BACKGROUNDS);
await collectionDropAndInsertAll(db, "equipment", EQUIPMENT);
await collectionDropAndInsertAll(db, "condition", CONDITIONS);
await collectionDropAndInsertAll(db, "spell", SPELLS);

await db.createIndex("user", "email", { unique: true });
await db.createIndex("user", "username", { unique: true });
await db.createIndex("feat", "slug");
await db.createIndex("action", "slug", { unique: true });
await db.createIndex("ancestry", "slug", { unique: true });
await db.createIndex("class", "slug", { unique: true });
await db.createIndex("background", "slug", { unique: true });
await db.createIndex("equipment", "slug", { unique: true });
await db.createIndex("condition", "slug", { unique: true });
await db.createIndex("spell", "slug", { unique: true });

console.log(`Documents inserted successfully`);
await mongoDBClient.close();

exit(0);

async function collectionDropAndInsertAll(
    db: mongoDB.Db,
    collection: string,
    data: Map<string, any>,
) {
    await db.collection(collection).drop();
    await db.collection(collection).insertMany(Array.from(data.values()));
    console.info("> parsed " + collection);
}

async function collectionInsertAll(
    db: mongoDB.Db,
    collection: string,
    data: Map<string, any>,
) {
    await db.collection(collection).insertMany(Array.from(data.values()));
    console.info("> added to " + collection);
}
