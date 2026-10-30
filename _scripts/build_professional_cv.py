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
    p("Senior software engineer with <b>8+ years</b> in backend and real-time systems. Builds and debugs <b>production voice AI</b> using Python, Go, React and TypeScript. Works remotely with US and Canadian teams.")

    p("PROFESSIONAL EXPERIENCE", "section")
    job("DataStrut AI", "Founding AI Engineer / Senior Software Engineer", "Aug 2025 - Present", "New York, US; Remote")
    bullet("Reduced memory use by <b>over 70% across two production FastAPI services</b> through profiling with memray and Gunicorn preloading.")
    bullet("Migrated production voice AI from Vapi to self-hosted Python/Pipecat, integrating telephony, streaming speech, LLMs and PostgreSQL reporting.")
    bullet("Cut steady-state speech-recognition sessions from <b>3 to 1 per call</b> in three-agent workflows.")
    bullet("<b>Diagnosed interruptions and dead air</b> by tracing stale model decisions and timer races through timestamped voice pipeline events.")
    bullet("<b>Excluded speech cancelled before playback release</b> from recordings; used Twilio dual-channel audio to align both speakers on one timeline.")
    bullet("Built Fly.io call admission with <b>atomic, versioned Redis reservations</b> and active-work checks. Separated scheduling and reporting with dedicated RQ workers, capacity-aware retries and duplicate-call protection.")
    bullet("Ran voice load tests reaching <b>40 occupied phone lines</b>; <b>48 populated reports (96 jobsites)</b> were ready within <b>121.2 seconds</b> of AI-session end. Identified audio-loss and call-setup failures.")
    bullet("Built <b>React report editing</b> with version checks, history, account isolation and drafts preserved after failed refreshes.")

    job("Fynance Hub", "Technical Lead", "Oct 2024 - Present", "Toronto, Canada; Remote, part-time")
    bullet("Built a <b>React/TypeScript mortgage platform</b> with Go/Python, PostgreSQL and Redis, generating <b>hundreds of leads</b> for Canadian brokers.")
    bullet("Worked with the founder to turn broker requirements into features, including RAG recommendations and outbound voice verification.")
    bullet("<b>Separate contract:</b> building MajorDairy AI's React Native/Expo app and FastAPI backend for dairy-farm workflows. Deployed on <b>Railway</b>; app in Google Play testing. Built a DairyComp 305 record importer.")

    story.append(PageBreak())
    p("PROFESSIONAL EXPERIENCE - CONTINUED", "section")
    job("Arbor Platform Inc.", "Senior Software Engineer", "Feb 2023 - Oct 2024", "New York, US; Remote")
    bullet("Built <b>React/TypeScript interfaces</b> for a content studio, B-roll tools and social publishing; integrated DatoCMS through GraphQL.")
    bullet("Built Claude/OpenAI video and transcription workflows, reducing production time by <b>60%</b> and increasing throughput by <b>80%</b>.")

    job("Howdy Learning", "Senior Software Development Engineer", "May 2020 - Mar 2023")
    bullet("Reduced <b>WebSocket network traffic by over 99%</b>; built live-video infrastructure supporting up to <b>10,000 concurrent connections</b>.")
    bullet("Built GetStream/WebSocket chat serving about <b>100 communities</b>.")
    bullet("Delivered video, voice and SSO integrations for Thinkific and WordPress, used by <b>over 100 customers</b>.")

    job("Bujuwa Nigeria Limited", "Software Developer", "Jul 2018 - Dec 2019", "Abuja, Nigeria")
    bullet("Built web and mobile assessment systems, from requirements through design and delivery.")

    p("SELECTED INDEPENDENT PROJECT", "section")
    p("<b>Cenphi</b> | Co-Founder and Lead Developer | Mar 2025 - Present")
    bullet("Built <b>React/TypeScript and Go/Python video workflows</b> with SSE progress updates. Added connection cleanup, completion deduplication, session isolation, access checks and "
           + link("https://github.com/ifeanyidike/cenphi/commit/99648406fe174c55858db7f7bbafc13b7e5cb099", "regression tests") + ".")

    p("TECHNICAL SKILLS", "section")
    p("<b>Backend:</b> Python, asyncio, Go, FastAPI, Flask, gRPC, PostgreSQL, Redis, MongoDB, RQ.")
    p("<b>Frontend:</b> React, TypeScript, JavaScript, GraphQL (DatoCMS), React Native, Expo.")
    p("<b>Infrastructure:</b> Fly.io, Heroku, Railway, Docker, CI/CD, observability; additional exposure to AWS and Kubernetes.")
    p("<b>Voice &amp; AI:</b> Pipecat, Twilio, WebSockets, WebRTC, streaming STT/TTS, VAD, LLM tools, RAG, PyTorch, Hugging Face.")

    p("RESEARCH, OPEN SOURCE &amp; WRITING", "section")
    p("<b>VoxCPM2 / vLLM-Omni:</b> Built a test harness for LoRA speech adapters, checked speech-recognition scoring against human recordings, and "
      + link("https://github.com/vllm-project/vllm-omni/issues/6004#issuecomment-6526965322", "reported base, full-adapter and LM-only results upstream") + ".")
    p("<b>Voice-agent evaluation:</b> Sole-author preprints on "
      + link("https://doi.org/10.5281/zenodo.20548903", "ATR")
      + " and Full-Duplex-Bench reproduction, with "
      + link("https://github.com/ifeanyidike/atr-metric", "ATR code") + " and the "
      + link("https://github.com/ifeanyidike/full-duplex-bench-repro", "benchmark code")
      + ". Four co-authored IEEE IEMCON papers (2018).")
    p("<b>Pipecat:</b> Reported an Anthropic integration bug ("
      + link("https://github.com/pipecat-ai/pipecat/issues/5035", "#5035") + " and "
      + link("https://github.com/pipecat-ai/pipecat/issues/5036", "#5036")
      + "); maintainer fix: "
      + link("https://github.com/pipecat-ai/pipecat/pull/5041", "#5041") + ".")
    p("<b>Technical writing:</b> "
      + link("https://ifeanyidike.com/blog/2026/the-sentence-nobody-heard-voice-ai-recording/", "Debugging voice recordings")
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
