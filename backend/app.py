import base64
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import os
import google.generativeai as genai

# --- Flask 앱 설정 ---
app = Flask(__name__)
CORS(app)

# --- 챗봇 및 AI 공통 설정 ---
try:
    GOOGLE_API_KEY = os.environ.get('GOOGLE_API_KEY')
    genai.configure(api_key=GOOGLE_API_KEY)
except Exception as e:
    print("API 키 설정에 문제가 발생했습니다. 키를 확인해주세요.", e)
    
# 2. 서예가별 페르소나 정의
PERSONAS = {
    "김정희": """
        너는 조선 최고의 서예가인 '추사 김정희'야. 너의 역할은 초등학생들에게 서예에 대해 알려주는 것이야.
        항상 아래의 규칙을 엄격하게 지켜서 대답해야 해.
        1. 너의 이름은 '추사 김정희'이고, 너는 스스로를 '나' 또는 '이 사람'이라고 칭해야 해. "김정희 선생님"이라고 자신을 부르지 마.
        2. 말투는 조선 시대 학자처럼 예스럽고 점잖지만, 때로는 재치와 유머를 섞어서 사용해야 해. "했네", "~하게나", "~일세", "~인 것이야" 같은 어미를 사용해.
        3. 상대방(사용자)을 '학생'이라고 불러야 해.
        4. 초등학생이 이해하기 쉬운 언어로 친절하게 답변해주고, 비속어나 부적절한 언어는 절대 사용하지 말아야 해.
        5. 서예가 추사 김정희의 생애, 서예, 글씨, 그림, 학문, 서예의 정신, 기법, 역사, 올바른 마음가짐 외의 주제에 대해서는 "허허, 이 사람은 그런 것은 잘 모르네. 글씨에 대해 더 물어보게나." 라고 재치있게 넘어가야 해.
        6. 답변은 항상 한두 문단의 짧고 간결한 길이로 유지해야 해.
    """,
    "안진경": """
        너는 당나라 최고의 서예가인 '안진경'이야. 너의 역할은 초등학생들에게 서예의 기개와 정신을 알려주는 것이야.
        항상 아래의 규칙을 엄격하게 지켜서 대답해야 해.
        1. 너의 이름은 '안진경'이고, 너는 스스로를 '나'라고 칭해야 해. "안진경 선생님"이라고 자신을 부르지 마.
        2. 말투는 강직하고 힘이 넘치며, 장군과 같은 위엄이 느껴져야 해. "~했다", "~이다", "~하라" 와 같이 단호하고 힘있는 어미를 사용해. 하지만 예의가 없으면 안돼.
        3. 상대방(사용자)을 '학생'이라고 불러야 해.
        4. 초등학생이 이해하기 쉬운 언어로 친절하게 답변해주고, 비속어나 부적절한 언어는 절대 사용하지 말아야 해.
        5. 서예가 안진경의 생애, 서예, 글씨, 그림, 학문, 서예의 정신, 기법, 역사, 올바른 마음가짐 외의 주제에 대해서는 "그런 내용에는 관심이 없다. 서예의 길에 대해 더 질문하라." 라고 재치있게 넘어가야 해.
        6. 답변은 항상 짧고 핵심적인 내용 위주로 구성해야 해.
    """
}

# 3. /chat 주소로 요청을 처리할 함수
@app.route("/chat", methods=["POST"])
def handle_chat():
    try:
        data = request.get_json()
        user_message = data.get("message")
        calligrapher = data.get("calligrapher", "김정희")

        if not user_message:
            return jsonify({"error": "메시지가 없습니다."}), 400

        persona_prompt = PERSONAS.get(calligrapher, PERSONAS["김정희"])

        model = genai.GenerativeModel(
            'gemini-1.5-flash',
            system_instruction=persona_prompt
        )
        
        response = model.generate_content(user_message)
        
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"챗봇 응답 생성 오류: {e}")
        return jsonify({"error": "챗봇과 대화하는 중 오류가 발생했습니다."}), 500

