const Payment = (sequelize, DataTypes) => {
  const paymentModel = sequelize.define(
    "tblpayment",
    {
      paymentid: {
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
      paymenttotalamount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      tableName: "tblpayment",
      timestamps: false,
    }
  );

  paymentModel.associate = (models) => {
    paymentModel.belongsTo(models.tblvisit, {
      foreignKey: "visitid",
      targetKey: "visitid",
    });
  };

  return paymentModel;
};

export default Payment;
