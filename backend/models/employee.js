const Employee = (sequelize, DataTypes) => {
  const employeeModel = sequelize.define(
    "tblemployee",
    {
      patientid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "tblpatient",
          key: "patientid",
        },
      },
      organizationid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: "tblorganization",
          key: "organizationid",
        },
      },
    },
    {
      tableName: "tblemployee",
      timestamps: false,
    }
  );

  employeeModel.associate = (models) => {
    employeeModel.belongsTo(models.tblpatient, {
      foreignKey: "patientid",
      targetKey: "patientid",
    });
    employeeModel.belongsTo(models.tblorganization, {
      foreignKey: "organizationid",
      targetKey: "organizationid",
    });
  };

  return employeeModel;
};

export default Employee;
