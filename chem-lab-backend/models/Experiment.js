import mongoose from "mongoose";

/* ------------------- STEP SCHEMA ------------------- */
/*
Each action performed during experiment:
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

    temperature: {
      type: Number,
      required: true,
    },

    liquidColor: {
      type: String,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // prevent extra _id for steps
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
  },

  endTime: {
    type: Date,
  },
});

export default mongoose.model("Experiment", experimentSchema);
