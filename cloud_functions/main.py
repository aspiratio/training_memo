import os
from datetime import datetime, timedelta, timezone, date
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


# TODO: Flaskに書き換える
def main(request):
    allowed_origins = ["http://localhost:3000", "https://training-memo.vercel.app"]
    origin = request.headers.get("Origin", "")

    headers = {
        "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "3600",
    }

    if origin in allowed_origins:
        headers["Access-Control-Allow-Origin"] = origin

    if request.method == "OPTIONS":
        return ("", 204, headers)

    if request.method == "GET":
        message = handle_get(request)
    elif request.method == "POST":
        message = handle_post(request)
    elif request.method == "DELETE":
        message = handle_delete(request)
    else:
        message = {"status": 405, "message": "Method Not Allowed"}

    return (message, 200, headers)


def handle_get(request):
    # リクエスト情報を取得する
    request_path = request.path

    # パスパラメータごとに処理を分ける
    if request_path == "/daily_record":
        try:
            docs = get_documents("daily_record")
            response = docs_to_json(docs)
        except Exception as e:
            logger.error(e, exc_info=True)
            return {"status": 500, "message": "取得に失敗しました"}
    elif request_path == "/menu":
        try:
            docs = get_documents("menu")
            response = docs_to_json(docs)
        except Exception as e:
            logger.error(e, exc_info=True)
            return {"status": 500, "message": "取得に失敗しました"}
    elif request_path == "/notify":
        try:
            response = notify_to_line()
        except Exception as e:
            logger.error(e, exc_info=True)
            return {"status": 500, "message": "通知に失敗しました"}
    else:
        logger.info("無効なパスパラメータでリクエストされました")
        return {"status": 404}

    return {"status": 200, "data": response}


def handle_post(request):
    # リクエスト情報を取得する
    request_path = request.path
    request_body = request.json

    # パスパラメータごとに処理を分ける
    if request_path == "/daily_record":
        try:
            doc_id = add_daily_record(request_body)
        except Exception as e:
            logger.error(e, exc_info=True)
            return {"status": 500, "message": "記録に失敗しました"}
    elif request_path == "/menu":
        try:
            doc_id = set_training_menu(request_body)
        except Exception as e:
            logger.error(e, exc_info=True)
            return {"status": 500, "message": "設定に失敗しました"}
    else:
        logger.info("無効なパスパラメータでリクエストされました")
        return {"status": 404}

    return {"status": 200, "id": doc_id}


def handle_delete(request):
    request_path = request.path
    purge_request_path = request_path.split(
        "/"
    )  # 例 [0]: "/", [1]: "daily_record", [2]: <id>
    print(purge_request_path)

    # 無効なパスパラメータでリクエストされた場合
    if len(purge_request_path) != 3 or purge_request_path[1] not in [
        "daily_record",
        "menu",
    ]:
        logger.info("無効なパスパラメータでリクエストされました")
        return {"status": 404}

    try:
        delete_document(purge_request_path[1], purge_request_path[2])
    except Exception as e:
        logger.error(e, exc_info=True)
        return {"status": 500, "message": "削除に失敗しました"}

    return {"status": 200}


