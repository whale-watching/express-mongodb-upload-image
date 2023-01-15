const upload = require("../middleware/upload");
const dbConfig = require("../config/db");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
const { Player } = require('../models');

const ApiError = require('../utils/ApiError');
// const catchAsync = require('../utils/catchAsync');

const url = dbConfig.url;

const baseUrl = "http://localhost:8000/files/";

const mongoClient = new MongoClient(url);

const create = async (req, res) => {
  try {
    const { name, code } = req.body;
    const playerExist = await Player.findOne({
      name,
    });

    if (playerExist === null) {
      await upload(req, res);

      if (req.files.length <= 0) {
        return res
          .status(400)
          .send({ message: "You must select at least 1 file." });
      }

      const imageName = req.files[0].filename;
      const player = await Player.create({
        name,
        code,
        lastScoredTime: Date.now(),
        image: imageName,
      });
      res.status(200).send(player);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'The same player is already exit!');
    }

  } catch (error) {
    console.log(error);

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).send({
        message: "Too many files to upload.",
      });
    }
    return res.status(500).send({
      message: `Error when trying upload many files: ${error}`,
    });
  }
};

const getAll = async (_, res) => {
  try {
    const allPlayers = await Player.find();

    return res.status(200).send(allPlayers);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const get = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await Player.findById(id);

    return res.status(200).send(player);
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    await Player.findByIdAndRemove(id);

    return res.status(200).send({message: "Successfully deleted!"});
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { code } = req.body;
    await Player.findByIdAndUpdate(id, {
      code,
    });

    return res.status(200).send({message: "Successfully deleted!"});
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  get,
  deletePlayer,
  updatePlayer,
};
