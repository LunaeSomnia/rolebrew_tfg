import { exit } from "node:process";
import "reflect-metadata";
import "es6-shim";
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { ACTIONS, ANCESTRIES, FEATS } from "./src/models/index.ts";

console.log(`Init`);
export const mongoDBClient: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING ?? "",
);
await mongoDBClient.connect();
export const db: mongoDB.Db = mongoDBClient.db(process.env.DB_NAME);
await db.dropDatabase();
console.log(`Successfully connected to database: ${db.databaseName}`);
export const docMap: Map<string, any[]> = new Map();

db.collection("feat").insertMany(Array.from(FEATS.values()));
console.info("> parsed feats");

db.collection("action").insertMany(Array.from(ACTIONS.values()));
console.info("> parsed actions");

db.collection("ancestry").insertMany(Array.from(ANCESTRIES.values()));
console.info("> parsed ancestries");

await db.createIndex("feat", "slug");
await db.createIndex("action", "slug");
await db.createIndex("ancestry", "slug");

console.log(`Documents inserted successfully`);
await mongoDBClient.close();

exit(0);
