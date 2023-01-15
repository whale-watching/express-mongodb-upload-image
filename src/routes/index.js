const express = require("express");
const router = express.Router();
const homeController = require("../controllers/home");
const uploadController = require("../controllers/upload");
const playerController = require("../controllers/player");

let routes = app => {
  router.get("/", homeController.getHome);

  router.post("/upload", uploadController.uploadFiles);
  router.get("/files", uploadController.getListFiles);
  router.get("/files/:name", uploadController.download);

  router.post("/player", playerController.create);
  router.get("/player/all", playerController.getAll);
  router.get("/player/:id", playerController.get);
  router.patch("/player/:id", playerController.updatePlayer);
  router.delete("/player/:id", playerController.deletePlayer);

  return app.use("/", router);
};

module.exports = routes;