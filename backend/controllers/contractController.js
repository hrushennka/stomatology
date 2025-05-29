import {
  ContractModel,
  OrgContractModel,
  PatientModel,
  OrganizationModel,
} from "../config/models.js";

const getContracts = async (req, res) => {
  try {
    const privateContracts = await ContractModel.findAll({
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
      attributes: ["contractid", "contractnumber"],
    });

    const orgContracts = await OrgContractModel.findAll({
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
      ],
    });

    const contracts = [
      ...formatPrivateContracts(privateContracts),
      ...formatOrgContracts(orgContracts),
    ];

    res.json(contracts);
  } catch (error) {
    console.error("Ошибка получения договоров:", error);
    res.status(500).json({ error: "Не удалось получить договоры" });
  }
};
const formatPrivateContracts = (privateContracts) => {
  return privateContracts.map((contract) => {
    const patient = contract.tblpatient || {};
    return {
      id: contract.contractid,
      number: contract.contractnumber,
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
      organizationName: organization.organizationname || "",
      type: "organization",
    };
  });
};

export { getContracts };
