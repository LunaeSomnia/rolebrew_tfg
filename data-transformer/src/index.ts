import { exit } from "node:process";
import "reflect-metadata";
import "es6-shim";
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import {
    ACTIONS,
    ANCESTRIES,
    BACKGROUNDS,
    CLASSES,
    FEATS,
} from "./models/index.ts";

const dbConnectionString = process.env.MONGO_URL ?? "";
console.info("Connecting to", dbConnectionString);

export const mongoDBClient: mongoDB.MongoClient = new mongoDB.MongoClient(
    dbConnectionString,
);
await mongoDBClient.connect();
export const db: mongoDB.Db = mongoDBClient.db("rolebrew");
await db.dropDatabase();
console.info(`Successfully connected to database`);
export const docMap: Map<string, any[]> = new Map();

db.collection("feat").insertMany(Array.from(FEATS.values()));
console.info("> parsed feats");

db.collection("action").insertMany(Array.from(ACTIONS.values()));
console.info("> parsed actions");

db.collection("ancestry").insertMany(Array.from(ANCESTRIES.values()));
console.info("> parsed ancestries");

db.collection("class").insertMany(Array.from(CLASSES.values()));
console.info("> parsed classes");

db.collection("background").insertMany(Array.from(BACKGROUNDS.values()));
console.info("> parsed backgrounds");

await db.createIndex("feat", "slug", { unique: true });
await db.createIndex("action", "slug", { unique: true });
await db.createIndex("ancestry", "slug", { unique: true });
await db.createIndex("class", "slug", { unique: true });
await db.createIndex("background", "slug", { unique: true });

console.log(`Documents inserted successfully`);
await mongoDBClient.close();

exit(0);
