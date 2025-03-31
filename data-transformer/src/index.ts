import { exit } from "node:process";
import "reflect-metadata";
import "es6-shim";
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import { ACTIONS, ANCESTRIES, FEATS } from "./models/index.ts";

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

await db.createIndex("feat", "slug");
await db.createIndex("action", "slug");
await db.createIndex("ancestry", "slug");

console.log(`Documents inserted successfully`);
await mongoDBClient.close();

exit(0);
