module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define("comments", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    post_id: {
      type: DataTypes.INTEGER,
      field: 'post_id',
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id'
      }
    },
    author_id: {
      type: DataTypes.INTEGER,
      field: 'author_id',
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return Comment;
};
