// カスタム機能を追加したmain.js

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FlipBook } from 'quick_flipbook';

// シーンの設定
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// カメラの設定
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, -0.2, 1.6);

// レンダラーの設定
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// コントロールの設定
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, -1.1, 0);
controls.update();

// 光源の設定
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
directionalLight.castShadow = true;
scene.add(directionalLight);

// 効果音の設定 - パスを絶対パスに修正
const pageFlipSound = new Audio('./sounds/page-flip.mp3');
pageFlipSound.volume = 0.8; // 音量を上げる
let soundEnabled = true; // 音声の有効/無効を管理するフラグ

// 背景の設定 - 部屋のような環境を作成
const roomGeometry = new THREE.BoxGeometry(20, 15, 20);
const roomMaterials = [
    new THREE.MeshBasicMaterial({ color: 0xA9A9A9, side: THREE.BackSide }), // 右
    new THREE.MeshBasicMaterial({ color: 0xA9A9A9, side: THREE.BackSide }), // 左
    new THREE.MeshBasicMaterial({ color: 0xD3D3D3, side: THREE.BackSide }), // 上
    new THREE.MeshBasicMaterial({ color: 0x8B4513, side: THREE.BackSide }), // 下（床）
    new THREE.MeshBasicMaterial({ color: 0xA9A9A9, side: THREE.BackSide }), // 前
    new THREE.MeshBasicMaterial({ color: 0xA9A9A9, side: THREE.BackSide })  // 後ろ
];
const room = new THREE.Mesh(roomGeometry, roomMaterials);
scene.add(room);

// テーブルの作成
const tableGeometry = new THREE.BoxGeometry(5, 0.2, 3);
const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
const table = new THREE.Mesh(tableGeometry, tableMaterial);
table.position.y = -1.5;
table.receiveShadow = true;
scene.add(table);

// 絵本の作成
const book = new FlipBook({
    flipDuration: 0.8, // ページめくりの時間（秒）
    yBetweenPages: 0.001, // ページ間のスペース
    pageSubdivisions: 20 // ページの分割数（滑らかさに影響）
});

// 絵本のスケール調整（縦横比を調整）
book.scale.x = 0.8;
book.scale.y = 1.1; // 縦方向に少し大きく
book.position.y = -1.1; // テーブルの上の位置を調整
book.rotation.x = -0.35; // より見やすい角度に傾ける
scene.add(book);

