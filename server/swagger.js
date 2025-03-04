const swaggerJsDoc = require('swagger-jsdoc');

// Swagger定義
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ConnectHub API',
      version: '1.0.0',
      description: '社内報システム ConnectHub のAPI仕様書',
      contact: {
        name: 'IT部',
        email: 'it@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: '開発サーバー',
      },
    ],
    components: {
      schemas: {
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: '投稿ID',
            },
            title: {
              type: 'string',
              description: '投稿タイトル',
            },
            content: {
              type: 'string',
              description: '投稿内容',
            },
            author: {
              $ref: '#/components/schemas/User',
            },
            categories: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Category',
              },
            },
            isPinned: {
              type: 'boolean',
              description: 'トップに固定するかどうか',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: '作成日時',
            },
            likes: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  user_id: {
                    type: 'integer',
                    description: 'いいねしたユーザーID',
                  },
                },
              },
            },
            comments: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Comment',
              },
            },
          },
        },
        Comment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'コメントID',
            },
            content: {
              type: 'string',
              description: 'コメント内容',
            },
            author: {
              $ref: '#/components/schemas/User',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: '作成日時',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ユーザーID',
            },
            name: {
              type: 'string',
              description: 'ユーザー名',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'メールアドレス',
            },
            department: {
              type: 'string',
              description: '部署名',
            },
            role: {
              type: 'string',
              enum: ['admin', 'moderator', 'contributor', 'viewer'],
              description: 'ユーザーロール',
            },
            avatar_url: {
              type: 'string',
              description: 'アバター画像URL',
            },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'カテゴリID',
            },
            name: {
              type: 'string',
              description: 'カテゴリ名',
            },
            description: {
              type: 'string',
              description: 'カテゴリの説明',
            },
            is_active: {
              type: 'boolean',
              description: 'アクティブかどうか',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'エラーメッセージ',
            },
          },
        },
      },
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./server.js'], // APIルートが定義されているファイル
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerSpecs;
