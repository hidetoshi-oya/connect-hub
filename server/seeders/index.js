const db = require('../models');
const bcrypt = require('bcrypt');
const User = db.User;
const Category = db.Category;
const Post = db.Post;
const Comment = db.Comment;
const Like = db.Like;

module.exports = async () => {
  try {
    console.log('初期データの作成を開始します...');

    // 既存データをチェック（ユーザー）
    const existingAdmin = await User.findOne({ where: { email: 'admin@example.com' } });
    const existingModerator = await User.findOne({ where: { email: 'moderator@example.com' } });
    const existingUser = await User.findOne({ where: { email: 'yamada@example.com' } });

    // ユーザーデータの作成
    let admin, moderator, user;

    if (!existingAdmin) {
      const adminPassword = await bcrypt.hash('password', 10);
      admin = await User.create({
        name: '管理者 太郎',
        email: 'admin@example.com',
        password: adminPassword,
        department: 'IT部',
        role: 'admin',
        avatar_url: '/avatars/admin.jpg',
        is_active: true,
        bio: 'IT部門で社内のシステム管理を担当しています。'
      });
      console.log('- 管理者ユーザーを作成しました');
    } else {
      admin = existingAdmin;
      console.log('- 管理者ユーザーは既に存在します');
    }
    
    if (!existingModerator) {
      const moderatorPassword = await bcrypt.hash('password', 10);
      moderator = await User.create({
        name: 'モデレータ 花子',
        email: 'moderator@example.com',
        password: moderatorPassword,
        department: '人事部',
        role: 'moderator',
        avatar_url: '/avatars/moderator.jpg',
        is_active: true,
        bio: '人事部で社内イベントの企画を担当しています。'
      });
      console.log('- モデレータユーザーを作成しました');
    } else {
      moderator = existingModerator;
      console.log('- モデレータユーザーは既に存在します');
    }
    
    if (!existingUser) {
      const userPassword = await bcrypt.hash('password', 10);
      user = await User.create({
        name: '山田 太郎',
        email: 'yamada@example.com',
        password: userPassword,
        department: '開発部',
        role: 'contributor',
        avatar_url: '/avatars/yamada.jpg',
        is_active: true,
        bio: '開発部でフロントエンド開発を担当しています。'
      });
      console.log('- 一般ユーザーを作成しました');
    } else {
      user = existingUser;
      console.log('- 一般ユーザーは既に存在します');
    }
    
    // 既存データをチェック（カテゴリ）
    const existingNoticeCategory = await Category.findOne({ where: { name: 'お知らせ' } });
    if (existingNoticeCategory) {
      console.log('- カテゴリデータは既に存在します');
    } else {
      // カテゴリの作成
      const categories = await Category.bulkCreate([
        { name: 'お知らせ', description: '会社からの公式なお知らせや通知を掲載します', is_active: true },
        { name: 'プロジェクト', description: '社内の各種プロジェクトに関する情報を共有します', is_active: true },
        { name: '社員インタビュー', description: '社員の仕事や趣味などを紹介するインタビュー記事です', is_active: true },
        { name: 'イベント', description: '社内イベントや外部イベントの情報を掲載します', is_active: true },
        { name: '社内システム', description: '業務システムや社内ツールに関する情報です', is_active: true },
        { name: '募集', description: '社内での募集やプロジェクトメンバー募集などの情報です', is_active: true },
        { name: 'マーケティング部', description: 'マーケティング部からの情報発信です', is_active: true },
        { name: '営業部', description: '営業部からの情報発信です', is_active: true },
        { name: '開発部', description: '開発部からの情報発信です', is_active: true },
        { name: '人事部', description: '人事部からの情報発信です', is_active: true },
        { name: '広報部', description: '広報部からの情報発信です', is_active: true },
        { name: 'IT部', description: 'IT部からの情報発信です', is_active: true },
      ]);
      console.log('- カテゴリデータを作成しました');
    
      // 既存データをチェック（投稿）
      const existingPost = await Post.findOne({ where: { title: '新しい社内報システムのβ版がリリースされました！' } });
      if (existingPost) {
        console.log('- 投稿データは既に存在します');
      } else {
        // 投稿の作成
        const post1 = await Post.create({
          title: '新しい社内報システムのβ版がリリースされました！',
          content: `長らくお待たせしました。本日より新しい社内報システム「ConnectHub」のβ版をリリースします。

主な機能は以下の通りです：

- 投稿機能：テキスト、画像、ファイル添付が可能な記事投稿
- いいね機能：投稿へのリアクション機能
- コメント機能：投稿へのコメント（自分のコメント削除可能）
- カテゴリ機能：記事のカテゴリ分類と絞り込み表示
- ピックアップ記事：重要な投稿を上部に固定表示

ご不明な点があればIT部までお問い合わせください。`,
          is_pinned: true,
          author_id: admin.id
        });
        
        const post2 = await Post.create({
          title: '4月からの新プロジェクトメンバー募集',
          content: `次期基幹システム開発プロジェクトのメンバーを募集します。興味のある方は詳細をご確認ください。

【プロジェクト概要】
・基幹システムリニューアル
・開発期間：2023年4月〜2024年3月
・使用技術：React, Node.js, MySQL

【募集人数】
・フロントエンド開発：2名
・バックエンド開発：2名
・インフラ担当：1名

【応募方法】
開発部の山田までメールにてご連絡ください。
応募締切：3月20日`,
          is_pinned: false,
          author_id: user.id
        });
        
        const post3 = await Post.create({
          title: '社内イベントのお知らせ：夏祭り',
          content: `今年も社内夏祭りを開催します。皆様のご参加をお待ちしております。

【開催日時】
2023年7月15日（土）15:00〜20:00

【場所】
本社屋上ガーデン

【内容】
・バーベキュー
・ビアガーデン
・ゲーム大会
・カラオケ大会

【参加費】
無料（ご家族の参加も歓迎します）

【申し込み方法】
人事部の花子までメールにてご連絡ください。
申し込み締切：7月5日`,
          is_pinned: true,
          author_id: moderator.id
        });
        console.log('- 投稿データを作成しました');
        
        // カテゴリと投稿の関連付け
        await post1.addCategories([
          categories.find(c => c.name === 'お知らせ'),
          categories.find(c => c.name === '社内システム')
        ]);
        
        await post2.addCategories([
          categories.find(c => c.name === 'プロジェクト'),
          categories.find(c => c.name === '募集')
        ]);
        
        await post3.addCategories([
          categories.find(c => c.name === 'イベント'),
          categories.find(c => c.name === 'お知らせ')
        ]);
        console.log('- 投稿とカテゴリを関連付けました');
        
        // コメントの作成
        await Comment.create({
          content: '待っていました！早速使ってみます。',
          post_id: post1.id,
          author_id: moderator.id
        });
        console.log('- コメントデータを作成しました');
        
        // いいねの作成
        await Like.create({
          user_id: moderator.id,
          post_id: post1.id
        });
        
        await Like.create({
          user_id: user.id,
          post_id: post1.id
        });
        
        await Like.create({
          user_id: admin.id,
          post_id: post2.id
        });
        
        await Like.create({
          user_id: admin.id,
          post_id: post3.id
        });
        
        await Like.create({
          user_id: user.id,
          post_id: post3.id
        });
        console.log('- いいねデータを作成しました');
      }
    }
    
    console.log('初期データの作成が完了しました！');
  } catch (err) {
    console.error('初期データの作成中にエラーが発生しました:', err);
  }
};
