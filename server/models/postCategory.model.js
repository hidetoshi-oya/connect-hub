module.exports = (sequelize, DataTypes) => {
  const PostCategory = sequelize.define("post_categories", {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'post_id',
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    category_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'category_id',
      references: {
        model: 'categories',
        key: 'id'
      }
    }
  }, {
    timestamps: false,
    tableName: 'post_categories'
  });

  return PostCategory;
};
