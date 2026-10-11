"""Build the two-page professional CV. Requires reportlab; run from any directory."""

from pathlib import Path
from shutil import copyfile

import reportlab
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import HRFlowable, PageBreak, Paragraph, SimpleDocTemplate, Spacer
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output/pdf/Ifeanyi_Desmond_Dike_Professional_CV.pdf"
INK = colors.HexColor("#172B3A")
MUTED = colors.HexColor("#52616B")
BLUE = colors.HexColor("#185D7A")
FONT_DIR = Path(reportlab.__file__).parent / "fonts"
pdfmetrics.registerFont(TTFont("CV", str(FONT_DIR / "Vera.ttf")))
pdfmetrics.registerFont(TTFont("CV-Bold", str(FONT_DIR / "VeraBd.ttf")))
pdfmetrics.registerFontFamily("CV", normal="CV", bold="CV-Bold")
STYLES = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=22, leading=25, textColor=INK, spaceAfter=5),
    "title": ParagraphStyle("title", fontName="Helvetica", fontSize=12, leading=16, textColor=BLUE, spaceAfter=6),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=9, leading=13, textColor=MUTED),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=10, leading=13, textColor=BLUE, spaceBefore=12, spaceAfter=6, keepWithNext=True),
    "job": ParagraphStyle("job", fontName="Helvetica-Bold", fontSize=10.5, leading=14, textColor=INK, spaceBefore=7, spaceAfter=2, keepWithNext=True),
    "meta": ParagraphStyle("meta", fontName="Helvetica", fontSize=9, leading=12, textColor=MUTED, spaceAfter=5, keepWithNext=True),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10, leading=13.5, textColor=INK, spaceAfter=5, alignment=TA_LEFT),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=10, leading=13.5, textColor=INK, leftIndent=10, firstLineIndent=-10, spaceAfter=5),
}
for style in STYLES.values():
    style.fontName = "CV-Bold" if style.fontName == "Helvetica-Bold" else "CV"