// 画像の上にテキストを追加する関数（出版社クオリティに調整）
function createTextOverlayTexture(imagePath, text, rubyText, yPosition = 0.85) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            
            // 画像を描画
            ctx.drawImage(img, 0, 0);
            
            // テキスト用の半透明の背景 - 高さを広げる
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; // 背景を少し濃くして読みやすく
            const textY = canvas.height * yPosition;
            
            // 4ページ目の場合、テキストを2段に分けて表示するための特別処理
            if (text.startsWith('お化けになった先生が怖かった')) {
                ctx.fillRect(0, textY - 60, canvas.width, 140); // 背景位置を他のページと統一
                
                // 文字列を分解（2行に分けるため）
                const textParts1 = analyzeText('お化けになった先生が怖かったけど、');
                const textParts2 = analyzeText('いい思い出になったおばけやしき。');
                
                // テキスト位置計算のための準備
                ctx.font = 'bold 30px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                
                // 全体のテキスト幅を計算（文字間隔を含む）- 1行目
                let totalWidth1 = 0;
                for (const part of textParts1) {
                    totalWidth1 += ctx.measureText(part.text).width;
                    if (part.spacing) {
                        totalWidth1 += part.spacing;
                    }
                }
                
                // 全体のテキスト幅を計算（文字間隔を含む）- 2行目
                let totalWidth2 = 0;
                for (const part of textParts2) {
                    totalWidth2 += ctx.measureText(part.text).width;
                    if (part.spacing) {
                        totalWidth2 += part.spacing;
                    }
                }
                
                // 開始位置を計算（中央揃え）- 1行目
                const centerX = canvas.width / 2;
                let currentX1 = centerX - totalWidth1 / 2;
                
                // 各部分を描画 - 1行目
                for (const part of textParts1) {
                    const width = ctx.measureText(part.text).width;
                    
                    // 本文テキストを描画
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 30px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                    ctx.fillText(part.text, currentX1, textY - 30); // 1行目位置を下に調整
                    
                    // 読み仮名（ルビ）を描画 - 漢字の真上に配置
                    if (part.isKanji && part.ruby) {
                        // 正確な中央位置
                        const charCenterX = currentX1 + width/2;
                        
                        ctx.font = '15px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                        const rubyWidth = ctx.measureText(part.ruby).width;
                        
                        // ルビを漢字の真上、中央揃えで配置
                        ctx.fillText(part.ruby, charCenterX - rubyWidth/2, textY - 65); // ルビ位置も調整
                    }
                    
                    // X位置を更新
                    currentX1 += width;
                    if (part.spacing) {
                        currentX1 += part.spacing;
                    }
                }
                
                // 開始位置を計算（中央揃え）- 2行目
                let currentX2 = centerX - totalWidth2 / 2;
                
                // 各部分を描画 - 2行目
                for (const part of textParts2) {
                    const width = ctx.measureText(part.text).width;
                    
                    // 本文テキストを描画
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 30px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                    ctx.fillText(part.text, currentX2, textY + 30); // 2行目位置を下に調整
                    
                    // 読み仮名（ルビ）を描画 - 漢字の真上に配置
                    if (part.isKanji && part.ruby) {
                        // 正確な中央位置
                        const charCenterX = currentX2 + width/2;
                        
                        ctx.font = '15px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                        const rubyWidth = ctx.measureText(part.ruby).width;
                        
                        // ルビを漢字の真上、中央揃えで配置
                        ctx.fillText(part.ruby, charCenterX - rubyWidth/2, textY - 5); // ルビ位置も調整
                    }
                    
                    // X位置を更新
                    currentX2 += width;
                    if (part.spacing) {
                        currentX2 += part.spacing;
                    }
                }
            } 
            // 5ページ目も2段に分ける特別処理
            else if (text.startsWith('たくさん練習してパパとママに見て')) {
                // 他のページと同じ背景方式に統一
                const adjustedY = textY - 60; // 他のページと同様の位置調整
                ctx.fillRect(0, adjustedY, canvas.width, 140); // 背景位置を他のページと同様に調整
                
                // 文字列を分解（2行に分けるため）
                const textParts1 = analyzeText('たくさん練習してパパとママに見てもらった');
                const textParts2 = analyzeText('にじいろステージ。思い出がたくさん。');
                
                // テキスト位置計算のための準備
                ctx.font = 'bold 30px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                
                // 全体のテキスト幅を計算（文字間隔を含む）- 1行目
                let totalWidth1 = 0;
                for (const part of textParts1) {
                    totalWidth1 += ctx.measureText(part.text).width;
                    if (part.spacing) {
                        totalWidth1 += part.spacing;
                    }
                }
                
                // 全体のテキスト幅を計算（文字間隔を含む）- 2行目
                let totalWidth2 = 0;
                for (const part of textParts2) {
                    totalWidth2 += ctx.measureText(part.text).width;
                    if (part.spacing) {
                        totalWidth2 += part.spacing;
                    }
                }
                
                // 開始位置を計算（中央揃え）- 1行目
                const centerX = canvas.width / 2;
                let currentX1 = centerX - totalWidth1 / 2;
                
                // 各部分を描画 - 1行目
                for (const part of textParts1) {
                    const width = ctx.measureText(part.text).width;
                    
                    // 本文テキストを描画
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 30px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                    ctx.fillText(part.text, currentX1, textY - 30); // 1行目位置を下に調整
                    
                    // 読み仮名（ルビ）を描画 - 漢字の真上に配置
                    if (part.isKanji && part.ruby) {
                        // 正確な中央位置
                        const charCenterX = currentX1 + width/2;
                        
                        ctx.font = '15px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                        const rubyWidth = ctx.measureText(part.ruby).width;
                        
                        // ルビを漢字の真上、中央揃えで配置
                        ctx.fillText(part.ruby, charCenterX - rubyWidth/2, textY - 65); // ルビ位置も調整
                    }
                    
                    // X位置を更新
                    currentX1 += width;
                    if (part.spacing) {
                        currentX1 += part.spacing;
                    }
                }
                
                // 開始位置を計算（中央揃え）- 2行目
                let currentX2 = centerX - totalWidth2 / 2;
                
                // 各部分を描画 - 2行目
                for (const part of textParts2) {
                    const width = ctx.measureText(part.text).width;
                    
                    // 本文テキストを描画
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 30px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                    ctx.fillText(part.text, currentX2, textY + 30); // 2行目位置を下に調整
                    
                    // 読み仮名（ルビ）を描画 - 漢字の真上に配置
                    if (part.isKanji && part.ruby) {
                        // 正確な中央位置
                        const charCenterX = currentX2 + width/2;
                        
                        ctx.font = '15px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                        const rubyWidth = ctx.measureText(part.ruby).width;
                        
                        // ルビを漢字の真上、中央揃えで配置
                        ctx.fillText(part.ruby, charCenterX - rubyWidth/2, textY - 5); // ルビ位置も調整
                    }
                    
                    // X位置を更新
                    currentX2 += width;
                    if (part.spacing) {
                        currentX2 += part.spacing;
                    }
                }
            }
            // 標準的なテキスト処理（他のページ）
            else {
                // すべてのページで統一した背景サイズと位置
                ctx.fillRect(0, textY - 60, canvas.width, 140); // ページ4と同じ背景設定に統一
                
                // 文字列を分解
                const textParts = analyzeText(text);
                
                // テキスト位置計算のための準備
                ctx.font = 'bold 30px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                
                // 全体のテキスト幅を計算（文字間隔を含む）
                let totalWidth = 0;
                for (const part of textParts) {
                    totalWidth += ctx.measureText(part.text).width;
                    if (part.spacing) {
                        totalWidth += part.spacing;
                    }
                }
                
                // 開始位置を計算（中央揃え）
                const centerX = canvas.width / 2;
                let currentX = centerX - totalWidth / 2;
                
                // テキストの表示位置を統一
                const displayY = textY + 10; // ページ4と同じ位置に調整
                
                // 各部分を描画
                for (const part of textParts) {
                    const width = ctx.measureText(part.text).width;
                    
                    // 本文テキストを描画
                    ctx.fillStyle = '#000000';
                    ctx.font = 'bold 30px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                    ctx.fillText(part.text, currentX, displayY);
                    
                    // 読み仮名（ルビ）を描画 - 漢字の真上に配置
                    if (part.isKanji && part.ruby) {
                        // 正確な中央位置
                        const charCenterX = currentX + width/2;
                        
                        ctx.font = '15px \"Hiragino Sans\", \"Meiryo\", sans-serif';
                        const rubyWidth = ctx.measureText(part.ruby).width;
                        
                        // ルビを漢字の真上、中央揃えで配置
                        ctx.fillText(part.ruby, charCenterX - rubyWidth/2, displayY - 35);
                    }
                    
                    // X位置を更新
                    currentX += width;
                    if (part.spacing) {
                        currentX += part.spacing;
                    }
                }
            }
            
            // テクスチャを作成
            const texture = new THREE.CanvasTexture(canvas);
            resolve(texture);
        };
        img.src = imagePath;
    });
}

