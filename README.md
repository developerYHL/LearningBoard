## Goal

* Nodejs 를 활용한 TMI 게시판 사이트 개발

### 개발환경

* Nodejs
* Express
* React
* Mongodb

## 화면흐름도

![image.png](https://github.com/developerYHL/LearningBoard/blob/master/README_Image/screenFlow.png)



## Project Structure

### API_Server

1. .env
   * 환경변수 파일
    <details>
    <summary></summary>
    <div markdown="1">

    |key|value|
    |--|--|
    |keyLength|64|
    |encodingType|base64|
    |iterations|101652|
    |digest|sha512|

    </div>
    </details>
2. node_modules
   * npm으로 Node.js dependency 추가 시 자동 생성되는 폴더
   * 프로젝트에 필요한 Node.js 모듈들이 저장되어있는 폴더
3. package-lock.json
    * npm을 사용한 node_modules, package.json의 의존성 트리에 대한 정보
4. package.json
    * npm dependencies 패키지 모듈 관리
5. server.js
    * 환경변수 설정
    * API Server 실행
6. routes
    1. memberRouter.js
        * 회원 관련 API 제공
    2. boardRouter.js
        * 게시글 관련 API 제공
    3. commentRouter.js
        * 댓글 관련 API 제공
7. schemas
    1. index.js
        * Database 연결
    2. user.js
        * 회원 스키마 정의
    3. board.js
        * 게시판 스키마 정의
    4. comment.js
        * 댓글 스키마 정의

### WEB_Server

1. node_modules
    * npm으로 Node.js dependency 추가 시 자동 생성되는 폴더
    * 프로젝트에 필요한 Node.js 모듈들이 저장되어있는 폴더
2. package-lock.json
    * npm을 사용한 node_modules, package.json의 의존성 트리에 대한 정보
3. package.json
    * npm dependencies 패키지 모듈 관리
4. public
    1. index.html
        * react를 이용해 렌더링 할 컴포넌트들이 위치하는 html 파일
    2. favicon.ico
        * react 설치 시 기본으로 제공하는 favicon 아이콘 파일
5. src
    1. css
        * 스타일 시트가 들어있는 폴더
    2. index.jsx
        * Webpack 모듈에서 가장 처음으로 읽어들일 파일
    3. Header.jsx
        * Header 레이아웃 컴포넌트
    4. Body.jsx
        * Body 레이아웃 컴포넌트
    5. Footer.jsx
        * Footer 레이아웃 컴포넌트
    6. LoginForm.jsx
        * 로그인 관련 컴포넌트
    7. BoardForm.jsx
        * 게시글 목록 관련 컴포넌트
    8. BoardWriteForm.jsx
        * 게시글 수정 및 작성 관련 컴포넌트
    9. BoardDetail.jsx
        * 게시글 상세 관련 컴포넌트
    10. BoardComment.jsx
        * 게시글 댓글 관련 컴포넌트
    11. NotFoundPage.jsx
        * 잘못된 경로 관련 컴포넌트

## 핵심 코드
### API_Server
**./.env**
```
keyLength=64
encodingType=base64
iterations=101652
digest=sha512
```
* 비밀번호 암호화 관련 변수

**./server.js**
```
dotenv.config({
  path: path.resolve(
    process.cwd(),
    process.env.NODE_ENV == "production" ? ".env" : ".env.dev"
  )
});

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};

app.listen(8080, () => {
  console.log("Server Start !!!");
});
```
* 프로젝트 버전에 맞게 환경변수 설정
* express CORS 요청 허가
* 8080포트 서버 실행

**./routes/memberRouter.js**
```
router.post("/join", async (req, res) => {
...
});

router.post("/login", async (req, res) => {
...
});
```
* 회원가입(join) : 이메일과 닉네임 중복 확인 후 회원 정보 저장
* 로그인(login) : 이메일로 회원 정보 검색 후 비밀번호를 같은 방식의 암호화 시켜 DB에 들어있는 비밀번호와 비교 후 로그인

**./routes/boardRouter.js**
```
router.post("/write", async (req, res) => {
...
});

router.post("/detail", async (req, res) => {
...
});

router.post("/update", async (req, res) => {
...
});

router.post("/delete", async (req, res) => {
...
});

router.post("/getBoardList", async (req, res) => {
...
});

router.get("/getLastPage", async (req, res) => {
...
});

router.post("/getAssessmentCnt", async (req, res) => {
...
});

router.post("/addAssessmentCnt", async (req, res) => {
...
});
```
* 작성(write) : 작성한 게시글의 정보들 저장
* 상세(detail) : 요청한 게시글의 정보를 불러옴
* 갱신(update) : 수정하기를 원하는 게시글 제목, 내용 수정
* 삭제(delete) : 요청한 게시글 삭제
* 게시판 목록(getBoardList) : 요청한 페이지의 게시글 목록을 불러옴 (현재 1페이지당 3개의 게시글)
* 마지막 페이지 수(getLastPage) : 게시판 목록 화면에 표시 될 총 페이지 수
* 평가 수(getAssessmentCnt) : 요청한 게시글의 좋아요와 싫어요의 수
* 평가 추가(getAssessmentCnt) : 요청한 게시글을 평가

**./routes/commentRouter.js**
```
router.post("/write", async (req, res) => {
...
});

router.post("/detail", async (req, res) => {
...
});

router.post("/update", async (req, res) => {
...
});

router.post("/delete", async (req, res) => {
...
});

router.post("/getCommentList", async (req, res) => {
...
});
```
* 작성(write) : 요청한 댓글 정보 저장
* 상세(detail) : 요청한 댓글의 정보를 불러옴
* 갱신(update) : 수정하기를 원하는 댓글의 내용 수정
* 삭제(delete) : 요청한 댓글 삭제
* 댓글 목록(getCommentList) : 해당 게시글의 모든 댓글 목록을 불러옴

**./schemas/user.js**
```
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  nickName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
  ...
});
```
* Mongoose라는 ODM(Object Data Mapping) 라이브러리를 이용해 데이터를 넣기 전 스키마를 기준으로 검사 (board.js, comment.js 동일)
* user 스키마 : email, nickName, password, salt, createdAt
* board 스키마 : writer, nickName, title, content, createdAt, likeCnt, badCnt, assessmentUser
* comment 스키마 : board, writer, nickName, content, tag

**./schemas/index.js**
```
const connect = () => {
    mongoose.set("debug", true);
    mongoose.set('useCreateIndex', true);
    mongoose.connect(
      "mongodb://localhost:27017/project",
      {
        dbName: "project",
        useNewUrlParser: true,
        useUnifiedTopology: true
      },
      error => {
        if (error) {
          console.log("DB connect error", error);
        } else {
          console.log("DB connect!!!");
        }
      }
    );
    
  mongoose.connection.on("error", error => {
    console.log("DB connect error", error);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("DB disconnected, Retry Connection");
    connect();
  });
```
* mongoose 설정 및 db 연결
* connection의 상태 이벤트 리스너 추가

### WEB_Server
**./public/index.html**
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>한성 R&D</title>
</head>

<body>
    <div id="container"></div>
</body>

</html>
```
* react를 이용해 렌더링 할 컴포넌트들이 위치하는 html 파일

**./src/css/style.css**
```
/* Example Styles for React Tags*/
div.ReactTags__tags {
    position: relative;
}

/* Styles for the input */
div.ReactTags__tagInput {
    width: 200px;
    border-radius: 2px;
    display: inline-block;
}
...
```
* 리엑트 컴포넌트에서 사용할 스타일 시트

**./src/index.jsx**
```
ReactDOM.render(
  <HashRouter>
    <Header />
    <Body />
    <Footer />
  </HashRouter>,
  document.querySelector("#container")
);
```
*  ReactDOM.render()안의 엘리먼트들은 루트 DOM 노드에서 렌더링 됨
*  페이지를 Header, Body, Footer의 세 가지 영역으로 나눔
   *  ![image.png](https://github.com/developerYHL/LearningBoard/blob/master/README_Image/page1.png)

**참고자료**
![image.png](https://github.com/developerYHL/LearningBoard/blob/master/README_Image/page2.png)
![image.png](https://github.com/developerYHL/LearningBoard/blob/master/README_Image/page3.png)
![image.png](https://github.com/developerYHL/LearningBoard/blob/master/README_Image/page4.png)
