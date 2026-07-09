import { resetDatabase, db } from "../src/lib/db";

resetDatabase(true);
const data = db();
console.log("Demo seed loaded:");
console.log(`- users: ${data.users.length}`);
console.log(`- workspaces: ${data.workspaces.length}`);
console.log(`- proposals: ${data.proposals.length}`);
console.log(`- templates: ${data.templates.length}`);
console.log("Login: demo@proposalroom.app / demo1234");
