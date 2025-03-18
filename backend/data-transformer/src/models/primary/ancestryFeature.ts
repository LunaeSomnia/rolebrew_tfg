import { Exclude, Expose, Transform } from "class-transformer";
import { CompendiumFile } from "../helpers/compendium";
import type { Publication } from "../secondary/publication";
import { mapToRule, type RuleType } from "../secondary/rule";
