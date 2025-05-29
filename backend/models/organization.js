const Organization = (sequelize, DataTypes) => {
  const organizationModel = sequelize.define(
    "tblorganization",
    {
      organizationid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      organizationname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      organizationcontactinfo: {
        type: DataTypes.STRING(255),
      },
    },
    {
      tableName: "tblorganization",
      timestamps: false,
    }
  );

  organizationModel.associate = (models) => {
    organizationModel.hasMany(models.tblorgcontract, {
      foreignKey: "organizationid",
      sourceKey: "organizationid",
    });
  };

  return organizationModel;
};

export default Organization;
