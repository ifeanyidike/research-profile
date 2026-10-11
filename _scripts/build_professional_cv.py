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
INK = colors.HexColor("#242C33")
MUTED = colors.HexColor("#65717A")
BLUE = colors.HexColor("#29485E")
FONT_DIR = Path("/System/Library/Fonts/Supplemental")
if (FONT_DIR / "Arial.ttf").exists():
    regular_font, bold_font = FONT_DIR / "Arial.ttf", FONT_DIR / "Arial Bold.ttf"
else:
    FONT_DIR = Path(reportlab.__file__).parent / "fonts"
    regular_font, bold_font = FONT_DIR / "Vera.ttf", FONT_DIR / "VeraBd.ttf"
pdfmetrics.registerFont(TTFont("CV", str(regular_font)))
pdfmetrics.registerFont(TTFont("CV-Bold", str(bold_font)))
pdfmetrics.registerFontFamily("CV", normal="CV", bold="CV-Bold")
STYLES = {
    "name": ParagraphStyle("name", fontName="Helvetica-Bold", fontSize=26, leading=30, textColor=INK, spaceAfter=7),
    "title": ParagraphStyle("title", fontName="Helvetica", fontSize=11.5, leading=16, textColor=BLUE, spaceAfter=8),
    "contact": ParagraphStyle("contact", fontName="Helvetica", fontSize=9, leading=13, textColor=MUTED),
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=BLUE, spaceBefore=13, spaceAfter=5, keepWithNext=True),
    "job": ParagraphStyle("job", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=INK, spaceBefore=8, spaceAfter=3, keepWithNext=True),
    "meta": ParagraphStyle("meta", fontName="Helvetica", fontSize=9, leading=12, textColor=MUTED, spaceAfter=5, keepWithNext=True),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.2, leading=14.3, textColor=INK, spaceAfter=6, alignment=TA_LEFT),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=10.2, leading=14.3, textColor=INK, leftIndent=10, firstLineIndent=-10, spaceAfter=5),
}
for style in STYLES.values():
    style.fontName = "CV-Bold" if style.fontName == "Helvetica-Bold" else "CV"


