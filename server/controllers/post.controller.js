const db = require('../models');
const Post = db.Post;
const User = db.User;
const Category = db.Category;
const Comment = db.Comment;
const Like = db.Like;
const { Op } = require('sequelize');

// 投稿一覧を取得
exports.findAll = async (req, res) => {
  try {
    const { category, search, isPinned, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // クエリ条件を構築
    let where = {};
    
    if (isPinned === 'true') {
      where.is_pinned = true;
    }
    
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // カテゴリ条件
    let includeOptions = [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email', 'department', 'role', 'avatar_url']
      },
      {
        model: Category,
        as: 'categories',
        attributes: ['id', 'name', 'description'],
        through: { attributes: [] }
      },
      {
        model: User,
        as: 'likedBy',
        attributes: ['id'],
        through: { attributes: [] }
      }
    ];
    
    if (category) {
      includeOptions = [
        ...includeOptions,
        {
          model: Category,
          as: 'categories',
          attributes: [],
          where: { name: category },
          through: { attributes: [] }
        }
      ];
    }
    
    // 投稿を取得
    const posts = await Post.findAndCountAll({
      where,
      include: includeOptions,
      order: [
        ['is_pinned', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });
    
    // コメント数を取得
    const postIds = posts.rows.map(post => post.id);
    const commentCounts = await Comment.findAll({
      attributes: [
        'postId',
        [db.sequelize.fn('COUNT', db.sequelize.col('id')), 'count']
      ],
      where: { postId: postIds },
      group: ['postId']
    });
    
    // コメント数をマッピング
    const commentCountMap = {};
    commentCounts.forEach(item => {
      commentCountMap[item.postId] = item.dataValues.count;
    });
    
    // レスポンス用にデータを整形
    const formattedPosts = posts.rows.map(post => {
      const likes = post.likedBy ? post.likedBy.map(user => ({ user_id: user.id })) : [];
      
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        isPinned: post.is_pinned,
        created_at: post.created_at,
        updated_at: post.updated_at,
        author: post.author,
        categories: post.categories,
        likes: likes,
        comments_count: commentCountMap[post.id] || 0
      };
    });
    
    return res.json({
      total: posts.count,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(posts.count / limit),
      data: formattedPosts
    });
  } catch (err) {
    console.error('投稿の取得に失敗:', err);
    return res.status(500).json({
      message: '投稿の取得中にエラーが発生しました'
    });
  }
};

// 投稿の検索
exports.search = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    if (!query) {
      return res.status(400).json({
        message: '検索キーワードを指定してください'
      });
    }
    
    const posts = await Post.findAndCountAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } }
        ]
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'department', 'role', 'avatar_url']
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'likedBy',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ],
      order: [
        ['is_pinned', 'DESC'],
        ['created_at', 'DESC']
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true
    });
    
    // レスポンス用にデータを整形
    const formattedPosts = posts.rows.map(post => {
      const likes = post.likedBy ? post.likedBy.map(user => ({ user_id: user.id })) : [];
      
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        isPinned: post.is_pinned,
        created_at: post.created_at,
        updated_at: post.updated_at,
        author: post.author,
        categories: post.categories,
        likes: likes
      };
    });
    
    return res.json({
      total: posts.count,
      page: parseInt(page),
      limit: parseInt(limit),
      total_pages: Math.ceil(posts.count / limit),
      data: formattedPosts
    });
  } catch (err) {
    console.error('投稿の検索に失敗:', err);
    return res.status(500).json({
      message: '投稿の検索中にエラーが発生しました'
    });
  }
};

// 特定の投稿を取得
exports.findOne = async (req, res) => {
  try {
    const postId = req.params.id;
    
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'department', 'role', 'avatar_url']
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'likedBy',
          attributes: ['id'],
          through: { attributes: [] }
        },
        {
          model: Comment,
          as: 'comments',
          include: [
            {
              model: User,
              as: 'author',
              attributes: ['id', 'name', 'department', 'avatar_url']
            }
          ]
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({
        message: '投稿が見つかりません'
      });
    }
    
    // 閲覧数をインクリメント
    await post.increment('views');
    
    // レスポンス用にデータを整形
    const likes = post.likedBy ? post.likedBy.map(user => ({ user_id: user.id })) : [];
    const comments = post.comments ? post.comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      author: comment.author
    })) : [];
    
    const formattedPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      isPinned: post.is_pinned,
      views: post.views + 1, // インクリメント後の値
      created_at: post.created_at,
      updated_at: post.updated_at,
      author: post.author,
      categories: post.categories,
      likes: likes,
      comments: comments
    };
    
    return res.json(formattedPost);
  } catch (err) {
    console.error('投稿の取得に失敗:', err);
    return res.status(500).json({
      message: '投稿の取得中にエラーが発生しました'
    });
  }
};