def link(url, label):
    return f'<a href="{url}" color="#185D7A">{label}</a>'


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D5DFE4"))
    canvas.line(44, 35, A4[0] - 44, 35)
    canvas.setFont("CV", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(44, 23, "Ifeanyi Desmond Dike | Professional CV")
    canvas.drawRightString(A4[0] - 44, 23, str(doc.page))
    canvas.restoreState()


def build():
    story = []

    def p(text, style="body"):
        story.append(Paragraph(text, STYLES[style]))

    def job(company, role, dates, location="Remote"):
        p(f"{company} | {role}", "job")
        p(f"{dates} | {location}", "meta")

    def bullet(text):
        p(f"- {text}", "bullet")

    p("IFEANYI DESMOND DIKE", "name")
    p("Senior Software Engineer | Voice AI &amp; Distributed Systems", "title")
    p("Port Harcourt, Nigeria | " + link("mailto:ifeanyi@ifeanyidike.com", "ifeanyi@ifeanyidike.com"), "contact")
    p(" | ".join([
        link("https://ifeanyidike.com", "ifeanyidike.com"),
        link("https://github.com/ifeanyidike", "github.com/ifeanyidike"),
        link("https://linkedin.com/in/ifeanyidesmonddike", "LinkedIn: ifeanyidesmonddike"),
    ]), "contact")
    story.append(Spacer(1, 10))
    story.append(HRFlowable(width="100%", thickness=1, color=BLUE))

    p("PROFILE", "section")
    p("Software engineer with <b>9+ years of experience</b> building backend services, real-time media and AI products. Owns voice infrastructure from telephony and streaming speech through LLM orchestration, deployment and evaluation. Recent work includes on-demand call capacity, distributed scheduling and multilingual voice agents. Strong Python, Go and TypeScript background, with production systems supporting up to 10,000 concurrent connections.")

    p("TECHNICAL SKILLS", "section")
    p("<b>Languages &amp; backend:</b> Python, asyncio, Go, TypeScript, FastAPI, gRPC, REST, PostgreSQL, Redis, MongoDB, RQ background workers.")
    p("<b>Voice &amp; AI:</b> Pipecat, Twilio, WebSockets, WebRTC, streaming STT/TTS, VAD, turn-taking, LLM tool use, RAG, evaluation, PyTorch, Hugging Face.")
    p("<b>Infrastructure:</b> Fly.io, Docker, Kubernetes, AWS, GCP, Azure, CI/CD, observability, distributed systems and multi-tenant services.")

    p("PROFESSIONAL EXPERIENCE", "section")
    job("DataStrut AI", "Founding AI Engineer / Senior Software Engineer", "Aug 2025 - Present")
    bullet("Own the production voice platform across telephony, streaming speech, LLM orchestration and post-call processing; migrated managed voice infrastructure to a self-hosted Python/Pipecat stack.")
    bullet("Scaled from fixed shared capacity to an on-demand Fly Machines pool with per-call isolation, atomic Redis reservations, capacity-aware routing and warm capacity reserved for inbound calls.")
    bullet("Built safe machine drain, resume and release lifecycles that account for call setup and post-call work; fenced delayed callbacks to protect newer reservations.")
    bullet("Separated outbound scheduling from report generation with dedicated RQ workers. Added asynchronous, idempotent call triggers and capacity-aware retries to avoid duplicate dials and queue contention.")
    bullet("Designed production-informed load tests and CPU, memory, Redis-connection and report-throughput models to identify bottlenecks and guide capacity planning.")
    bullet("Delivered English/Spanish voice workflows across speech recognition, synthesis, prompts, recovery messages and post-call reporting.")
    bullet("Built response-admission controls, echo-aware turn-taking and deterministic regression tests; added playback-aligned traces and recordings to distinguish generated speech from what callers heard.")

    job("Cenphi", "Co-Founder and Lead Developer", "Mar 2025 - Present")
    bullet("Built an asynchronous video-production pipeline with Python, FastAPI, Whisper, diarization, LLMs and FFmpeg; added job orchestration, provider fallback and live progress updates.")
    bullet("Developed segment-based story composition and artifact tracking, reducing manual review by approximately 80%.")

    story.append(PageBreak())
    p("PROFESSIONAL EXPERIENCE - CONTINUED", "section")
    job("Fynance Hub", "Technical Lead", "Oct 2024 - Present", "Remote, part-time")
    bullet("Lead backend architecture and delivery using Go, Python, gRPC, PostgreSQL and Redis for real-time financial services.")
    bullet("Built retrieval-augmented recommendations and automated voice-verification workflows, from service design through deployment.")

    job("Arbor Platform Inc.", "Senior Software Engineer", "Feb 2023 - Oct 2024")
    bullet("Built Claude/OpenAI-powered video workflows that reduced production time by 60% and improved throughput by 80%.")
    bullet("Delivered text-to-video, transcription, content-studio and asset-management features across React/TypeScript interfaces, backend APIs and cloud services.")

    job("Howdy Learning", "Senior Software Development Engineer", "May 2020 - Mar 2023")
    bullet("Reduced WebSocket network traffic by more than 99% through real-time communication optimizations.")
    bullet("Built live-video infrastructure supporting up to 10,000 concurrent connections and chat serving approximately 100 communities.")
    bullet("Delivered embedded video, voice, chat and single sign-on integrations for more than 100 customers.")

    job("Bujuwa Nigeria Limited", "Software Developer", "Jul 2018 - Dec 2019", "Abuja, Nigeria")
    bullet("Delivered web and mobile assessment systems, covering requirements, application architecture and implementation.")

    p("OPEN SOURCE &amp; SELECTED ENGINEERING WORK", "section")
    p("<b>Pipecat:</b> Diagnosed and reported stale-generation failures in the Anthropic integration, with reproduction evidence in "
      + link("https://github.com/pipecat-ai/pipecat/issues/5035", "#5035") + " and "
      + link("https://github.com/pipecat-ai/pipecat/issues/5036", "#5036")
      + "; maintainers resolved #5036 through upstream "
      + link("https://github.com/pipecat-ai/pipecat/pull/5041", "PR #5041") + ".")
    p("<b>Acoustic Turn-over Rate (ATR):</b> Developed an ASR-independent voice-agent evaluation metric. On controlled audio, ASR-based estimates diverged by up to 23.5 percentage points; three VAD backends agreed within 7.6 points. "
      + link("https://github.com/ifeanyidike/atr-metric", "Code") + " | "
      + link("https://doi.org/10.5281/zenodo.20548903", "Research artifact") + ".")
    p("<b>Full-Duplex-Bench reproduction:</b> Investigated ASR sensitivity in voice-agent evaluation, finding up to 62x metric variation across ASR backends on the same audio. "
      + link("https://github.com/ifeanyidike/full-duplex-bench-repro", "Code and results") + ".")
    p("<b>TubeForge:</b> Built an open-source video workflow backend with Python, FastAPI, SQLAlchemy, FFmpeg, WebSocket progress and provider fallback. "
      + link("https://github.com/ifeanyidike/tubeforge", "Source code") + ".")
    p("<b>Technical writing:</b> Publish practical investigations of voice-agent concurrency, interrupted speech and turn-taking at "
      + link("https://ifeanyidike.com/blog/", "ifeanyidike.com/blog") + ".")

    p("EDUCATION", "section")
    p("<b>M.Sc., Financial Engineering</b> | WorldQuant University | 2026 - Present (in progress)")
    p("<b>B.Tech., Applied Mathematics, First Class</b> | Federal University of Technology, Akure | 2018<br/>GPA: 4.63/5.00. National university mathematics competition: Gold (2017), Bronze (2016).")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=44, leftMargin=44,
                            topMargin=36, bottomMargin=46, title="Ifeanyi Desmond Dike - Professional CV",
                            author="Ifeanyi Desmond Dike")
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    copyfile(OUTPUT, ROOT / "assets/pdf/ifeanyi_dike_professional_cv.pdf")
    copyfile(OUTPUT, ROOT / "Ifeanyi_Desmond_Dike_Resume.pdf")
    print(OUTPUT)


if __name__ == "__main__":
    build()
