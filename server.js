// server.js
const express = require('express');
const path = require('path');
const app = express();

// JSONリクエストの解析を有効化
app.use(express.json());
// 静的ファイルの提供（publicフォルダ内のファイル）
app.use(express.static('public'));

// Adobe API認証情報
const ADOBE_CLIENT_ID = 'Y50RJM66FX';
const ADOBE_CLIENT_SECRET = 'ea4e93fcad4f2957c826bdf96fffe51c3a42179c';

// Adobe認証エンドポイント
app.get('/api/auth', async (req, res) => {
  try {
    // node-fetch@2のインポート方法
    const fetch = require('node-fetch');
    
    const authData = new URLSearchParams();
    authData.append('client_id', ADOBE_CLIENT_ID);
    authData.append('client_secret', ADOBE_CLIENT_SECRET);
    authData.append('grant_type', 'client_credentials');

    const response = await fetch('https://ims-na1.adobelogin.com/ims/token/v3', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: authData
    });

    const data = await response.json();
    console.log('認証レスポンス:', data);
    
    if (data.access_token) {
      res.json({ accessToken: data.access_token });
    } else {
      throw new Error('アクセストークンが取得できませんでした');
    }
  } catch (error) {
    console.error('認証エラー:', error);
    res.status(500).json({ error: '認証に失敗しました', details: error.message });
  }
});

// 画像生成プロキシエンドポイント
app.post('/api/generate-image', async (req, res) => {
  try {
    const fetch = require('node-fetch');
    const { accessToken, prompt } = req.body;
    
    if (!accessToken || !prompt) {
      return res.status(400).json({ error: 'アクセストークンとプロンプトが必要です' });
    }
    
    console.log('画像生成リクエスト:', prompt);
    
    const response = await fetch('https://image.adobe.io/lrService/generateImage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'x-api-key': ADOBE_CLIENT_ID
      },
      body: JSON.stringify({
        prompt: prompt,
        width: 1024,
        height: 1024,
        quality: 95
      })
    });
    
    const result = await response.json();
    console.log('Adobe API レスポンス:', JSON.stringify(result).substring(0, 200) + '...');
    res.json(result);
  } catch (error) {
    console.error('画像生成エラー:', error);
    res.status(500).json({ error: '画像生成に失敗しました', details: error.message });
  }
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`サーバーが起動しました: http://localhost:${PORT}`);
});
