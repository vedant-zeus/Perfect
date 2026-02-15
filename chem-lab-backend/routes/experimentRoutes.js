import express from "express";
import Experiment from "../models/Experiment.js";
import PDFDocument from "pdfkit";

const router = express.Router();

/* -------------------- START EXPERIMENT -------------------- */
router.post("/start", async (req, res) => {
  try {
    const experiment = new Experiment();
    await experiment.save();
    res.status(201).json(experiment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- ADD STEP -------------------- */
router.post("/step/:id", async (req, res) => {
  try {
    const {
      action,
      chemical,
      formula,
      category,
      temperature,
      liquidColor,
      reactionType,
      equation,
      precipitate,
      gas,
    } = req.body;

    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    experiment.steps.push({
      action,
      chemical,
      formula,
      category,
      temperature,
      liquidColor,
      reactionType,
      equation,
      precipitate,
      gas,
    });

    await experiment.save();

    res.json(experiment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- FINISH EXPERIMENT -------------------- */
router.post("/finish/:id", async (req, res) => {
  try {
    const {
      temperature,
      liquidColor,
      solutes,
      reactionType,
      equation,
      precipitate,
      gas,
    } = req.body;

    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    experiment.finalState = {
      temperature,
      liquidColor,
      solutes,
      reactionType,
      equation,
      precipitate,
      gas,
    };

    experiment.endTime = new Date();

    await experiment.save();

    res.json({ message: "Experiment finished", experiment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- GENERATE PDF REPORT -------------------- */
router.get("/report/:id", async (req, res) => {
  try {
    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=lab-report-${experiment._id}.pdf`
    );

    doc.pipe(res);

    /* ---------- TITLE ---------- */
    doc.fontSize(20).text("Virtual Chemistry Lab Report", {
      align: "center",
    });

    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Start Time: ${experiment.startTime}`);
    doc.text(`End Time: ${experiment.endTime}`);

    doc.moveDown();
    doc.text("--------------------------------------------------");

    /* ---------- STEPS ---------- */
    doc.moveDown();
    doc.fontSize(14).text("Steps Performed:");

    experiment.steps.forEach((step, index) => {
      doc.moveDown(0.5);
      doc.fontSize(12).text(
        `${index + 1}. ${step.action.toUpperCase()}`
      );
      doc.text(`   Chemical: ${step.chemical}`);
      doc.text(`   Formula: ${step.formula || "-"}`);
      doc.text(`   Category: ${step.category || "-"}`);
      doc.text(`   Temperature: ${step.temperature}°C`);

      if (step.reactionType) {
        doc.text(`   Reaction Type: ${step.reactionType}`);
      }

      if (step.equation) {
        doc.text(`   Equation: ${step.equation}`);
      }

      if (step.precipitate) {
        doc.text("   Observation: Precipitate formed");
      }

      if (step.gas) {
        doc.text("   Observation: Gas evolved");
      }
    });

    /* ---------- FINAL STATE ---------- */
    doc.moveDown();
    doc.text("--------------------------------------------------");

    doc.moveDown();
    doc.fontSize(14).text("Final State:");

    doc.fontSize(12);
    doc.text(`Final Temperature: ${experiment.finalState.temperature}°C`);
    doc.text(`Final Color: ${experiment.finalState.liquidColor}`);
    doc.text(
      `Solutes Present: ${experiment.finalState.solutes?.join(", ")}`
    );

    if (experiment.finalState.reactionType) {
      doc.text(`Final Reaction Type: ${experiment.finalState.reactionType}`);
    }

    if (experiment.finalState.equation) {
      doc.text(`Balanced Equation: ${experiment.finalState.equation}`);
    }

    if (experiment.finalState.precipitate) {
      doc.text("Final Observation: Precipitate formed");
    }

    if (experiment.finalState.gas) {
      doc.text("Final Observation: Gas evolved");
    }

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
