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
    "section": ParagraphStyle("section", fontName="Helvetica-Bold", fontSize=9, leading=12, textColor=BLUE, spaceBefore=11, spaceAfter=5, keepWithNext=True),
    "job": ParagraphStyle("job", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=INK, spaceBefore=8, spaceAfter=3, keepWithNext=True),
    "meta": ParagraphStyle("meta", fontName="Helvetica", fontSize=9, leading=12, textColor=MUTED, spaceAfter=5, keepWithNext=True),
    "body": ParagraphStyle("body", fontName="Helvetica", fontSize=10.2, leading=14.3, textColor=INK, spaceAfter=5, alignment=TA_LEFT),
    "bullet": ParagraphStyle("bullet", fontName="Helvetica", fontSize=10.2, leading=14.3, textColor=INK, leftIndent=10, firstLineIndent=-10, spaceAfter=4),
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
    p("Senior Software Engineer | Backend &amp; Voice AI", "title")
    p("Port Harcourt, Nigeria | " + link("mailto:ifeanyi@ifeanyidike.com", "ifeanyi@ifeanyidike.com"), "contact")
    p(" | ".join([
        link("https://ifeanyidike.com", "ifeanyidike.com"),
        link("https://github.com/ifeanyidike", "github.com/ifeanyidike"),
        link("https://linkedin.com/in/ifeanyidesmonddike", "LinkedIn: ifeanyidesmonddike"),
    ]), "contact")
    story.append(Spacer(1, 3))

    p("PROFILE", "section")
    p("Senior software engineer with <b>8+ years of experience</b> building backend services, web applications and real-time systems. Builds <b>Python/Go services and React/TypeScript interfaces</b>, with recent work in production voice AI, call scheduling and background processing. Takes features from design through deployment and production debugging, working remotely with teams in the US and Canada.")

    p("PROFESSIONAL EXPERIENCE", "section")
    job("DataStrut AI", "Founding AI Engineer / Senior Software Engineer", "Aug 2025 - Present")
    bullet("Migrated the production voice platform from Vapi to self-hosted Python/Pipecat, connecting telephony, streaming speech, LLM orchestration, recordings and post-call reports.")
    bullet("Built call admission and a Fly.io machine pool with <b>atomic Redis reservations</b>. Versioned reservations stop late events from releasing a machine assigned to a new call; active-work checks prevent premature suspension.")
    bullet("Separated outbound scheduling from report processing with <b>dedicated RQ workers</b>, duplicate-call protection and capacity-aware retries, so dial retries and reporting can run independently.")
    bullet("Reduced steady-state speech-recognition sessions from <b>3 to 1 per call</b> in three-agent workflows. Added regression tests and playback-aligned traces to investigate interruptions and recording errors.")
    bullet("Built <b>PostgreSQL data models and reporting workflows</b> that combine input from callers in different roles into a shared report.")
    bullet("Build features across the <b>React frontend and Python services</b>, including FastAPI APIs and a Flask photo-processing backend.")

    job("Cenphi", "Co-Founder and Lead Developer", "Mar 2025 - Present", "Independent project")
    bullet("Built a <b>React/TypeScript frontend and Go/Python backend</b> for asynchronous video processing, transcription, speaker diarization and story composition.")
    bullet("Built <b>server-sent event (SSE) progress updates</b> for background media jobs. Fixed stale connections, duplicate completion events and cross-session delivery; added workspace access checks and "
           + link("https://github.com/ifeanyidike/cenphi/commit/99648406fe174c55858db7f7bbafc13b7e5cb099", "offline regression tests") + ".")

    job("Fynance Hub", "Technical Lead", "Oct 2024 - Present", "Remote, part-time")
    bullet("Built a <b>React/TypeScript mortgage lead-generation product</b> with Go/Python services, PostgreSQL and Redis. The product has generated hundreds of leads for Canadian mortgage agents.")
    bullet("Worked directly with the founder/product owner to turn broker requirements into frontend and backend features; built RAG recommendations and automated outbound voice verification.")
    bullet("<b>Separate contract:</b> building MajorDairy AI's React Native/Expo app and FastAPI backend for dairy-farm workflows. Deployed the backend on <b>Railway</b>; the app is in Google Play testing. Built a DairyComp 305 importer for legacy herd records.")

    story.append(PageBreak())
    p("PROFESSIONAL EXPERIENCE - CONTINUED", "section")
    job("Arbor Platform Inc.", "Senior Software Engineer", "Feb 2023 - Oct 2024")
    bullet("Developed <b>React/TypeScript interfaces</b> for a content studio, B-roll asset management and one-click social distribution; integrated DatoCMS through GraphQL, backend APIs and cloud services.")
    bullet("Built Claude/OpenAI-powered video workflows that reduced production time by <b>60%</b> and improved throughput by <b>80%</b>.")
    bullet("Delivered text-to-video and audio-transcription features for AI-assisted editing.")

    job("Howdy Learning", "Senior Software Development Engineer", "May 2020 - Mar 2023")
    bullet("Reduced <b>WebSocket network traffic by more than 99%</b> through real-time communication optimizations. Built live-video infrastructure supporting up to <b>10,000 concurrent connections</b>.")
    bullet("Developed a GetStream/WebSocket chat system serving approximately <b>100 communities</b>.")
    bullet("Delivered embedded video, voice and SSO widgets for Thinkific and WordPress, with integrations used by <b>more than 100 customers</b>.")

    job("Bujuwa Nigeria Limited", "Software Developer", "Jul 2018 - Dec 2019", "Abuja, Nigeria")
    bullet("Delivered web and mobile assessment systems, from requirements and architecture to implementation.")

    p("TECHNICAL SKILLS", "section")
    p("<b>Backend:</b> Python, asyncio, Go, FastAPI, Flask, gRPC, PostgreSQL, Redis, MongoDB, RQ.")
    p("<b>Frontend:</b> React, TypeScript, JavaScript, GraphQL (DatoCMS), React Native, Expo.")
    p("<b>Infrastructure:</b> Fly.io, Heroku, Railway, Docker, CI/CD, observability; additional exposure to AWS and Kubernetes.")
    p("<b>Voice &amp; AI:</b> Pipecat, Twilio, WebSockets, WebRTC, streaming STT/TTS, VAD, LLM tools, RAG, PyTorch, Hugging Face.")

    p("RESEARCH, OPEN SOURCE &amp; WRITING", "section")
    p("<b>Voice-agent evaluation:</b> Sole-author preprints on "
      + link("https://doi.org/10.5281/zenodo.20548903", "ATR")
      + " and Full-Duplex-Bench reproduction; released "
      + link("https://github.com/ifeanyidike/atr-metric", "ATR code") + " and the "
      + link("https://github.com/ifeanyidike/full-duplex-bench-repro", "benchmark implementation")
      + ". Four co-authored IEEE IEMCON conference papers (2018).")
    p("<b>Pipecat:</b> Reported and documented an Anthropic integration bug ("
      + link("https://github.com/pipecat-ai/pipecat/issues/5035", "#5035") + " and "
      + link("https://github.com/pipecat-ai/pipecat/issues/5036", "#5036")
      + "); maintainers implemented the fix in "
      + link("https://github.com/pipecat-ai/pipecat/pull/5041", "PR #5041") + ".")
    p("<b>Technical writing:</b> "
      + link("https://ifeanyidike.com/blog/2026/scaling-voice-agents-machine-ownership/", "Call admission and a Fly.io machine pool")
      + "; " + link("https://ifeanyidike.com/blog/2026/python-memory-profiling-heroku/", "profiling Python memory in production") + ".")

    p("EDUCATION", "section")
    p("<b>M.Sc., Financial Engineering</b> | WorldQuant University | Dec 2025 - Dec 2027 (expected; in progress)")
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
