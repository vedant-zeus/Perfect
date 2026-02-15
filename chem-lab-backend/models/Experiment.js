import mongoose from "mongoose";

/* ------------------- STEP SCHEMA ------------------- */
/*
Each action during experiment:
- add_solvent
- add_solute
- reaction_triggered
*/

const stepSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["add_solvent", "add_solute", "reaction_triggered"],
    },

    chemical: {
      type: String,
      required: true,
    },

    formula: {
      type: String,
    },

    category: {
      type: String,
      enum: ["acid", "base", "salt", "solvent"],
    },

    temperature: {
      type: Number,
      required: true,
    },

    liquidColor: {
      type: String,
      required: true,
    },

    reactionType: {
      type: String,
    },

    equation: {
      type: String,
    },

    precipitate: {
      type: Boolean,
      default: false,
    },

    gas: {
      type: Boolean,
      default: false,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

/* ------------------- MAIN EXPERIMENT SCHEMA ------------------- */
const experimentSchema = new mongoose.Schema({
  startTime: {
    type: Date,
    default: Date.now,
  },

  steps: {
    type: [stepSchema],
    default: [],
  },

  finalState: {
    temperature: {
      type: Number,
    },

    liquidColor: {
      type: String,
    },

    solutes: {
      type: [String],
      default: [],
    },

    reactionType: {
      type: String,
    },

    equation: {
      type: String,
    },

    precipitate: {
      type: Boolean,
    },

    gas: {
      type: Boolean,
    },
  },

  endTime: {
    type: Date,
  },
});

export default mongoose.model("Experiment", experimentSchema);
