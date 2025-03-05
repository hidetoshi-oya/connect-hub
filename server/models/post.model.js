module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define("posts", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    is_pinned: {
      type: DataTypes.BOOLEAN,
      field: 'is_pinned',
      defaultValue: false
    },
    authorId: {
      type: DataTypes.INTEGER,
      field: 'author_id',
      allowNull: false
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // 論理削除を有効化
    deletedAt: 'deleted_at'
  });

  return Post;
};