// 新規投稿の作成
exports.create = async (req, res) => {
  try {
    const { title, content, categories, isPinned } = req.body;
    
    // 認証済みユーザー
    const userId = req.userId;
    
    // 投稿を作成
    const post = await Post.create({
      title,
      content,
      is_pinned: isPinned || false,
      authorId: userId
    });
    
    // カテゴリを関連付け
    if (categories && categories.length > 0) {
      // カテゴリ名からIDを取得
      const categoryRecords = await Category.findAll({
        where: {
          name: categories,
          is_active: true
        }
      });
      
      // 投稿とカテゴリを関連付け
      await post.setCategories(categoryRecords);
    }
    
    // 作成した投稿を取得
    const createdPost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'department', 'role', 'avatar_url']
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] }
        }
      ]
    });
    
    return res.status(201).json({
      message: '投稿が作成されました',
      post: {
        id: createdPost.id,
        title: createdPost.title,
        content: createdPost.content,
        isPinned: createdPost.is_pinned,
        created_at: createdPost.created_at,
        updated_at: createdPost.updated_at,
        author: createdPost.author,
        categories: createdPost.categories,
        likes: [],
        comments: []
      }
    });
  } catch (err) {
    console.error('投稿の作成に失敗:', err);
    return res.status(500).json({
      message: '投稿の作成中にエラーが発生しました'
    });
  }
};

// 投稿の更新
exports.update = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, categories, isPinned } = req.body;
    
    // 投稿を取得
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author'
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({
        message: '投稿が見つかりません'
      });
    }
    
    // 権限チェック（投稿者または管理者のみ更新可能）
    const userId = req.userId;
    const user = await User.findByPk(userId);
    
    if (post.authorId !== userId && user.role !== 'admin') {
      return res.status(403).json({
        message: 'この投稿を更新する権限がありません'
      });
    }
    
    // 投稿を更新
    await post.update({
      title: title || post.title,
      content: content || post.content,
      is_pinned: isPinned !== undefined ? isPinned : post.is_pinned
    });
    
    // カテゴリを更新
    if (categories && categories.length > 0) {
      // カテゴリ名からIDを取得
      const categoryRecords = await Category.findAll({
        where: {
          name: categories,
          is_active: true
        }
      });
      
      // 投稿とカテゴリを関連付け
      await post.setCategories(categoryRecords);
    }
    
    // 更新後の投稿を取得
    const updatedPost = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'department', 'role', 'avatar_url']
        },
        {
          model: Category,
          as: 'categories',
          attributes: ['id', 'name', 'description'],
          through: { attributes: [] }
        },
        {
          model: User,
          as: 'likedBy',
          attributes: ['id'],
          through: { attributes: [] }
        }
      ]
    });
    
    // レスポンス用にデータを整形
    const likes = updatedPost.likedBy ? updatedPost.likedBy.map(user => ({ user_id: user.id })) : [];
    
    return res.json({
      message: '投稿が更新されました',
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        content: updatedPost.content,
        isPinned: updatedPost.is_pinned,
        created_at: updatedPost.created_at,
        updated_at: updatedPost.updated_at,
        author: updatedPost.author,
        categories: updatedPost.categories,
        likes: likes
      }
    });
  } catch (err) {
    console.error('投稿の更新に失敗:', err);
    return res.status(500).json({
      message: '投稿の更新中にエラーが発生しました'
    });
  }
};

// 投稿の削除
exports.delete = async (req, res) => {
  try {
    const postId = req.params.id;
    
    // 投稿を取得
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: User,
          as: 'author'
        }
      ]
    });
    
    if (!post) {
      return res.status(404).json({
        message: '投稿が見つかりません'
      });
    }
    
    // 権限チェック（投稿者または管理者のみ削除可能）
    const userId = req.userId;
    const user = await User.findByPk(userId);
    
    if (post.authorId !== userId && user.role !== 'admin') {
      return res.status(403).json({
        message: 'この投稿を削除する権限がありません'
      });
    }
    
    // 投稿を削除（論理削除）
    await post.destroy();
    
    return res.json({
      message: '投稿が削除されました'
    });
  } catch (err) {
    console.error('投稿の削除に失敗:', err);
    return res.status(500).json({
      message: '投稿の削除中にエラーが発生しました'
    });
  }
};

