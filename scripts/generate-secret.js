/**
 * This script generates a secure random string that can be used as a NEXTAUTH_SECRET
 * Run with: node scripts/generate-secret.js
 */

const crypto = require("crypto")

// Generate a random string of 32 bytes and convert to base64
const secret = crypto.randomBytes(32).toString("base64")

console.log("Generated NEXTAUTH_SECRET:")
console.log(secret)
console.log("\nAdd this to your .env.local file:")
console.log(`NEXTAUTH_SECRET="${secret}"`)
