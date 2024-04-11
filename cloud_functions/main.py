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


def set_documents(collection_name: str, data: dict, doc_id: str = None):
    collection_ref = root_doc.collection(collection_name)
    if doc_id is None:
        collection_ref.document().add(data)
    else:
        collection_ref.document().set(data)


def main(request):
    # クエリパラメータのチェック
    if request.args.get("walk") is None:
        logger.error("クエリパラメータに walk がありません")
        return "walk is required"

    # Firestoreから歩数の menu_id を持つドキュメントを取得する
    menu_docs = get_documents("menu", "name", "歩数")
    if menu_docs.length == 0:
        logger.error("menu に歩数が登録されていません")
        return "menu is not found"
    elif menu_docs.length > 1:
        logger.error("menu に複数の歩数が登録されています")
        return "menu is not found"

    menu_doc = menu_docs[0]
    menu_id = menu_doc.to_dict()["id"]
    walk_count = int(request.args.get("walk"))

    # 当日の歩数情報があれば取得する
    daily_record_docs = get_documents("daily_record", "menu_id", menu_id)
    if daily_record_docs.length == 0:
        print("新規登録の処理")
    elif daily_record_docs.length == 1:
        print(
            "既存の歩数に足した歩数を登録する処理（必要か？SELECTするときに足すほうがいい？）"
        )
    elif daily_record_docs.length > 1:
        logger.error("daily_record に複数の当日の歩数情報が登録されています")
        return "daily_record is not found"

    # data = {
    #     "count": walk_count,
    #     "menu_id": menu_id,
    #     "created_at": firestore.SERVER_TIMESTAMP,
    #     "updated_at": firestore.SERVER_TIMESTAMP,
    # }
