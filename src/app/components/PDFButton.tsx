'use client';

import { generatePDF } from "../actions/pdf_generator";

async function handleClick() {
  const base64Data = await generatePDF();

  // Base64データが空でないことを確認
  if (base64Data) {
    // Base64データをバイナリに変換
    const binaryData = atob(base64Data);

    // バイナリデータからUint8Arrayを作成
    const uint8Array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }

    // Uint8ArrayからBlobを作成
    const blob = new Blob([uint8Array], { type: 'application/pdf' });

    // BlobからURLを作成
    const url = URL.createObjectURL(blob);

    // 新しいウィンドウでURLを開く
    const newWindow = window.open(url, '_blank');

    // 新しいウィンドウが読み込まれたら印刷を実行
    newWindow?.addEventListener('load', () => {
      newWindow.print();
    });
  } else {
    console.error('PDFデータの取得に失敗しました。');
  }
}

export default function PDFButton() {
  return (
    <button onClick={handleClick}>PDFを生成</button>
  );
} 