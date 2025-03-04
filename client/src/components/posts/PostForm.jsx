import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import styles from './PostForm.module.css';

const PostForm = ({ initialValues = {}, onSubmit = () => {}, onCancel = () => {}, isSubmitting = false, isEdit = false }) => {
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState(initialValues.title || '');
  const [content, setContent] = useState(initialValues.content || '');
  const [headerImage, setHeaderImage] = useState(initialValues.headerImage || '');
  const [headerImageFile, setHeaderImageFile] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(initialValues.categories || []);
  const [isPinned, setIsPinned] = useState(initialValues.isPinned || false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [showImagePreview, setShowImagePreview] = useState(!!initialValues.headerImage);
  const [isRichEditor, setIsRichEditor] = useState(true); // デフォルトでリッチエディタを有効に
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  
  // サンプル画像URL一覧
  const sampleImages = [
    'https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504198453758-3fab425caefa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ];

  // ヘッダー画像ドロップゾーン処理
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith('image/')) {
        // 画像ファイルをプレビュー用にURLに変換
        const imageUrl = URL.createObjectURL(file);
        setHeaderImage(imageUrl);
        setHeaderImageFile(file);
        setShowImagePreview(true);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    multiple: false
  });

  useEffect(() => {
    setIsDraggingOver(isDragActive);
  }, [isDragActive]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 実際のAPIを使用する場合
        // const response = await axios.get('/api/categories');
        // setCategories(response.data);

        // モックデータ
        const mockCategories = [
          { id: 1, name: 'お知らせ', description: '会社からの公式なお知らせや通知を掲載します', is_active: true },
          { id: 2, name: 'プロジェクト', description: '社内の各種プロジェクトに関する情報を共有します', is_active: true },
          { id: 3, name: '社員インタビュー', description: '社員の仕事や趣味などを紹介するインタビュー記事です', is_active: true },
          { id: 4, name: 'イベント', description: '社内イベントや外部イベントの情報を掲載します', is_active: true },
          { id: 5, name: '社内システム', description: '業務システムや社内ツールに関する情報です', is_active: true },
          { id: 6, name: '募集', description: '社内での募集やプロジェクトメンバー募集などの情報です', is_active: true },
          { id: 7, name: 'マーケティング部', description: 'マーケティング部からの情報発信です', is_active: true },
          { id: 8, name: '営業部', description: '営業部からの情報発信です', is_active: true },
          { id: 9, name: '開発部', description: '開発部からの情報発信です', is_active: true },
          { id: 10, name: '人事部', description: '人事部からの情報発信です', is_active: true },
          { id: 11, name: '広報部', description: '広報部からの情報発信です', is_active: true },
          { id: 12, name: 'IT部', description: 'IT部からの情報発信です', is_active: true }
        ];
        setCategories(mockCategories);
      } catch (err) {
        console.error('カテゴリの取得に失敗:', err);
      }
    };

    fetchCategories();
  }, []);
  
  const handleCategoryChange = (categoryName) => {
    if (selectedCategories.includes(categoryName)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== categoryName));
    } else {
      setSelectedCategories([...selectedCategories, categoryName]);
    }
  };

  const handleSelectSampleImage = (imageUrl) => {
    setHeaderImage(imageUrl);
    setHeaderImageFile(null); // サンプル画像を選んだ場合、アップロードファイルをクリア
    setShowImagePreview(true);
  };

  // ファイル選択ダイアログを開く
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const imageUrl = URL.createObjectURL(file);
      setHeaderImage(imageUrl);
      setHeaderImageFile(file);
      setShowImagePreview(true);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (title.trim() === '') {
      newErrors.title = 'タイトルを入力してください';
    } else if (title.length > 100) {
      newErrors.title = 'タイトルは100文字以内で入力してください';
    }
    
    if (content.trim() === '') {
      newErrors.content = '内容を入力してください';
    }
    
    if (selectedCategories.length === 0) {
      newErrors.categories = 'カテゴリを1つ以上選択してください';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // 実際の実装では、ここでheaderImageFileをアップロードして
    // 本番環境のURLを取得する処理を追加します
    // 簡略化のため、今回はそのままheaderImageを使用します
    
    onSubmit({
      title,
      content,
      headerImage,
      categories: selectedCategories,
      isPinned
    });
  };

  // Quillエディタの設定
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];
  
  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="title">タイトル</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.formControl}
          placeholder="投稿のタイトル"
          disabled={isSubmitting}
        />
        {errors.title && <div className={styles.error}>{errors.title}</div>}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>ヘッダー画像</label>
        
        {/* ドラッグ&ドロップエリア */}
        <div 
          {...getRootProps()} 
          className={`${styles.dropzone} ${isDraggingOver ? styles.dragActive : ''}`}
        >
          <input {...getInputProps()} />
          {isDraggingOver ? (
            <p>画像をドロップしてください</p>
          ) : (
            <div className={styles.dropzoneContent}>
              <p>画像をドラッグ&ドロップするか、クリックして選択してください</p>
              <button 
                type="button" 
                className={styles.browseButton}
                onClick={(e) => e.stopPropagation()} // ドロップゾーンのクリックイベントを阻止
              >
                ファイルを選択
                <input 
                  type="file" 
                  accept="image/*" 
                  className={styles.fileInput} 
                  onChange={handleFileSelect}
                  onClick={(e) => e.stopPropagation()} // ドロップゾーンのクリックイベントを阻止
                />
              </button>
            </div>
          )}
        </div>

        <div className={styles.sampleImagesContainer}>
          <p className={styles.sampleImagesLabel}>サンプル画像:</p>
          <div className={styles.sampleImageGrid}>
            {sampleImages.map((imageUrl, index) => (
              <div 
                key={index}
                className={styles.sampleImageItem}
                onClick={() => handleSelectSampleImage(imageUrl)}
              >
                <img src={imageUrl} alt={`サンプル${index + 1}`} className={styles.sampleImage} />
              </div>
            ))}
          </div>
        </div>
        
        {showImagePreview && headerImage && (
          <div className={styles.imagePreviewContainer}>
            <p>ヘッダー画像プレビュー:</p>
            <img 
              src={headerImage} 
              alt="ヘッダープレビュー" 
              className={styles.imagePreview} 
              onError={() => setShowImagePreview(false)}
            />
            <button
              type="button"
              className={styles.removeImageButton}
              onClick={() => {
                setHeaderImage('');
                setHeaderImageFile(null);
                setShowImagePreview(false);
              }}
            >
              画像を削除
            </button>
          </div>
        )}
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel} htmlFor="content">内容</label>
        <div className={styles.richEditorToggle}>
          <label>
            <input
              type="checkbox"
              checked={isRichEditor}
              onChange={() => setIsRichEditor(!isRichEditor)}
            />
            リッチエディタを使用
          </label>
        </div>

        {isRichEditor ? (
          <div className={styles.quillWrapper}>
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="投稿の内容"
              className={styles.quillEditor}
              readOnly={isSubmitting}
            />
          </div>
        ) : (
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`${styles.formControl} ${styles.textArea}`}
            placeholder="投稿の内容"
            rows="10"
            disabled={isSubmitting}
          ></textarea>
        )}
        {errors.content && <div className={styles.error}>{errors.content}</div>}
      </div>
      
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>カテゴリ</label>
        <div className={styles.checkboxGroup}>
          {categories.map((category) => (
            <div key={category.id} className={styles.checkbox}>
              <input
                type="checkbox"
                id={`category-${category.id}`}
                value={category.name}
                checked={selectedCategories.includes(category.name)}
                onChange={() => handleCategoryChange(category.name)}
                disabled={isSubmitting}
              />
              <label htmlFor={`category-${category.id}`}>{category.name}</label>
            </div>
          ))}
        </div>
        {errors.categories && <div className={styles.error}>{errors.categories}</div>}
      </div>
      
      {(currentUser?.role === 'admin' || currentUser?.role === 'moderator') && (
        <div className={styles.formGroup}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              disabled={isSubmitting}
            />
            <label htmlFor="isPinned">トップに固定する</label>
          </div>
        </div>
      )}
      
      <div className={styles.buttonContainer}>
        <button
          type="button"
          onClick={onCancel}
          className={`${styles.button} ${styles.secondaryButton}`}
          disabled={isSubmitting}
        >
          キャンセル
        </button>
        
        <button
          type="submit"
          className={`${styles.button} ${styles.primaryButton}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? '送信中...' : isEdit ? '更新する' : '投稿する'}
        </button>
      </div>
    </form>
  );
};

export default PostForm;