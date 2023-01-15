const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const playerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    lastScoredTime: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
playerSchema.plugin(toJSON);
playerSchema.plugin(paginate);

/**
 * @typedef Player
 */
const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
