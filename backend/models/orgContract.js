const OrgContract = (sequelize, DataTypes) => {
  const orgContractModel = sequelize.define(
    "tblorgcontract",
    {
      orgcontractid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orgcontractnumber: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      orgcontractstartdate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      orgcontractenddate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      orgcontractamount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      orgcontractstatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      organizationid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tblorganization",
          key: "organizationid",
        },
      },
    },
    {
      tableName: "tblorgcontract",
      timestamps: false,
    }
  );

  orgContractModel.associate = (models) => {
    orgContractModel.belongsTo(models.tblorganization, {
      foreignKey: "organizationid",
      targetKey: "organizationid",
    });
  };

  return orgContractModel;
};

export default OrgContract;
