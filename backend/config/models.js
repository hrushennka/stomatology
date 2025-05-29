import { Sequelize } from "sequelize";
import sequelize from "./db.js";

import Organization from "../models/organization.js";
import OrgContract from "../models/orgContract.js";
import Patient from "../models/patient.js";
import Contract from "../models/contract.js";

// Регистрация моделей
const OrganizationModel = Organization(sequelize, Sequelize.DataTypes);
const OrgContractModel = OrgContract(sequelize, Sequelize.DataTypes);
const PatientModel = Patient(sequelize, Sequelize.DataTypes);
const ContractModel = Contract(sequelize, Sequelize.DataTypes);

const models = {
  tblorganization: OrganizationModel,
  tblorgcontract: OrgContractModel,
  tblpatient: PatientModel,
  tblcontract: ContractModel,
};

OrganizationModel.associate(models);
OrgContractModel.associate(models);
PatientModel.associate(models);
ContractModel.associate(models);

export { OrganizationModel, OrgContractModel, PatientModel, ContractModel };
