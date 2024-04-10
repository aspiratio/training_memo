# 運動メモアプリを作成する

## 機能要件

- 歩数と筋トレの回数を記録できる
- 1 週間単位で目標設定ができる
- 目標に対してあとどれだけ歩けばいいか、何の筋トレをすればいいかを LINE で通知してくれる
  - 週は月曜開始 - 日曜終了
- 歩数は iPhone のヘルスケアアプリと連動して記録してくれる

## 非機能要件

- 機能・UI がシンプル
- スマホアプリチックな UI
- アプリを開いてから記録するまでのタップ数を極力少なく

# アーキテクチャ

https://www.figma.com/file/606o03IIXTp3SRGSsAdCBH/%E3%82%A2%E3%83%BC%E3%82%AD%E3%83%86%E3%82%AF%E3%83%81%E3%83%A3%E5%9B%B3?type=whiteboard&node-id=5-106&t=gAL0AzOCs7THyRcp-4

# DB 仕様

Firestore

- (default)
  - training_memo
    - v1
      - daily_record
        - <document_id>
          - menu_id: string
          - count: number
          - created_at: timestamp
          - updated_at: timestamp
      - menu
        - <document_id>
          - name: string
          - unit: string
          - weekly_quota: number
          - created_at: timestamp
          - updated_at: timestamp
