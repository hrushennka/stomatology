import { Sequelize } from "sequelize";
import sequelize from "./db.js";

import Organization from "../models/organization.js";
import OrgContract from "../models/orgContract.js";
import Patient from "../models/patient.js";
import Contract from "../models/contract.js";
import Doctor from "../models/doctor.js";
import Employee from "../models/employee.js";
import Payment from "../models/payment.js";
import ProvidedService from "../models/providedService.js";
import Service from "../models/service.js";
import Visit from "../models/visit.js";

// Регистрация моделей
const OrganizationModel = Organization(sequelize, Sequelize.DataTypes);
const OrgContractModel = OrgContract(sequelize, Sequelize.DataTypes);
const PatientModel = Patient(sequelize, Sequelize.DataTypes);
const ContractModel = Contract(sequelize, Sequelize.DataTypes);
const DoctorModel = Doctor(sequelize, Sequelize.DataTypes);
const EmployeeModel = Employee(sequelize, Sequelize.DataTypes);
const PaymentModel = Payment(sequelize, Sequelize.DataTypes);
const ProvidedServiceModel = ProvidedService(sequelize, Sequelize.DataTypes);
const ServiceModel = Service(sequelize, Sequelize.DataTypes);
const VisitModel = Visit(sequelize, Sequelize.DataTypes);

const models = {
  tblorganization: OrganizationModel,
  tblorgcontract: OrgContractModel,
  tblpatient: PatientModel,
  tblcontract: ContractModel,
  tbldoctor: DoctorModel,
  tblemployee: EmployeeModel,
  tblpayment: PaymentModel,
  tblprovidedservice: ProvidedServiceModel,
  tblservice: ServiceModel,
  tblvisit: VisitModel,

};

OrganizationModel.associate(models);
OrgContractModel.associate(models);
PatientModel.associate(models);
ContractModel.associate(models);
DoctorModel.associate(models);
EmployeeModel.associate(models);
PaymentModel.associate(models);
ProvidedServiceModel.associate(models);
ServiceModel.associate(models);
VisitModel.associate(models);

export { OrganizationModel, OrgContractModel, PatientModel, ContractModel, DoctorModel, EmployeeModel, PaymentModel, ProvidedServiceModel, ServiceModel, VisitModel };
