from google.cloud import firestore
import os
from dotenv import load_dotenv

# .env ファイルから環境変数をロード
load_dotenv()

# 最上流のコレクション名
root_collection_name = os.getenv("FIRESTORE_ROOT_COLLECTION")
# 最上流配下のドキュメントID（環境毎にDBを変える場合はここで分ける）
root_doc_id = os.getenv("FIRESTORE_ROOT_DOCUMENT")

# Firestoreに接続
db = firestore.Client()
root_doc = db.collection(root_collection_name).document(root_doc_id)


def set_documents(collection_name: str, data: dict):
    try:
        print(f"{collection_name}にドキュメントの登録が成功しました")

    except Exception:
        raise


def main(request):
    set_documents("menu", {"test": "test"})
