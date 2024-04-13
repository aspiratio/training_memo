import os
from logging import DEBUG, Formatter, StreamHandler, getLogger
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
formatter = Formatter("[%(filename)s:%(lineno)d] %(message)s")
handler.setFormatter(formatter)
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
    print(request_body)

    # パスパラメータごとに処理を分ける
    if request_path == "/daily_record":
        try:
            add_daily_record(request_body)
        except Exception as e:
            logger.error(e, exc_info=True)
            return {"status": 500, "message": "記録に失敗しました"}
    elif request_path == "/menu":
        try:
            set_training_menu(request_body)
        except Exception as e:
            logger.error(e, exc_info=True)
            return {"status": 500, "message": "設定に失敗しました"}
    else:
        logger.info("無効なパスパラメータでリクエストされました")
        return {"status": 404}

    return {"status": 200}


def add_daily_record(request_body: dict):
    """
    トレーニング記録を追加する

    Parameters:
    - request_body (dict): リクエストボディ
        - menu (str): トレーニングメニュー
        - count (int): トレーニング回数や分数

    Raises:
    - Exception: メニューが登録されていない場合
    - Exception: 複数のメニューが登録されている場合
    """
    menu_docs = list(get_documents("menu", "name", request_body["menu"]))
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

    set_document("daily_record", data)


def set_training_menu(request_body: dict):
    """
    トレーニングノルマを設定する

    Parameters:
    - request_body (dict): リクエストボディ
        - name (str): トレーニングメニュー
        - unit (str): 単位（分や回など）
        - weekly_quota (int): 週あたりのノルマ

    Raises:
    - Exception: 複数のメニューが登録されている場合
    """
    menu_docs = list(get_documents("menu", "name", request_body["name"]))
    if len(menu_docs) > 1:
        raise Exception("menu が複数登録されています")

    menu_id = menu_docs[0].id
    data = {
        "name": request_body["name"],
        "unit": request_body["unit"],
        "weekly_quota": request_body["weekly_quota"],
        "created_at": firestore.SERVER_TIMESTAMP,
        "updated_at": firestore.SERVER_TIMESTAMP,
    }

    set_document("menu", data, menu_id)


# Firestoreへのリクエスト
def get_documents(collection_name: str, field: str, value):
    """
    Firestoreから指定した検索条件に一致するドキュメントを取得する

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


def set_document(collection_name: str, data: dict, doc_id: str = ""):
    """
    Firestoreにドキュメントを追加する。doc_idを指定すれば上書きする

    Parameters:
    - collection_name (str): コレクション名
    - data (dict): 追加するデータ
    - doc_id (str): 上書きするドキュメントID

    Returns:
    - doc_ref: 追加したドキュメントの参照
    """
    collection_ref = root_doc.collection(collection_name)
    if doc_id == "":
        doc_ref = collection_ref.document().set(
            data
        )  # 自動生成したドキュメントIDで登録する
    else:
        doc_ref = collection_ref.document(doc_id).set(
            data
        )  # 指定されたドキュメントに上書きする
    logger.info(f"{collection_name}にデータを登録しました")
    return doc_ref
