const Doctor = (sequelize, DataTypes) => {
  const doctorModel = sequelize.define(
    "tbldoctor",
    {
      doctorid: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      doctorfirstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      doctorlastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      doctorpatronymic: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "tbldoctor",
      timestamps: false,
    }
  );

  doctorModel.associate = (models) => {
    doctorModel.hasMany(models.tblvisit, {
      foreignKey: "doctorid",
      sourceKey: "doctorid",
    });
  };

  return doctorModel;
};

export default Doctor;