def link(url, label):
    return f'<a href="{url}" color="#185D7A">{label}</a>'


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#D5DFE4"))
    canvas.line(48, 35, A4[0] - 48, 35)
    canvas.setFont("CV", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(48, 23, "Ifeanyi Desmond Dike")
    canvas.drawRightString(A4[0] - 48, 23, f"{doc.page} / 2")
    canvas.restoreState()


def build():
    story = []

    def p(text, style="body"):
        story.append(Paragraph(text, STYLES[style]))
        if style == "section":
            rule = HRFlowable(width="100%", thickness=0.4, color=colors.HexColor("#CBD3D9"), spaceAfter=6)
            rule.keepWithNext = True
            story.append(rule)

    def job(company, role, dates, location="Remote"):
        p(company, "job")
        p(f"{role} | {dates} | {location}", "meta")

    def bullet(text):
        p(f"&#8226; {text}", "bullet")

    p("Ifeanyi Desmond Dike", "name")
    p("Senior Software Engineer | Voice AI &amp; Distributed Systems", "title")
    p("Port Harcourt, Nigeria | " + link("mailto:ifeanyi@ifeanyidike.com", "ifeanyi@ifeanyidike.com"), "contact")
    p(" | ".join([
        link("https://ifeanyidike.com", "ifeanyidike.com"),
        link("https://github.com/ifeanyidike", "github.com/ifeanyidike"),
        link("https://linkedin.com/in/ifeanyidesmonddike", "LinkedIn: ifeanyidesmonddike"),
    ]), "contact")
    story.append(Spacer(1, 3))

    p("PROFILE", "section")
    p("Software engineer with <b>9+ years of experience</b> building backend services, real-time media and AI products. Owns voice infrastructure from telephony and streaming speech to deployment and evaluation. Recent work spans on-demand call capacity, distributed scheduling and multilingual agents. Strong Python, Go and TypeScript background; built production systems supporting up to 10,000 concurrent connections.")

    p("TECHNICAL SKILLS", "section")
    p("<b>Languages &amp; backend:</b> Python, asyncio, Go, TypeScript, FastAPI, gRPC, REST, PostgreSQL, Redis, MongoDB, RQ background workers.")
    p("<b>Voice &amp; AI:</b> Pipecat, Twilio, WebSockets, WebRTC, streaming STT/TTS, VAD, turn-taking, LLM tool use, RAG, evaluation, PyTorch, Hugging Face.")
    p("<b>Infrastructure:</b> Fly.io, Docker, Kubernetes, AWS, GCP, Azure, CI/CD, observability, distributed systems and multi-tenant services.")

    p("PROFESSIONAL EXPERIENCE", "section")
    job("DataStrut AI", "Founding AI Engineer / Senior Software Engineer", "Aug 2025 - Present")
    bullet("Own the production voice platform across telephony, streaming speech, LLM orchestration and post-call processing; migrated managed voice infrastructure to a self-hosted Python/Pipecat stack.")
    bullet("Scaled fixed shared capacity into an on-demand Fly Machines pool with per-call isolation, atomic Redis reservations and reserved inbound capacity. Added safe drain/resume lifecycles and fenced callbacks to protect active calls and newer reservations.")
    bullet("Separated outbound scheduling from report generation with dedicated RQ workers. Added asynchronous, idempotent call triggers and capacity-aware retries to avoid duplicate dials and queue contention.")
    bullet("Built capacity models and load tests spanning CPU, memory, Redis and report throughput. Validated event ingestion with <b>6,000 successful synthetic requests</b> across four load levels; identified Redis connections as the first call-routing constraint.")
    bullet("Cut steady-state STT session usage by <b>about 67% (3 to 1 per call)</b> in three-agent workflows by tying sessions to agent activation. Delivered English/Spanish support across recognition, synthesis, prompts and reporting.")
    bullet("Built response-admission controls, echo-aware turn-taking and deterministic regression tests; added playback-aligned traces and recordings to distinguish generated speech from what callers heard.")

    job("Cenphi", "Co-Founder and Lead Developer", "Mar 2025 - Present")
    bullet("Built an asynchronous video-production pipeline with Python, FastAPI, Whisper, diarization, LLMs and FFmpeg; added job orchestration, provider fallback and live progress updates.")
    bullet("Developed segment-based story composition and artifact tracking, reducing manual review by <b>approximately 80%</b>.")

    story.append(PageBreak())
    p("PROFESSIONAL EXPERIENCE - CONTINUED", "section")
    job("Fynance Hub", "Technical Lead", "Oct 2024 - Present", "Remote, part-time")
    bullet("Designed Go/Python microservices with gRPC, owning architecture through production delivery.")
    bullet("Built PostgreSQL/Redis services for real-time data processing.")
    bullet("Developed GPT-4 and RAG-based recommendations for broker lead management.")
    bullet("Automated lead verification through outbound voice calls.")

    job("Arbor Platform Inc.", "Senior Software Engineer", "Feb 2023 - Oct 2024")
    bullet("Built Claude/OpenAI-powered video workflows that reduced production time by <b>60%</b> and improved throughput by <b>80%</b>.")
    bullet("Delivered text-to-video and audio-transcription features for AI-assisted editing.")
    bullet("Built a content studio and B-roll asset-management tools with one-click social distribution.")
    bullet("Developed React/TypeScript interfaces and integrated backend APIs and cloud services.")

    job("Howdy Learning", "Senior Software Development Engineer", "May 2020 - Mar 2023")
    bullet("Reduced WebSocket network traffic by <b>more than 99%</b> through real-time communication optimizations.")
    bullet("Built live-video infrastructure supporting up to <b>10,000 concurrent connections</b>.")
    bullet("Developed a GetStream/WebSocket chat system serving approximately <b>100 communities</b>.")
    bullet("Delivered embedded video, voice and SSO widgets for Thinkific and WordPress, with integrations used by <b>more than 100 customers</b>.")

    job("Bujuwa Nigeria Limited", "Software Developer", "Jul 2018 - Dec 2019", "Abuja, Nigeria")
    bullet("Delivered web and mobile assessment systems, from requirements and architecture to implementation.")

    p("OPEN SOURCE &amp; SELECTED ENGINEERING WORK", "section")
    p("<b>Pipecat:</b> Reported Anthropic stale-generation failures with reproduction evidence in "
      + link("https://github.com/pipecat-ai/pipecat/issues/5035", "#5035") + " and "
      + link("https://github.com/pipecat-ai/pipecat/issues/5036", "#5036")
      + "; #5036 was resolved upstream in "
      + link("https://github.com/pipecat-ai/pipecat/pull/5041", "PR #5041") + ".")
    p("<b>Acoustic Turn-over Rate (ATR):</b> Built ASR-independent evaluation: three VAD backends agreed within 7.6 percentage points, versus up to 23.5 points of ASR disagreement on the same audio. "
      + link("https://github.com/ifeanyidike/atr-metric", "Code") + " | "
      + link("https://doi.org/10.5281/zenodo.20548903", "Research artifact") + ".")
    p("<b>Full-Duplex-Bench:</b> Exposed up to 62x metric variation across ASR backends on identical audio. "
      + link("https://github.com/ifeanyidike/full-duplex-bench-repro", "Code and results") + ".")
    p("<b>Cenphi:</b> Co-founded an AI video platform for transcript-linked story composition, speaker-aware analysis and automated editing. "
      + link("https://cenphi.io", "cenphi.io") + ".")

    p("EDUCATION", "section")
    p("<b>M.Sc., Financial Engineering</b> | WorldQuant University | 2026 - Present (in progress)")
    p("<b>B.Tech., Applied Mathematics, First Class</b> | Federal University of Technology, Akure | 2018<br/>GPA: 4.63/5.00. National university mathematics competition: Gold (2017), Bronze (2016).")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=48, leftMargin=48,
                            topMargin=39, bottomMargin=50, title="Ifeanyi Desmond Dike - Professional CV",
                            author="Ifeanyi Desmond Dike")
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    copyfile(OUTPUT, ROOT / "assets/pdf/ifeanyi_dike_professional_cv.pdf")
    copyfile(OUTPUT, ROOT / "Ifeanyi_Desmond_Dike_Resume.pdf")
    print(OUTPUT)


if __name__ == "__main__":
    build()
