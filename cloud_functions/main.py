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


def main(request):
    # リクエスト情報を取得する
    request_path = request.path
    request_body = request.json

    # パスパラメータごとに処理を分ける
    if request_path == "/daily_record":
        try:
            add_daily_record(request_body)
        except Exception as e:
            logger.error(e)
            return {"status": 500, "message": str(e)}
    elif request_path == "/menu":
        try:
            # トレーニング目標を記録する処理
            print("")
        except Exception as e:
            logger.error(e)
            return {"status": 500, "message": e}
    else:
        logger.info("無効なパスパラメータでリクエストされました")
        return {"status": 404}

    return {"status": 200}


def add_daily_record(request_body: dict):
    """
    歩数の記録を追加する

    Parameters:
    - request_body (dict): リクエストボディ
        - menu (str): トレーニングメニュー
        - count (int): トレーニング回数や分数

    Raises:
    - Exception: メニューが登録されていない場合
    - Exception: 複数のメニューが登録されている場合
    """
    menu_docs = list(
        get_documents("menu", "name", request_body["menu"])
    )  # Firestoreから歩数の menu_id を持つドキュメントを取得する
    if len(menu_docs) == 0:
        raise Exception("menu が登録されていません")
    elif len(menu_docs) > 1:
        raise Exception("menu が複数登録されています")

    menu_id = menu_docs[0].id
    data = {
        "count": request_body["count"],
        "menu_id": menu_id,
        "created_at": firestore.SERVER_TIMESTAMP,
        "updated_at": firestore.SERVER_TIMESTAMP,
    }

    add_document("daily_record", data)


# Firestoreへのリクエスト
def get_documents(collection_name: str, field: str, value):
    """
    Firestoreからドキュメントを取得する

    Parameters:
    - collection_name (str): コレクション名
    - field (str): 検索に使うフィールド名
    - value: 検索する値

    Returns:
    - docs: 取得したドキュメント
    """
    collection_ref = root_doc.collection(collection_name)
    docs = collection_ref.where(filter=FieldFilter(field, "==", value)).stream()
    return docs


def add_document(collection_name: str, data: dict):
    """
    Firestoreにドキュメントを追加する

    Parameters:
    - collection_name (str): コレクション名
    - data (dict): 追加するデータ

    Returns:
    - doc_ref: 追加したドキュメントの参照
    """
    collection_ref = root_doc.collection(collection_name)
    update_time, doc_ref = collection_ref.add(data)
    logger.info(f"{collection_name}にデータを登録しました")
    return doc_ref
