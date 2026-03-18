from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_FILE = OUTPUT_DIR / "music-matie-app-summary.pdf"


def bullet(text):
    return Paragraph(f"&bull; {text}", STYLES["bullet"])


def section(title, body):
    items = [Paragraph(title, STYLES["section"]), Spacer(1, 0.05 * inch)]
    items.extend(body)
    items.append(Spacer(1, 0.08 * inch))
    return KeepTogether(items)


STYLESHEET = getSampleStyleSheet()
STYLES = {
    "title": ParagraphStyle(
        "title",
        parent=STYLESHEET["Title"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=21,
        textColor=colors.HexColor("#0f172a"),
        alignment=TA_LEFT,
        spaceAfter=0,
    ),
    "subtitle": ParagraphStyle(
        "subtitle",
        parent=STYLESHEET["BodyText"],
        fontName="Helvetica",
        fontSize=8.5,
        leading=11,
        textColor=colors.HexColor("#475569"),
        spaceAfter=0,
    ),
    "section": ParagraphStyle(
        "section",
        parent=STYLESHEET["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=10.5,
        leading=12,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=0,
    ),
    "body": ParagraphStyle(
        "body",
        parent=STYLESHEET["BodyText"],
        fontName="Helvetica",
        fontSize=8.4,
        leading=10.4,
        textColor=colors.HexColor("#111827"),
        spaceAfter=0,
    ),
    "bullet": ParagraphStyle(
        "bullet",
        parent=STYLESHEET["BodyText"],
        fontName="Helvetica",
        fontSize=8.1,
        leading=9.8,
        leftIndent=10,
        firstLineIndent=-7,
        textColor=colors.HexColor("#111827"),
        spaceAfter=1,
    ),
    "small": ParagraphStyle(
        "small",
        parent=STYLESHEET["BodyText"],
        fontName="Helvetica",
        fontSize=7.5,
        leading=9.2,
        textColor=colors.HexColor("#334155"),
        spaceAfter=0,
    ),
}


def build_story():
    story = [
        Paragraph("Music Matie App", STYLES["title"]),
        Spacer(1, 0.05 * inch),
        Paragraph(
            "One-page repo summary based on source files in client/ and server/.",
            STYLES["subtitle"],
        ),
        Spacer(1, 0.1 * inch),
        HRFlowable(width="100%", thickness=0.8, color=colors.HexColor("#cbd5e1")),
        Spacer(1, 0.12 * inch),
    ]

    story.extend(
        [
            section(
                "What It Is",
                [
                    Paragraph(
                        "A full-stack music discovery app that lets signed-in users search YouTube music videos, play them in-app, and organize picks into personal playlists. "
                        "The frontend is a React single-page app and the backend is an Express API with Google OAuth, JWT-based auth, and MongoDB persistence.",
                        STYLES["body"],
                    )
                ],
            ),
            section(
                "Who It's For",
                [
                    Paragraph(
                        "Primary persona: a logged-in music fan who wants to search tracks quickly, save favorites, and curate lightweight playlists around YouTube video results.",
                        STYLES["body"],
                    )
                ],
            ),
            section(
                "What It Does",
                [
                    bullet("Signs users in with Google OAuth and protects app routes with JWT-backed auth."),
                    bullet("Searches YouTube music videos through a backend `/api/search` endpoint."),
                    bullet("Plays selected videos in embedded YouTube iframes, including a persistent player."),
                    bullet("Creates, renames, opens, and deletes user playlists stored in MongoDB."),
                    bullet("Adds and removes songs inside playlists, with duplicate checks on the server."),
                    bullet("Lets users queue songs for simple similarity-based result reordering."),
                    bullet("Stores saved songs and display/preferences locally in browser storage."),
                ],
            ),
            section(
                "How It Works",
                [
                    Paragraph(
                        "React client: `App.js` wires protected routes for Home, Playlists, Songs, and Preferences; `AuthContext` loads the current user via `/api/auth/me`; `PlayerContext` keeps the active song in session storage. "
                        "API wrappers call Express endpoints under `/api/auth`, `/api/search`, and `/api/playlists`, retrying once after `/api/auth/refresh` on 401. "
                        "Express server: `server.js` registers auth, search, and playlist routes; auth controller handles Google OAuth callback, JWT issuance, refresh cookies, and `/me`; playlist controller persists playlists and song metadata in MongoDB via Mongoose. "
                        "External services/data flow: Google OAuth authenticates users, YouTube Data API search returns video metadata, MongoDB stores users and playlists, and browser localStorage stores preferences and saved songs.",
                        STYLES["body"],
                    ),
                    Spacer(1, 0.04 * inch),
                    Paragraph(
                        "Not found in repo: deployment architecture, production hosting target, environment template file mentioned as `.env.dist` in the root README.",
                        STYLES["small"],
                    ),
                ],
            ),
            section(
                "How To Run",
                [
                    bullet("Create env files or variables. Repo evidence shows the app needs at least `REACT_APP_API_URL` on the client and `MONGO_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, and `YOUTUBE_API_KEY` on the server. `CLIENT_URL` and `JWT_REFRESH_SECRET` are optional fallbacks in code."),
                    bullet("Install dependencies in both apps: run `npm install` in `client/` and `server/`."),
                    bullet("Start the backend: run `npm start` in `server/` (or `npm run dev` for nodemon)."),
                    bullet("Start the frontend: run `npm start` in `client/`, then open `http://localhost:3000`."),
                ],
            ),
            Paragraph(
                "Evidence basis: README.md, client/src/*, server/server.js, server/src/routes/*, server/src/controllers/*, server/src/models/*, and server/src/utils/youtubeService.js.",
                STYLES["small"],
            ),
        ]
    )
    return story


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    doc = SimpleDocTemplate(
        str(OUTPUT_FILE),
        pagesize=letter,
        leftMargin=0.58 * inch,
        rightMargin=0.58 * inch,
        topMargin=0.52 * inch,
        bottomMargin=0.45 * inch,
        title="Music Matie App Summary",
        author="Codex",
    )
    doc.build(build_story())
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()