// いいねの追加/削除
exports.toggleLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userId;
    
    // 投稿を確認
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        message: '投稿が見つかりません'
      });
    }
    
    // いいねの存在を確認
    const like = await Like.findOne({
      where: {
        postId: postId,
        userId: userId
      }
    });
    
    // いいねを追加または削除
    if (like) {
      // いいねの削除
      await like.destroy();
      return res.json({
        message: 'いいねを取り消しました',
        liked: false
      });
    } else {
      // いいねの追加
      await Like.create({
        postId: postId,
        userId: userId
      });
      return res.json({
        message: 'いいねしました',
        liked: true
      });
    }
  } catch (err) {
    console.error('いいねの処理に失敗:', err);
    return res.status(500).json({
      message: 'いいねの処理中にエラーが発生しました'
    });
  }
};

// カテゴリの更新
exports.updateCategories = async (req, res) => {
  try {
    const postId = req.params.id;
    const { categories } = req.body;
    
    // 投稿を取得
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        message: '投稿が見つかりません'
      });
    }
    
    // 権限チェック（投稿者または管理者のみ更新可能）
    const userId = req.userId;
    const user = await User.findByPk(userId);
    
    if (post.authorId !== userId && user.role !== 'admin') {
      return res.status(403).json({
        message: 'この投稿のカテゴリを更新する権限がありません'
      });
    }
    
    // カテゴリを更新
    if (categories && categories.length > 0) {
      // カテゴリ名からIDを取得
      const categoryRecords = await Category.findAll({
        where: {
          name: categories,
          is_active: true
        }
      });
      
      // 投稿とカテゴリを関連付け
      await post.setCategories(categoryRecords);
      
      // 更新後のカテゴリを取得
      const updatedPost = await Post.findByPk(postId, {
        include: [
          {
            model: Category,
            as: 'categories',
            attributes: ['id', 'name', 'description'],
            through: { attributes: [] }
          }
        ]
      });
      
      return res.json({
        message: 'カテゴリが更新されました',
        categories: updatedPost.categories
      });
    } else {
      // カテゴリをすべて削除
      await post.setCategories([]);
      
      return res.json({
        message: 'カテゴリが削除されました',
        categories: []
      });
    }
  } catch (err) {
    console.error('カテゴリの更新に失敗:', err);
    return res.status(500).json({
      message: 'カテゴリの更新中にエラーが発生しました'
    });
  }
};

// コメント一覧の取得
exports.getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    
    // 投稿を確認
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        message: '投稿が見つかりません'
      });
    }
    
    // コメントを取得
    const comments = await Comment.findAll({
      where: { postId: postId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'department', 'avatar_url']
        }
      ],
      order: [['created_at', 'ASC']]
    });
    
    // レスポンス用にデータを整形
    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      author: comment.author
    }));
    
    return res.json(formattedComments);
  } catch (err) {
    console.error('コメントの取得に失敗:', err);
    return res.status(500).json({
      message: 'コメントの取得中にエラーが発生しました'
    });
  }
};

// コメントの追加
exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.userId;
    
    // 投稿を確認
    const post = await Post.findByPk(postId);
    
    if (!post) {
      return res.status(404).json({
        message: '投稿が見つかりません'
      });
    }
    
    // コメントを作成
    const comment = await Comment.create({
      content,
      postId,
      authorId: userId
    });
    
    // 作成したコメントを取得
    const createdComment = await Comment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'department', 'avatar_url']
        }
      ]
    });
    
    return res.status(201).json({
      message: 'コメントが追加されました',
      comment: {
        id: createdComment.id,
        content: createdComment.content,
        created_at: createdComment.created_at,
        author: createdComment.author
      }
    });
  } catch (err) {
    console.error('コメントの追加に失敗:', err);
    return res.status(500).json({
      message: 'コメントの追加中にエラーが発生しました'
    });
  }
};

// コメントの削除
exports.deleteComment = async (req, res) => {
  try {
    const { id: postId, commentId } = req.params;
    const userId = req.userId;
    
    // コメントを取得
    const comment = await Comment.findOne({
      where: { id: commentId, postId: postId },
      include: [
        {
          model: User,
          as: 'author'
        }
      ]
    });
    
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