// テキストを分析して、漢字とルビのマッピングを行う関数
function analyzeText(text) {
    // 漢字とルビのマッピング
    const rubyMap = {
        // 1ページ目
        '友': 'とも',
        '達': 'だち',
        '笑': 'わら',
        
        // 2ページ目
        '海': 'うみ',
        '泳': 'およ',
        '楽': 'たの',
        '思': 'おも',
        '出': 'で',
        
        // 3ページ目
        '公': 'こう',
        '園': 'えん',
        '遊': 'あそ',
        '最': 'さい',
        '高': 'こう',
        '日': 'ひ',
        
        // 4ページ目
        '化': 'ば',
        '先': 'せん',
        '生': 'せい',
        '怖': 'こわ',
        '思': 'おも',
        '出': 'で',
        '館': 'かん',
        
        // 5ページ目
        '練': 'れん',
        '習': 'しゅう',
        '見': 'み',
        '虹': 'にじ',
        '色': 'いろ',
        '舞': 'ぶ',
        '台': 'たい',
        '思': 'おも',
        '出': 'で'
    };
    
    const result = [];
    let i = 0;
    
    while (i < text.length) {
        const char = text[i];
        
        // 漢字かどうかをチェック
        const isKanji = (char >= '\u4e00' && char <= '\u9faf') || (char >= '\u3400' && char <= '\u4dbf');
        
        if (isKanji && rubyMap[char]) {
            result.push({
                text: char,
                isKanji: true,
                ruby: rubyMap[char],
                spacing: 3 // 漢字の後の文字間隔を調整
            });
        } else {
            result.push({
                text: char,
                isKanji: false,
                spacing: 0 // 通常の文字には追加の間隔を入れない
            });
        }
        
        i++;
    }
    
    return result;
}

