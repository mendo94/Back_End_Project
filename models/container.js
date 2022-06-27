"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Container extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Container.hasMany(models.Item, {
        as: "itemName",
        foreignKey: "containerId",
      });
    }
  }
  Container.init(
    {
      box: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Container",
    }
  );
  return Container;
};