def add_daily_record(request_body: dict):
    """
    トレーニング記録を追加する

    Parameters:
    - request_body (dict): リクエストボディ
        - menu (str): トレーニングメニュー
        - count (int): トレーニング回数や分数
        - date (date, optional): トレーニングした日付 (yyyy/mm/dd)

    Raises:
    - Exception: メニューが登録されていない場合
    - Exception: 複数のメニューが登録されている場合

    Returns:
    - record_id: 追加したドキュメントのID
    """
    menu_docs = list(get_documents("menu", "name", request_body["menu"]))

    if len(menu_docs) == 0:
        raise Exception("menu が登録されていません")
    elif len(menu_docs) > 1:
        raise Exception("menu が複数登録されています")

    menu_id = menu_docs[0].id
    request_date = request_body.get("date")

    # タイムゾーンの生成
    JST = timezone(timedelta(hours=+9), "JST")

    created_at = (
        datetime.now(JST)
        if request_date is None
        else datetime.strptime(request_date, "%Y/%m/%d")
    )

    data = {
        "count": request_body["count"],
        "menu_id": menu_id,
        "created_at": created_at,
        "updated_at": firestore.SERVER_TIMESTAMP,
    }

    record_id = set_document("daily_record", data).id

    return record_id


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

    Returns:
    - menu_id: 追加したドキュメントのID
    """

    data = {
        "name": request_body["name"],
        "unit": request_body["unit"],
        "weekly_quota": request_body["weekly_quota"],
        "created_at": firestore.SERVER_TIMESTAMP,
        "updated_at": firestore.SERVER_TIMESTAMP,
    }

    menu_docs = list(get_documents("menu", "name", request_body["name"]))
    if len(menu_docs) > 1:
        raise Exception("menu が複数登録されています")

    if len(menu_docs) == 0:
        menu_id = set_document("menu", data).id
    else:  # created_atだけ従来の値を残して上書きする
        menu_id = menu_docs[0].id
        old_data = docs_to_json(menu_docs)[0]
        data["created_at"] = old_data["created_at"]
        set_document("menu", data, menu_id)

    return menu_id


# Firestoreへのリクエスト
def get_documents(
    collection_name: str, field: str = None, operator: str = None, value: any = None
):
    """
    Firestoreから指定した検索条件に一致するドキュメントを取得する

    Parameters:
    - collection_name (str): コレクション名
    - field (str, optional): 検索に使うフィールド名
    - operator (str, optional): 比較演算子
    - value (any, optional): 検索する値

    Returns:
    - docs: 取得したドキュメントの参照リスト
    """

    collection_ref = root_doc.collection(collection_name)
    if field is None and value is None:
        docs = collection_ref.stream()
    else:
        docs = collection_ref.where(field, operator, value).stream()
    return docs


def set_document(collection_name: str, data: dict, doc_id: str = ""):
    """
    Firestoreにドキュメントを追加する。doc_idを指定すれば上書きする

    Parameters:
    - collection_name (str): コレクション名
    - data (dict): 追加するデータ
    - doc_id (str, optional): 上書きするドキュメントID

    Returns:
    - doc_ref: 追加したドキュメントの参照
    """
    collection_ref = root_doc.collection(collection_name)
    if doc_id == "":
        doc_ref = collection_ref.document()  # ドキュメントIDを自動生成する
    else:
        doc_ref = collection_ref.document(doc_id)

    doc_ref.set(data)
    logger.info(f"{collection_name}にデータを登録しました")

    return doc_ref


def delete_document(collection_name: str, doc_id: str):
    """
    Firestoreからドキュメントを削除する

    Parameters:
    - collection_name (str): コレクション名
    - doc_id (str): 削除するドキュメントID
    """
    collection_ref = root_doc.collection(collection_name)
    collection_ref.document(doc_id).delete()


def docs_to_json(docs):
    """
    Firestoreから取得した複数のドキュメントにidをつけてjsonに変換する

    Parameters:
    - docs: Firestoreから取得したドキュメント

    Returns:
    - json_data: APIのレスポンスとして返すJSON形式のデータ
    """
    json_data = []
    for doc in docs:
        doc_dict = doc.to_dict()
        doc_dict["id"] = doc.id  # ドキュメントIDを辞書に追加
        json_data.append(doc_dict)
    return json_data


def notify_to_line():
    # JST タイムゾーンの定義
    JST = timezone(timedelta(hours=+9), "JST")

    # 今日の日付を JST で取得
    today = datetime.now(JST).date()

    # 曜日を取得 (月曜日は0、日曜日は6)
    today_weekday = today.weekday()

    # 本日以前の最近月曜日を取得
    offset_days = today_weekday  # 月曜日からの日数差
    start_date = today - timedelta(days=offset_days)

    # 開始日の JST タイムスタンプを取得
    start_datetime = datetime.combine(start_date, datetime.min.time()).replace(
        tzinfo=JST
    )

    weekly_docs = get_documents("daily_record", "created_at", ">=", start_datetime)
    return docs_to_json(weekly_docs)
