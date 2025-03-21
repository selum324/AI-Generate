// server.js
require('dotenv').config();
const express = require('express');
const app = express();

// 静的ファイルの配信
app.use(express.static('public'));

// 環境変数から認証情報を取得
const ADOBE_CLIENT_ID = process.env.ADOBE_CLIENT_ID;
const ADOBE_CLIENT_SECRET = process.env.ADOBE_CLIENT_SECRET;

// Adobe認証エンドポイント
app.get('/api/auth', async (req, res) => {
  try {
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
    res.json({ accessToken: data.access_token });
  } catch (error) {
    res.status(500).json({ error: '認証に失敗しました' });
  }
});

// サーバー起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
