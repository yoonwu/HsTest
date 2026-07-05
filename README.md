# 송한식 — Actor Portfolio

배우 프로필 전용 원페이지 웹사이트. 제작자·캐스팅 디렉터에게 보여주기 위한 시네마틱 느와르 컨셉의 정적 사이트입니다.

## 구성

| 탭 | 내용 |
|---|---|
| 01 프로필 사진 | 스튜디오 프로필 컷 3장 |
| 02 일상 사진 | 촬영 현장 · 무대 뒤 사진 5장 |
| 03 연기 영상 | 독백 연기 영상 (02:01) |
| 04 스냅 · 스틸컷 | 영상에서 추출한 스틸 6장 — 클릭 시 해당 장면부터 재생 |

## 로컬 실행

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

## 배포 (GitHub Pages)

저장소 Settings → Pages → Branch를 배포할 브랜치로 지정하면 바로 서비스됩니다. 빌드 과정이 없는 순수 정적 사이트입니다.

## 수정 포인트

- **이름/이메일 변경**: `index.html`에서 `송한식`, `SONG HANSIK`, `thdghkstlr@gmail.com` 검색 후 수정
- **사진 교체**: `assets/img/`의 파일을 같은 이름으로 교체
- **영상 교체**: `assets/video/acting-reel.mp4` 교체 (스틸컷 타임코드는 `index.html`의 `data-time` 속성으로 조정)
- **포인트 컬러 변경**: `css/style.css` 상단 `--red` 변수
