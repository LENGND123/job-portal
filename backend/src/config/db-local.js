import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { MongoMemoryServer } from "mongodb-memory-server";
import { dataDir } from "../paths.js";

const EMBEDDED_PORT = 27019;
let server;

function portInUse(port) {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host: "127.0.0.1" });
    socket.once("connect", () => {
      socket.end();
      resolve(true);
    });
    socket.once("error", () => resolve(false));
  });
}

function clearStaleLocks() {
  for (const name of ["mongod.lock", "WiredTiger.lock"]) {
    fs.rmSync(path.join(dataDir, name), { force: true });
  }
}

export async function embeddedMongoUri() {
  fs.mkdirSync(dataDir, { recursive: true });

  if (await portInUse(EMBEDDED_PORT)) {
    console.log(`Connected to embedded MongoDB already running on port ${EMBEDDED_PORT}.`);
    return `mongodb://127.0.0.1:${EMBEDDED_PORT}/jobportal`;
  }

  clearStaleLocks();

  try {
    server = await MongoMemoryServer.create({
      instance: {
        port: EMBEDDED_PORT,
        dbPath: dataDir,
        storageEngine: "wiredTiger",
      },
    });
    console.log(`Embedded MongoDB ready on port ${EMBEDDED_PORT}.`);
    console.log("Data is stored in backend/data/mongo.");
    return server.getUri("jobportal");
  } catch (error) {
    if (await portInUse(EMBEDDED_PORT)) {
      console.log(`Connected to embedded MongoDB already running on port ${EMBEDDED_PORT}.`);
      return `mongodb://127.0.0.1:${EMBEDDED_PORT}/jobportal`;
    }
    console.warn(`Persistent database failed (${error.message}). Starting an in-memory database.`);
    server = await MongoMemoryServer.create();
    console.log("In-memory MongoDB is ready. Data will reset when the server stops.");
    return server.getUri("jobportal");
  }
}
