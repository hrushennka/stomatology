const Visit = (sequelize, DataTypes) => {
  const visitModel = sequelize.define(
    "tblvisit",
    {
      visitid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      visitdate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      visittime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      doctorid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      patientid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      visitcomment: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "tblvisit",
      timestamps: false,
    }
  );

  visitModel.associate = (models) => {
    visitModel.belongsTo(models.tbldoctor, {
      foreignKey: "doctorid",
      targetKey: "doctorid",
    });
    visitModel.belongsTo(models.tblpatient, {
      foreignKey: "patientid",
      targetKey: "patientid",
    });
    visitModel.hasMany(models.tblprovidedservice, {
      foreignKey: "visitid",
      sourceKey: "visitid",
    });
    visitModel.hasMany(models.tblpayment, {
      foreignKey: "visitid",
      sourceKey: "visitid",
      as: "payments" // Явно задаем имя ассоциации
    });
  };

  return visitModel;
};

export default Visit;
