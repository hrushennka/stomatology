const ProvidedService = (sequelize, DataTypes) => {
  const providedServiceModel = sequelize.define(
    "tblprovidedservice",
    {
      providedserviceid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      visitid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tblvisit",
          key: "visitid",
        },
      },
      serviceid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "tblservice",
          key: "serviceid",
        },
      },
    },
    {
      tableName: "tblprovidedservice",
      timestamps: false,
    }
  );

  providedServiceModel.associate = (models) => {
    providedServiceModel.belongsTo(models.tblvisit, {
      foreignKey: "visitid",
      targetKey: "visitid",
    });
    providedServiceModel.belongsTo(models.tblservice, {
      foreignKey: "serviceid",
      targetKey: "serviceid",
    });
  };

  return providedServiceModel;
};

export default ProvidedService;
