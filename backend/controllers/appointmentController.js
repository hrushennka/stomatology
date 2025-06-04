
import {
  VisitModel as tblvisit,
  PatientModel as tblpatient,
  DoctorModel as tbldoctor
} from "../config/models.js";
import sequelize from "../config/db.js";

/**
 * GET /appointment/list
 */
const getVisitList = async (req, res) => {
  try {
    const visits = await tblvisit.findAll({
      include: [
        { model: tblpatient, required: true },
        { model: tbldoctor, required: true }
      ]
    });

    const data = visits.map(visit => {
      const patient = visit.tblpatient;
      const doctor  = visit.tbldoctor;

      if (!patient || !doctor) return null;

      const PatientName = `${patient.patientlastname} ${patient.patientfirstname} ${patient.patientpatronymic || ""}`.trim();
      const DoctorName  = `${doctor.doctorlastname} ${doctor.doctorfirstname} ${doctor.doctorpatronymic || ""}`.trim();

      return {
        VisitID:   visit.visitid,
        PatientName,
        DoctorName,
        VisitDate: visit.visitdate,
        VisitTime: visit.visittime
      };
    });

    res.json(data.filter(item => item !== null));
  } catch (err) {
    console.error("Error in getVisitList:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * POST /appointment/visits
 */
const addVisit = async (req, res) => {
  const { patientId, doctorId, visitDate, visitTime } = req.body;

  if (!patientId || !doctorId || !visitDate || !visitTime) {
    return res.status(400).json({ error: "Все поля обязательны для заполнения" });
  }

  try {
    const patient = await tblpatient.findByPk(patientId);
    const doctor  = await tbldoctor.findByPk(doctorId);

    if (!patient) return res.status(404).json({ error: "Пациент не найден" });
    if (!doctor)  return res.status(404).json({ error: "Врач не найден" });

    const conflict = await tblvisit.findOne({
      where: {
        doctorid:  doctorId,
        visitdate: visitDate,
        visittime: visitTime
      }
    });

    if (conflict) {
      return res.status(409).json({
        error: "Врач уже занят в это время",
        existingVisit: {
          visitId:   conflict.visitid,
          patientId: conflict.patientid
        }
      });
    }

    const newVisit = await tblvisit.create({
      patientid:  patientId,
      doctorid:   doctorId,
      visitdate:  visitDate,
      visittime:  visitTime
    });

    res.status(201).json({
      message: "Визит успешно создан",
      visit: {
        visitId:   newVisit.visitid,
        patientId: newVisit.patientid,
        doctorId:  newVisit.doctorid,
        visitDate: newVisit.visitdate,
        visitTime: newVisit.visittime
      }
    });
  } catch (err) {
    console.error("Ошибка при создании визита:", err);
    res.status(500).json({ error: "Не удалось создать визит" });
  }
};

/**
 * DELETE /appointment/visits/:id
 */
const deleteVisit = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await tblvisit.destroy({
      where: { visitid: id }
    });
    if (!deleted) {
      return res.status(404).json({ error: "Визит не найден" });
    }
    res.json({ message: "Визит успешно удалён" });
  } catch (err) {
    console.error("Ошибка удаления визита:", err);
    res.status(500).json({ error: "Не удалось удалить визит" });
  }
};

/**
 * GET /appointment/doctors
 */
const getDoctors = async (req, res) => {
  try {
    console.log("=== [getDoctors] Начинаем загрузку врачей ===");

    if (!tbldoctor) {
      console.error("Модель tbldoctor не определена!");
      return res.status(500).json({ message: "Модель врачей не найдена." });
    }

    console.log("tbldoctor keys:", Object.keys(tbldoctor));

    if (typeof tbldoctor.findAll !== "function") {
      console.error("Метод findAll отсутствует у модели tbldoctor!");
      return res.status(500).json({ message: "Модель врачей не поддерживает findAll." });
    }

    const doctors = await tbldoctor.findAll({
      attributes: ["doctorid", "doctorlastname", "doctorfirstname", "doctorpatronymic"]
    });

    console.log(`Найдено врачей: ${doctors.length}`);
    console.log("Пример врача:", doctors[0]?.toJSON?.());

    const formattedDoctors = doctors.map((doctor) => ({
      doctorid: doctor.doctorid,
      DoctorFullName: `${doctor.doctorlastname} ${doctor.doctorfirstname} ${doctor.doctorpatronymic || ""}`.trim(),
    }));

    res.json(formattedDoctors);
  } catch (err) {
    console.error("🔥 Ошибка при загрузке врачей:");
    console.error(err.stack || err.message || err);
    res.status(500).json({
      message: "Ошибка сервера при получении списка врачей.",
      error: err.message,
      stack: err.stack,
    });
  }
};

/**
 * GET /appointment/patients
 */
const getPatients = async (req, res) => {
  try {
    const patients = await tblpatient.findAll({
      attributes: [
        "patientid",
        [
          sequelize.fn(
            "CONCAT",
            sequelize.col("patientlastname"), " ",
            sequelize.col("patientfirstname"), " ",
            sequelize.fn("COALESCE", sequelize.col("patientpatronymic"), "")
          ),
          "PatientFullName"
        ]
      ]
    });
    res.json(patients);
  } catch (err) {
    console.error("Ошибка при загрузке пациентов:", err);
    res.status(500).json({ message: "Ошибка сервера." });
  }
};

export default {
  getVisitList,
  addVisit,
  deleteVisit,
  getDoctors,
  getPatients
};