// 効果音のプリロード
function preloadSounds() {
    return new Promise((resolve) => {
        // 初回のユーザーインタラクションに備えて効果音を準備
        document.body.addEventListener('click', function initAudio() {
            // ダミー再生を行ってユーザーインタラクションを確立
            pageFlipSound.play().then(() => {
                pageFlipSound.pause();
                pageFlipSound.currentTime = 0;
                console.log('効果音の初期化が完了しました');
            }).catch(e => {
                console.warn('効果音の初期化に失敗しました:', e);
            });
            document.body.removeEventListener('click', initAudio);
        }, {once: true});
        
        // 効果音が読み込まれたら準備完了
        pageFlipSound.addEventListener('canplaythrough', function onCanPlay() {
            pageFlipSound.removeEventListener('canplaythrough', onCanPlay);
            console.log('効果音の読み込みが完了しました');
            resolve();
        });
        
        // すでに読み込まれている場合や、エラーの場合も処理を進める
        pageFlipSound.addEventListener('error', function(e) {
            console.warn('効果音の読み込みに失敗しました:', e);
            resolve();
        });
        
        // 効果音ファイルのプリロード
        pageFlipSound.load();
    });
}

// 音声トグルボタンの作成
function createSoundToggleButton() {
    const soundButton = document.createElement('button');
    soundButton.id = 'soundToggle';
    soundButton.innerHTML = '🔊'; // 音量アイコン
    
    // スタイル設定
    soundButton.style.position = 'fixed';
    soundButton.style.top = '20px';
    soundButton.style.right = '20px';
    soundButton.style.padding = '10px';
    soundButton.style.borderRadius = '50%';
    soundButton.style.background = 'rgba(255, 255, 255, 0.7)';
    soundButton.style.border = '1px solid #ccc';
    soundButton.style.fontSize = '20px';
    soundButton.style.cursor = 'pointer';
    soundButton.style.zIndex = '100';
    soundButton.style.width = '50px';
    soundButton.style.height = '50px';
    
    // クリックイベント
    soundButton.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundButton.innerHTML = soundEnabled ? '🔊' : '🔇';
        if (soundEnabled) {
            // 音声有効時にテスト再生
            playPageFlipSound();
        }
    });
    
    document.body.appendChild(soundButton);
}

