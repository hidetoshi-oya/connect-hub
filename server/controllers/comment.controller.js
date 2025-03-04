const db = require('../models');
const Comment = db.Comment;
const User = db.User;
const Post = db.Post;

// 全コメントを取得
exports.findAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const comments = await Comment.findAndCountAll({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'department', 'avatar_url']
        },
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    return res.json({
      total: comments.count,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(comments.count / limit),
      data: comments.rows
    });
  } catch (err) {
    console.error('コメント一覧の取得に失敗:', err);
    return res.status(500).json({
      message: 'コメント一覧の取得中にエラーが発生しました'
    });
  }
};

// 特定のコメントを取得
exports.findOne = async (req, res) => {
  try {
    const commentId = req.params.id;
    
    const comment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'department', 'avatar_url']
        },
        {
          model: Post,
          as: 'post',
          attributes: ['id', 'title']
        }
      ]
    });
    
    if (!comment) {
      return res.status(404).json({
        message: 'コメントが見つかりません'
      });
    }
    
    return res.json(comment);
  } catch (err) {
    console.error('コメントの取得に失敗:', err);
    return res.status(500).json({
      message: 'コメントの取得中にエラーが発生しました'
    });
  }
};

// コメントを更新
exports.update = async (req, res) => {
  try {
    const commentId = req.params.id;
    const { content } = req.body;
    const userId = req.userId;
    
    // コメントを取得
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      return res.status(404).json({
        message: 'コメントが見つかりません'
      });
    }
    
    // 権限チェック（コメント投稿者または管理者のみ更新可能）
    const user = await User.findByPk(userId);
    
    if (comment.authorId !== userId && user.role !== 'admin') {
      return res.status(403).json({
        message: 'このコメントを更新する権限がありません'
      });
    }
    
    // コメントを更新
    await comment.update({ content });
    
    // 更新後のコメントを取得
    const updatedComment = await Comment.findByPk(commentId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'department', 'avatar_url']
        }
      ]
    });
    
    return res.json({
      message: 'コメントが更新されました',
      comment: updatedComment
    });
  } catch (err) {
    console.error('コメントの更新に失敗:', err);
    return res.status(500).json({
      message: 'コメントの更新中にエラーが発生しました'
    });
  }
};

// コメントを削除
exports.delete = async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.userId;
    
    // コメントを取得
    const comment = await Comment.findByPk(commentId);
    
    if (!comment) {
      return res.status(404).json({
        message: 'コメントが見つかりません'
      });
    }
    
    // 権限チェック（コメント投稿者または管理者のみ削除可能）
    const user = await User.findByPk(userId);
    
    if (comment.authorId !== userId && user.role !== 'admin') {
      return res.status(403).json({
        message: 'このコメントを削除する権限がありません'
      });
    }
    
    // コメントを削除
    await comment.destroy();
    
    return res.json({
      message: 'コメントが削除されました'
    });
  } catch (err) {
    console.error('コメントの削除に失敗:', err);
    return res.status(500).json({
      message: 'コメントの削除中にエラーが発生しました'
    });
  }
};
