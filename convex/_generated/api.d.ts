/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as birthdays from "../birthdays.js";
import type * as issues from "../issues.js";
import type * as locks from "../locks.js";
import type * as media from "../media.js";
import type * as sections from "../sections.js";
import type * as users from "../users.js";
import type * as validators_sections from "../validators/sections.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  birthdays: typeof birthdays;
  issues: typeof issues;
  locks: typeof locks;
  media: typeof media;
  sections: typeof sections;
  users: typeof users;
  "validators/sections": typeof validators_sections;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
