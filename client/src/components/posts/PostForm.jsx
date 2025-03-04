import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import styles from './PostForm.module.css';

const PostForm = ({ initialValues = {}, onSubmit, onCancel, isSubmitting = false, isEdit = false }) => {
  const { currentUser } = useAuth();
  
  const [title, setTitle] = useState(initialValues.title || '');
  const [content, setContent] = useState(initialValues.content || '');
  const [headerImage, setHeaderImage] = useState(initialValues.headerImage || '');
  const [selectedCategories, setSelectedCategories] = useState(initialValues.categories || []);
  const [isPinned, setIsPinned] = useState(initialValues.isPinned || false);
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [showImagePreview, setShowImagePreview] = useState(!!initialValues.headerImage);
  const [isRichEditor, setIsRichEditor] = useState(false);
  
  // サンプル画像URL一覧
  const sampleImages = [
    'https://images.unsplash.com/photo-1492571350019-22de08371fd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1528360983277-13d401cdc186?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1504198453758-3fab425caefa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ];
  
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
    setShowImagePreview(true);
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
    
    onSubmit({
      title,
      content,
      headerImage,
      categories: selectedCategories,
      isPinned
    });
  };

  // リッチテキストの装飾ボタン
  const formatButtons = [
    { label: 'B', style: 'font-weight: bold;', format: '**', tooltip: '太字' },
    { label: 'I', style: 'font-style: italic;', format: '*', tooltip: 'イタリック' },
    { label: 'U', style: 'text-decoration: underline;', format: '__', tooltip: '下線' },
    { label: 'H2', style: 'font-size: 1.5em;', format: '## ', tooltip: '見出し2' },
    { label: 'H3', style: 'font-size: 1.25em;', format: '### ', tooltip: '見出し3' },
    { label: 'リスト', style: '', format: '- ', tooltip: 'リスト' },
    { label: '画像', style: '', format: '![画像の説明](', tooltip: '画像を挿入（URLが必要）', postfix: ')' }
  ];

  const handleFormat = (format, postfix = '') => {
    const textarea = document.getElementById('content');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    let newContent;
    if (selectedText) {
      // テキストが選択されている場合
      if (format === '- ') {
        // リストの場合は各行の先頭に追加
        const lines = selectedText.split('\n');
        const formattedLines = lines.map(line => `${format}${line}`);
        newContent = content.substring(0, start) + formattedLines.join('\n') + content.substring(end);
      } else if (format === '![画像の説明](') {
        // 画像の場合はURLとして扱う
        newContent = content.substring(0, start) + format + selectedText + postfix + content.substring(end);
      } else if (format === '## ' || format === '### ') {
        // 見出しの場合は行の先頭に追加
        newContent = content.substring(0, start) + format + selectedText + content.substring(end);
      } else {
        // それ以外の装飾
        newContent = content.substring(0, start) + format + selectedText + format + content.substring(end);
      }
    } else {
      // テキストが選択されていない場合
      if (format === '![画像の説明](') {
        const imageUrl = prompt('画像のURLを入力してください');
        if (imageUrl) {
          newContent = content.substring(0, start) + format + imageUrl + postfix + content.substring(end);
        } else {
          return; // キャンセルされた場合は何もしない
        }
      } else {
        newContent = content.substring(0, start) + format + content.substring(end);
      }
    }
    
    setContent(newContent);
    
    // フォーカスを戻す
    setTimeout(() => {
      textarea.focus();
      if (format === '![画像の説明](' && postfix === ')') {
        // 画像の場合、URLの後にカーソルを移動
        textarea.setSelectionRange(start + format.length, start + format.length);
      } else {
        // 通常の場合、選択範囲の後ろにカーソルを移動
        const newCursorPos = start + format.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };
  
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
        <label className={styles.formLabel} htmlFor="headerImage">ヘッダー画像URL</label>
        <input
          id="headerImage"
          type="text"
          value={headerImage}
          onChange={(e) => {
            setHeaderImage(e.target.value);
            setShowImagePreview(!!e.target.value);
          }}
          className={styles.formControl}
          placeholder="画像のURLを入力（任意）"
          disabled={isSubmitting}
        />
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
            <p>画像プレビュー:</p>
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

        {isRichEditor && (
          <div className={styles.formatToolbar}>
            {formatButtons.map((button, index) => (
              <button
                key={index}
                type="button"
                className={styles.formatButton}
                style={{ ...button.style && { fontStyle: button.style } }}
                onClick={() => handleFormat(button.format, button.postfix)}
                title={button.tooltip}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`${styles.formControl} ${styles.textArea}`}
          placeholder="投稿の内容"
          rows="10"
          disabled={isSubmitting}
        ></textarea>
        {errors.content && <div className={styles.error}>{errors.content}</div>}

        {content && isRichEditor && (
          <div className={styles.previewContainer}>
            <h4>プレビュー:</h4>
            <div className={styles.contentPreview}>
              {content.split('\n').map((line, i) => {
                // ヘッダーの処理
                if (line.startsWith('## ')) {
                  return <h2 key={i}>{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={i}>{line.replace('### ', '')}</h3>;
                }
                
                // リストの処理
                if (line.startsWith('- ')) {
                  return <li key={i}>{line.replace('- ', '')}</li>;
                }
                
                // 画像の処理
                const imgRegex = /!\[([^\]]*)\]\(([^)]*)\)/g;
                let imgMatch;
                let processedLine = line;
                
                while ((imgMatch = imgRegex.exec(line)) !== null) {
                  const [fullMatch, alt, src] = imgMatch;
                  processedLine = processedLine.replace(
                    fullMatch,
                    `<img src="${src}" alt="${alt}" style="max-width: 100%;" />`
                  );
                }
                
                // 太字、イタリック、下線の処理
                let formattedLine = processedLine
                  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*([^*]+)\*/g, '<em>$1</em>')
                  .replace(/__([^_]+)__/g, '<u>$1</u>');
                
                return imgRegex.test(line) ? (
                  <div key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
                ) : (
                  <p key={i} dangerouslySetInnerHTML={{ __html: formattedLine }} />
                );
              })}
            </div>
          </div>
        )}
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