// ボタンとイベントリスナーのセットアップ
function setupButtons() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    
    prevButton.addEventListener('click', () => {
        book.flipLeft();
        // ページをめくる時に効果音を再生
        playPageFlipSound();
    });
    
    nextButton.addEventListener('click', () => {
        book.flipRight();
        // ページをめくる時に効果音を再生
        playPageFlipSound();
    });
    
    // 絵本本体をクリックしてもページがめくれるように
    renderer.domElement.addEventListener('click', (event) => {
        // クリック位置に基づいてページをめくる方向を決定
        const halfWidth = window.innerWidth / 2;
        if (event.clientX < halfWidth) {
            book.flipLeft();
        } else {
            book.flipRight();
        }
        // 効果音を再生
        playPageFlipSound();
    });
    
    // 音声トグルボタンの作成
    createSoundToggleButton();
}

// 効果音を再生する関数
function playPageFlipSound() {
    if (!soundEnabled) return;
    
    // 効果音が再生中の場合はリセット
    pageFlipSound.currentTime = 0;
    // 効果音を再生
    pageFlipSound.play().catch(e => {
        console.log('効果音の再生エラー:', e);
    });
}

// ページ画像を読み込む関数
async function loadPages() {
    // 絵本のテクスチャとして使用する画像パス
    const coverPath = 'images/cover.jpg';
    const page1Path = 'images/page1.jpg';
    const page2Path = 'images/page2.jpg';
    const page3Path = 'images/page3.jpg';
    const page4Path = 'images/page4.jpg';
    const page5Path = 'images/page5.jpg';
    const backCoverPath = 'images/backcover.jpg';
    
    // カバーのテクスチャ作成
    const coverTexture = await createTextOverlayTexture(coverPath, "", "");
    
    // ページ1のテクスチャ作成 - テキストとルビを追加
    const page1Texture = await createTextOverlayTexture(
        page1Path, 
        "友達と笑って過ごした楽しい一日。", 
        ""
    );
    
    // ページ2のテクスチャ作成
    const page2Texture = await createTextOverlayTexture(
        page2Path, 
        "海で泳いで楽しかった夏の思い出。", 
        ""
    );
    
    // ページ3のテクスチャ作成
    const page3Texture = await createTextOverlayTexture(
        page3Path, 
        "公園で遊んだ最高の日。", 
        ""
    );
    
    // ページ4のテクスチャ作成
    const page4Texture = await createTextOverlayTexture(
        page4Path, 
        "お化けになった先生が怖かったけど、いい思い出になったおばけやしき。", 
        ""
    );
    
    // ページ5のテクスチャ作成
    const page5Texture = await createTextOverlayTexture(
        page5Path, 
        "たくさん練習してパパとママに見てもらったにじいろステージ。思い出がたくさん。", 
        ""
    );
    
    // 裏表紙のテクスチャ作成
    const backCoverTexture = await createTextOverlayTexture(backCoverPath, "", "");
    
    // ページを絵本に追加
    book.addPage(coverTexture, coverTexture); // 表紙（両面同じテクスチャ）
    book.addPage(page1Texture, page2Texture);  // ページ1と2
    book.addPage(page3Texture, page4Texture);  // ページ3と4
    book.addPage(page5Texture, backCoverTexture); // ページ5と裏表紙
}

// ウィンドウのリサイズ処理
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// メインのアニメーションループ
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// 初期化時に実行する関数
async function init() {
    console.log('初期化を開始します');
    
    // 効果音のプリロード
    await preloadSounds();
    
    // ページの読み込み
    await loadPages();
    
    // ボタンのセットアップ
    setupButtons();
    
    // イベントリスナーの追加
    window.addEventListener('resize', onWindowResize, false);
    
    // アニメーションの開始
    animate();
    
    console.log('初期化が完了しました');
}

init();