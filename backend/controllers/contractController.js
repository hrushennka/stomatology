import {
  ContractModel,
  OrgContractModel,
  PatientModel,
  OrganizationModel,
} from "../config/models.js";
import sequelize from "../config/db.js";
import { Op } from "sequelize";

const deletePrivateContract = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await ContractModel.destroy({
      where: { contractid: id },
    });
    if (result === 0) {
      return res.status(404).json({ error: "Контракт не найден" });
    }
    res.status(200).json({ message: "Контракт успешно удален" });
  } catch (error) {
    console.error("Ошибка удаления частного контракта:", error);
    res.status(500).json({ error: "Не удалось удалить частный контракт" });
  }
};
const deleteOrgContract = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await OrgContractModel.destroy({
      where: { orgcontractid: id },
    });
    if (result === 0) {
      return res.status(404).json({ error: "Контракт не найден" });
    }
    res.status(200).json({ message: "Контракт успешно удален" });
  } catch (error) {
    console.error("Ошибка удаления организационного контракта:", error);
    res
      .status(500)
      .json({ error: "Не удалось удалить организационный контракт" });
  }
};

const getPrivateContracts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  const totalCount = await ContractModel.count();

  try {
    const whereClient = {
      [Op.or]: [
        {
          "$tblpatient.patientfirstname$": {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          "$tblpatient.patientlastname$": {
            [Op.iLike]: `%${search}%`,
          },
        },
        {
          "$tblpatient.patientpatronymic$": {
            [Op.iLike]: `%${search}%`,
          },
        },
      ],
    };

    const offset = (page - 1) * limit;

    const privateContracts = await ContractModel.findAll({
      limit,
      offset,
      where: whereClient,
      include: [
        {
          model: PatientModel,
          as: "tblpatient",
          attributes: [
            "patientfirstname",
            "patientlastname",
            "patientpatronymic",
          ],
        },
      ],
      attributes: ["contractid", "contractnumber", "contractstatus"],
    });
    const formattedContracts = formatPrivateContracts(privateContracts);
    res.json({ totalCount, contracts: formattedContracts });
  } catch (error) {
    console.error("Ошибка получения частных контрактов:", error);
    res.status(500).json({ error: "Не удалось получить частные контракты" });
  }
};
const getOrgContracts = async (req, res) => {
  const limit = parseInt(req.query.limit) || 3;
  const page = parseInt(req.query.page) || 0;
  const search = req.query.search || "";
  const totalCount = await OrgContractModel.count();

  try {
    await sequelize.query("SELECT update_org_contract_status();");
    const whereOrganization = {
      [Op.or]: [
        {
          "$tblorganization.organizationname$": {
            [Op.iLike]: `%${search}%`,
          },
        },
      ],
    };

    const offset = (page - 1) * limit;

    const orgContracts = await OrgContractModel.findAll({
      limit,
      offset,
      where: whereOrganization,
      include: [
        {
          model: OrganizationModel,
          as: "tblorganization",
          attributes: ["organizationname"],
        },
      ],
      attributes: [
        "orgcontractid",
        "orgcontractnumber",
        "orgcontractstartdate",
        "orgcontractenddate",
        "orgcontractamount",
        "orgcontractstatus",
      ],
    });
    const formattedContracts = formatOrgContracts(orgContracts);
    res.json({ totalCount, contracts: formattedContracts });
  } catch (error) {
    console.error("Ошибка получения организационных контрактов:", error);
    res
      .status(500)
      .json({ error: "Не удалось получить организационные контракты" });
  }
};
const formatPrivateContracts = (privateContracts) => {
  return privateContracts.map((contract) => {
    const patient = contract.tblpatient || {};
    return {
      id: contract.contractid,
      number: contract.contractnumber,
      status: contract.contractstatus,
      clientName: `${patient.patientfirstname || ""} ${
        patient.patientlastname || ""
      } ${patient.patientpatronymic || ""}`.trim(),
      type: "private",
    };
  });
};
const formatOrgContracts = (orgContracts) => {
  return orgContracts.map((orgContract) => {
    const organization = orgContract.tblorganization || {};
    return {
      id: orgContract.orgcontractid,
      number: orgContract.orgcontractnumber,
      startDate: orgContract.orgcontractstartdate,
      endDate: orgContract.orgcontractenddate,
      amount: orgContract.orgcontractamount,
      status: orgContract.orgcontractstatus,
      clientName: organization.organizationname || "",
      type: "organization",
    };
  });
};
const updateContract = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  const { type, number, startDate, endDate, amount, status } = req.body;
  try {
    let updated;
    if (!type) {
      updated = await ContractModel.update(
        {
          contractstatus: status,
          contractnumber: number,
        },
        {
          where: { contractid: id },
        }
      );
    } else if (type) {
      console.log(id);
      updated = await OrgContractModel.update(
        {
          orgcontractamount: amount,
          orgcontractstartdate: startDate,
          orgcontractenddate: endDate,
          orgcontractstatus: status,
          orgcontractnumber: number,
        },
        {
          where: { orgcontractid: id },
        }
      );
    } else {
      return res.status(400).json({ message: "Неверный тип контракта" });
    }
    return res.status(200).json({
      message: `${
        type === false ? "Частный" : "Организационный"
      } контракт обновлён`,
    });
  } catch (error) {
    console.error("Ошибка при обновлении контракта:", error);
    return res.status(500).json({ message: "Ошибка при обновлении контракта" });
  }
};

export {
  getPrivateContracts,
  getOrgContracts,
  deletePrivateContract,
  deleteOrgContract,
  updateContract,
};
