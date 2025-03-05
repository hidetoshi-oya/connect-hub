module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define("likes", {
    post_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'post_id',
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    tableName: 'likes'
  });

  return Like;
};