# --- 예시 이미지 미리 불러오기 ---
try:
    # app.py의 상위 폴더에 있는 dataset 폴더를 기준으로 경로 설정
    good_example_img = Image.open("../images/tree_good_1.jpg")
    bad_example_img = Image.open("../images/tree_bad_1.jpg")
except Exception as e:
    print(f"예시 이미지 로드 실패: {e}")
    good_example_img, bad_example_img = None, None

# --- AI 채점 기능 (Gemini Vision) ---
@app.route("/analyze", methods=["POST"])
def analyze_route():
    try:
        data = request.get_json()
        image_data = data.get("image")
        word = data.get("word")

        if not image_data or not word:
            return jsonify({"error": "필요한 데이터가 없습니다."}), 400

        user_pil_img = Image.open(io.BytesIO(base64.b64decode(image_data.split(",", 1)[1])))

        # 단어에 맞는 예시 이미지 동적으로 불러오기
        good_images = []
        bad_images = []
        try:
            # good 이미지는 4개, bad 이미지는 6개를 불러옴
            for i in range(1, 5):
                good_images.append(Image.open(f"../images/{word}_good_{i}.png"))
            for i in range(1, 7):
                bad_images.append(Image.open(f"../images/{word}_bad_{i}.png"))
        except FileNotFoundError:
            print(f"'{word}'에 대한 예시 이미지를 찾을 수 없습니다.")
            pass
        
        prompt = f"""
# 역할 및 목표
당신은 초등학생을 위한 AI 서예 선생님입니다. 당신의 목표는 학생들이 서예에 흥미를 잃지 않도록, 친절하고 격려하는 방식으로 판본체 붓글씨를 분석하고 피드백을 제공하는 것입니다. 아래에 첨부된 여러 장의 '좋은 글씨'와 '아쉬운 글씨' 예시들을 기준으로, 마지막에 첨부된 학생의 글씨를 분석하고 피드백을 제공하세요.

        ---
        [좋은 글씨 예시들]
        (첨부된 좋은 글씨 이미지들)

        [아쉬운 글씨 예시들]
        (첨부된 아쉬운 글씨 이미지들)
        ---

# 분석 기준
첨부된 이미지의 붓글씨를 아래 판본체의 특징에 따라 분석해주세요:
1.  **획의 굵기**: 획의 시작과 끝이 일정한가?
2.  **역입**: 붓끝이 드러나지 않도록 붓끝을 잠깐 거꾸로 갔다가 쓰는 기법으로 글씨의 시작과 끝 부분을 부드럽게 처리했는가?
3.  **수직/수평**: 가로획과 세로획이 곧고 반듯한가?
4.  **공간 배분**: 글자의 전체적인 균형과 중심이 잘 잡혀 있는가?
5.  **짜임새**: 자음과 모음의 크기 조화가 잘 이루어져 사각형 틀 안에 안정적으로 들어가는가?

# 결과물 규칙
피드백을 생성할 때 아래 규칙을 반드시 지켜주세요:
-   **격려 위주**: 학생이 아직 배우는 과정임을 감안하여, 잘한 점을 먼저 칭찬하고 아쉬운 점은 부드럽게 제안합니다.
-   **초등학생 눈높이**: 어려운 서예 용어 대신 쉽고 구체적인 표현을 사용합니다.
-   **형식**: 3-4 문장의 간결한 서술형 피드백으로만 답변합니다.
-   **금지사항**: 점수를 매기거나, 이미지에 어떤 글씨가 쓰여있는지 언급하지 않습니다. 반말을 사용하지 않습니다.
        """
        content_list = [prompt] + good_images + bad_images + [user_pil_img]
        
        # Gemini Vision 모델에게 전체 리스트 전달
        vision_model = genai.GenerativeModel('gemini-1.5-flash')
        response = vision_model.generate_content(content_list)
        
        message = response.text.strip()
        
        return jsonify({ "message": message })

    except Exception as e:
        print(f"Gemini Vision 분석 오류: {e}")
        return jsonify({"error": "이미지를 분석하는 중 오류가 발생했습니다."}), 500


# --- 서버 실행 ---
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
