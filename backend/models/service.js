const Service = (sequelize, DataTypes) => {
  const serviceModel = sequelize.define(
    "tblservice",
    {
      serviceid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      servicename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      servicedescription: {
        type: DataTypes.TEXT,
      },
      servicecost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "tblservice",
      timestamps: false,
    }
  );

  serviceModel.associate = (models) => {
    serviceModel.hasMany(models.tblprovidedservice, {
      foreignKey: "serviceid",
      sourceKey: "serviceid",
    });
  };

  return serviceModel;
};

export default Service;
