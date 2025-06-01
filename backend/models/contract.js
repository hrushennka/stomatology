const Contract = (sequelize, DataTypes) => {
  const contractModel = sequelize.define(
    "tblcontract",
    {
      contractid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      contractnumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      contractstatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      patientid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tblpatient",
          key: "patientid",
        },
      },
    },
    {
      tableName: "tblcontract",
      timestamps: false,
    }
  );

  contractModel.associate = (models) => {
    contractModel.belongsTo(models.tblpatient, {
      foreignKey: "patientid",
      targetKey: "patientid",
    });
  };

  return contractModel;
};

export default Contract;
