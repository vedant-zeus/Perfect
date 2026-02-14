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
    const { action, chemical, temperature, liquidColor } = req.body;

    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    experiment.steps.push({
      action,
      chemical,
      temperature,
      liquidColor,
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
    const { temperature, liquidColor, solutes } = req.body;

    const experiment = await Experiment.findById(req.params.id);

    if (!experiment) {
      return res.status(404).json({ message: "Experiment not found" });
    }

    experiment.finalState = {
      temperature,
      liquidColor,
      solutes,
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

    doc.fontSize(20).text("Virtual Chemistry Lab Report", {
      align: "center",
    });

    doc.moveDown();
    doc.fontSize(12).text(`Start Time: ${experiment.startTime}`);
    doc.text(`End Time: ${experiment.endTime}`);

    doc.moveDown();
    doc.text("Steps Performed:");

    experiment.steps.forEach((step, index) => {
      doc.text(
        `${index + 1}. ${step.action} - ${step.chemical} | Temp: ${
          step.temperature
        }°C`
      );
    });

    doc.moveDown();
    doc.text("Final State:");
    doc.text(`Temperature: ${experiment.finalState.temperature}°C`);
    doc.text(`Color: ${experiment.finalState.liquidColor}`);
    doc.text(
      `Solutes: ${experiment.finalState.solutes?.join(", ")}`
    );

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
