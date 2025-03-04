module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'moderator', 'contributor', 'viewer'),
      defaultValue: 'contributor'
    },
    avatar_url: {
      type: DataTypes.STRING,
      defaultValue: '/avatars/default.jpg'
    },
    bio: {
      type: DataTypes.TEXT
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};
