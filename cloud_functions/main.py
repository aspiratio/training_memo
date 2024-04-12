import os
from logging import DEBUG, StreamHandler, getLogger
from google.cloud import firestore
from google.cloud.firestore_v1.base_query import FieldFilter
from dotenv import load_dotenv

# .env ファイルから環境変数をロード
load_dotenv()

# loggerの設定
logger = getLogger(__name__)
handler = StreamHandler()
handler.setLevel(DEBUG)
logger.setLevel(DEBUG)
logger.addHandler(handler)


# 最上流のコレクション名
root_collection_name = os.getenv("FIRESTORE_ROOT_COLLECTION")
# 最上流配下のドキュメントID（環境毎にDBを変える場合はここで分ける）
root_doc_id = os.getenv("FIRESTORE_ROOT_DOCUMENT")

# Firestoreに接続
db = firestore.Client()
root_doc = db.collection(root_collection_name).document(root_doc_id)


def get_documents(collection_name: str, field: str, value) -> list:
    collection_ref = root_doc.collection(collection_name)
    docs = collection_ref.where(filter=FieldFilter(field, "==", value)).stream()
    return docs


def add_document(collection_name: str, data: dict):
    collection_ref = root_doc.collection(collection_name)
    update_time, doc_ref = collection_ref.add(data)
    logger.info(f"{collection_name}にデータを登録しました")
    return doc_ref


def main(request):
    # クエリパラメータのチェック
    if request.args.get("walk") is None:
        logger.info("歩数情報がありません")
    else:
        # Firestoreから歩数の menu_id を持つドキュメントを取得する
        menu_docs = list(get_documents("menu", "name", "歩数"))
        if len(menu_docs) == 0:
            logger.error("menu に歩数が登録されていません")
            return "menu is not found"
        elif len(menu_docs) > 1:
            logger.error("menu に複数の歩数が登録されています")
            return "menu is not found"

        menu_doc = menu_docs[0]
        menu_id = menu_doc.id
        walk_count = int(request.args.get("walk"))

        data = {
            "count": walk_count,
            "menu_id": menu_id,
            "created_at": firestore.SERVER_TIMESTAMP,
            "updated_at": firestore.SERVER_TIMESTAMP,
        }

        add_document("daily_record", data)
        return {"status": 200}
