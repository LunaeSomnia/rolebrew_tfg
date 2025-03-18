import { Command } from "commander";
import { readdir } from "node:fs/promises";
import { exit } from "node:process";
import { plainToInstance } from "class-transformer";
import "reflect-metadata";
import "es6-shim";
import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";
import "./src/pf2e/ancestry.ts";
import { PF2ETOOLS_ANCESTRIES } from "./src/pf2e/pf2etools.ts";
import { FVTT_ANCESTRIES } from "./src/fvtt/fvtt.ts";
import { Ancestry } from "./src/models/primary/ancestry.ts";

console.log(`Init`);
export const mongoDBClient: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.DB_CONN_STRING ?? "",
);
await mongoDBClient.connect();
export const db: mongoDB.Db = mongoDBClient.db(process.env.DB_NAME);
await db.dropDatabase();
console.log(`Successfully connected to database: ${db.databaseName}`);
export const docMap: Map<string, any[]> = new Map();

// program
//     .name("rolebrew-transformer")
//     .description("JSON Transformator used for Rolebrew's database")
//     .version("0.1.0");

// program
//     .command("parse")
//     .argument("<path>", "path to /packs/ folder")
//     .action(async (str, options) => {
//         await transformPacks(str);
//     });

// program.parse();

console.log(Array.from(FVTT_ANCESTRIES.keys()).sort());

// ancestries
for (const [key, pf2etoolsAncestry] of PF2ETOOLS_ANCESTRIES) {
    const fvttAncestry = FVTT_ANCESTRIES.get(key);
    if (!fvttAncestry) {
        throw new Error(
            `assert failed: fvtt ancestry equivalent not found for ${key}`,
        );
    }
    const mergedObject = Object.assign({}, pf2etoolsAncestry, fvttAncestry);
    db.collection("ancestry").insertOne(
        plainToInstance(Ancestry, mergedObject),
    );
    console.info("> parsed ancestry: " + key);
}

// for (const requiredFile of REQUIRED_FILES) {
//     if (inputDir.find((v) => v === requiredFile + ".json") === undefined) {
//         console.error(
//             "File '" +
//                 requiredFile +
//                 ".json' doesn't exist in '" +
//                 inputPath +
//                 "'",
//         );
//         exit(1);
//     }

//     const jsonData: any[] = await Bun.file(
//         inputPath + "/" + requiredFile + ".json",
//     ).json();
//     let dataArray = [];

//     switch (requiredFile) {
//         case "journals":
//             dataArray = [];
//             for (const individualJsonData of jsonData) {
//                 const transformedData = plainToInstance(
//                     Journal,
//                     individualJsonData,
//                 );
//                 for (const page of transformedData.pages) {
//                     console.log(`> parsed journal '${page.id}'`);
//                     dataArray.push(page);
//                 }
//             }
//             await db.collection(requiredFile).insertMany(dataArray);
//             break;
//         case "ancestryfeatures":
//             dataArray = [];
//             for (const individualJsonData of jsonData) {
//                 const transformedData = plainToInstance(
//                     AncestryFeature,
//                     individualJsonData,
//                 );

//                 console.log(
//                     `> parsed ancestry feature '${transformedData.id}'`,
//                 );
//                 dataArray.push(transformedData);
//             }
//             await db.collection(requiredFile).insertMany(dataArray);
//             break;
//         case "heritages":
//             dataArray = [];
//             for (const individualJsonData of jsonData) {
//                 const transformedData = plainToInstance(
//                     AncestryHeritage,
//                     individualJsonData,
//                 );

//                 console.log(`> parsed heritage '${transformedData.id}'`);
//                 dataArray.push(transformedData);
//             }
//             await db.collection(requiredFile).insertMany(dataArray);
//             break;
//         case "ancestries":
//             dataArray = [];
//             for (const individualJsonData of jsonData) {
//                 const transformedData = plainToInstance(
//                     Ancestry,
//                     individualJsonData,
//                 );

//                 console.log(`> parsed ancestry '${transformedData.id}'`);
//                 dataArray.push(transformedData);
//             }
//             await db.collection(requiredFile).insertMany(dataArray);
//             break;
//     }

//     docMap.set(requiredFile, dataArray);
// }

// manually added indexes
await db.createIndex("ancestries", "slug");

console.log(`Documents inserted successfully`);
await mongoDBClient.close();

exit(0);

// console.log(inputDir)
