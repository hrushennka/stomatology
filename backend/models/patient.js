const Patient = (sequelize, DataTypes) => {
  const patientModel = sequelize.define(
    "tblpatient",
    {
      patientid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      patientfirstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      patientlastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      patientpatronymic: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tblpatient",
      timestamps: false,
    }
  );

  patientModel.associate = (models) => {
    patientModel.hasMany(models.tblcontract, {
      foreignKey: "patientid",
      sourceKey: "patientid",
    });
  };

  return patientModel;
};

export default Patient;
