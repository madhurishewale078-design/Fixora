import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen: 13.333 x 7.5 inches
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    base_dir = "/Users/madhurani/Desktop/smart-home-fix"
    shots = os.path.join(base_dir, "public/screenshots")

    # Colors
    c_white = RGBColor(255, 255, 255)
    c_slate50 = RGBColor(248, 250, 252)
    c_slate200 = RGBColor(226, 232, 240)
    c_slate400 = RGBColor(148, 163, 184)
    c_slate600 = RGBColor(71, 85, 105)
    c_slate900 = RGBColor(15, 23, 42)
    c_emerald = RGBColor(5, 150, 105)
    c_emerald_dark = RGBColor(6, 78, 59)
    c_blue = RGBColor(37, 99, 235)

    def add_header(slide, slide_num, category, title):
        # Category
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(10), Inches(0.4))
        tf = txBox.text_frame
        p = tf.paragraphs[0]
        p.text = f"SLIDE {slide_num:02d} • {category.upper()}"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = c_emerald

        # Title
        txBox2 = slide.shapes.add_textbox(Inches(0.8), Inches(0.8), Inches(11.5), Inches(0.8))
        tf2 = txBox2.text_frame
        p2 = tf2.paragraphs[0]
        p2.text = title
        p2.font.size = Pt(22)
        p2.font.bold = True
        p2.font.color.rgb = c_slate900

    def add_footer(slide, text="FIXORA — AI-Assisted Smart Home Maintenance Platform"):
        txBox = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.7), Inches(0.4))
        tf = txBox.text_frame
        p = tf.paragraphs[0]
        p.text = text
        p.font.size = Pt(10)
        p.font.color.rgb = c_slate400

    # ------------------ SLIDE 1: Title ------------------
    s1 = prs.slides.add_slide(blank_layout)
    # Background card
    bg = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
    bg.fill.solid()
    bg.fill.fore_color.rgb = c_slate50
    bg.line.color.rgb = c_slate200

    # Logo
    logo_path = os.path.join(base_dir, "public/logo.png")
    if os.path.exists(logo_path):
        s1.shapes.add_picture(logo_path, Inches(1.3), Inches(1.4), width=Inches(1.2), height=Inches(1.2))

    tx = s1.shapes.add_textbox(Inches(2.7), Inches(1.5), Inches(9.0), Inches(1.0))
    tf = tx.text_frame
    p = tf.paragraphs[0]
    p.text = "FIXORA"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = c_slate900

    tx2 = s1.shapes.add_textbox(Inches(1.3), Inches(2.9), Inches(10.5), Inches(2.0))
    tf2 = tx2.text_frame
    p1 = tf2.paragraphs[0]
    p1.text = "“Diagnose First. Book Only When Needed.”"
    p1.font.size = Pt(28)
    p1.font.bold = True
    p1.font.color.rgb = c_emerald

    p2 = tf2.add_paragraph()
    p2.text = "AI-Assisted Smart Home Maintenance & Verification Platform"
    p2.font.size = Pt(16)
    p2.font.bold = True
    p2.font.color.rgb = c_slate900

    p3 = tf2.add_paragraph()
    p3.text = "Final Year Engineering Project • Lead: Madhuri Shewale (madhurishewale078@gmail.com)"
    p3.font.size = Pt(13)
    p3.font.color.rgb = c_slate600

    # ------------------ SLIDE 2: Problem Statement ------------------
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, 2, "Motivation & Industry Analysis", "The Problem in Traditional Home Maintenance")
    add_footer(s2)

    problems = [
        ("Unnecessary Call-Out Fees", "35% of service visits are triggered by trivial glitches (tripped breaker, tap aerator clog) costing ₹400-₹800 for zero real repair."),
        ("Opaque & Surprise Pricing", "Customers face unpredictable on-site price jumps and inflated spare part costs upon technician arrival."),
        ("Blind Technician Dispatch", "Technicians arrive without pre-visit symptom analysis, forcing 2-3 round trips to hardware stores for components."),
        ("Unverified Handymen", "Lack of verified certification, safety vetting, and accountability when domestic appliances are damaged.")
    ]
    for i, (title, desc) in enumerate(problems):
        x = Inches(0.8 + (i % 2) * 5.9)
        y = Inches(1.8 + (i // 2) * 2.4)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.6), Inches(2.1))
        card.fill.solid()
        card.fill.fore_color.rgb = c_slate50
        card.line.color.rgb = c_slate200
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = c_slate900
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = c_slate600

    # ------------------ SLIDE 3: Solution ------------------
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, 3, "Solution Architecture", "The FIXORA Three-Pillar Paradigm")
    add_footer(s3)

    pillars = [
        ("1. AI Diagnostic Wizard", "Multi-question triage tree identifies fault root causes and distinguishes superficial glitches from true component breakdowns.", c_emerald),
        ("2. Guided Safe DIY", "Delivers step-by-step instructions for non-hazardous faults. Eliminates 35% of unnecessary callouts for ₹0 cost.", RGBColor(13, 148, 136)),
        ("3. Verified Field Handoff", "Passes pre-diagnosed tickets with symptom notes and estimated cost brackets to vetted technicians on live GPS map.", c_blue)
    ]
    for i, (title, desc, col) in enumerate(pillars):
        x = Inches(0.8 + i * 3.95)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.8), Inches(3.8), Inches(4.8))
        card.fill.solid()
        card.fill.fore_color.rgb = c_slate50
        card.line.color.rgb = c_slate200
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(13)
        p2.font.color.rgb = c_slate600

    # ------------------ SLIDE 4: Decision Flow ------------------
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, 4, "Diagnostic Decision Logic", "Deterministic Fault Triage Decision Flow")
    add_footer(s4)

    # Box 1
    b1 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.5), Inches(1.7), Inches(8.3), Inches(0.8))
    b1.fill.solid(); b1.fill.fore_color.rgb = c_slate50; b1.line.color.rgb = c_emerald
    b1.text_frame.paragraphs[0].text = "1. Customer Selects Appliance & Primary Symptom"
    b1.text_frame.paragraphs[0].font.bold = True; b1.text_frame.paragraphs[0].font.size = Pt(13)

    b2 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.5), Inches(2.8), Inches(8.3), Inches(0.8))
    b2.fill.solid(); b2.fill.fore_color.rgb = c_slate50; b2.line.color.rgb = c_slate200
    b2.text_frame.paragraphs[0].text = "2. Dynamic Follow-Up Questions (Error code? MCB status? Motor sound?)"
    b2.text_frame.paragraphs[0].font.bold = True; b2.text_frame.paragraphs[0].font.size = Pt(13)

    # Branches
    b3a = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.0), Inches(5.3), Inches(2.5))
    b3a.fill.solid(); b3a.fill.fore_color.rgb = RGBColor(236, 253, 245); b3a.line.color.rgb = c_emerald
    tfa = b3a.text_frame
    tfa.paragraphs[0].text = "[SAFE DIY PATHWAY]"
    tfa.paragraphs[0].font.bold = True; tfa.paragraphs[0].font.color.rgb = c_emerald; tfa.paragraphs[0].font.size = Pt(14)
    pa1 = tfa.add_paragraph()
    pa1.text = "• Illustrated safety instructions\n• Filter cleaning, reset switches, MCB reset\n• Total Cost: ₹0 • Resolved in 5 mins!"
    pa1.font.size = Pt(12); pa1.font.color.rgb = c_slate900

    b3b = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.0), Inches(4.0), Inches(5.3), Inches(2.5))
    b3b.fill.solid(); b3b.fill.fore_color.rgb = RGBColor(239, 246, 255); b3b.line.color.rgb = c_blue
    tfb = b3b.text_frame
    tfb.paragraphs[0].text = "[TECHNICIAN REQUIRED PATHWAY]"
    tfb.paragraphs[0].font.bold = True; tfb.paragraphs[0].font.color.rgb = c_blue; tfb.paragraphs[0].font.size = Pt(14)
    pb1 = tfb.add_paragraph()
    pb1.text = "• Pre-filled booking with fault findings\n• Transparent cost range: ₹600 - ₹950\n• Matched with nearby verified technician on map"
    pb1.font.size = Pt(12); pb1.font.color.rgb = c_slate900

    # ------------------ SLIDE 5: AI UI Showcase ------------------
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, 5, "System Interface Showcase", "AI Diagnostic Assistant & Triage UI")
    add_footer(s5)
    img_ai = os.path.join(shots, "02_ai_diagnosis.png")
    if os.path.exists(img_ai):
        s5.shapes.add_picture(img_ai, Inches(0.8), Inches(1.8), width=Inches(8.2), height=Inches(4.8))
    card_ai = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.3), Inches(1.8), Inches(3.2), Inches(4.8))
    card_ai.fill.solid(); card_ai.fill.fore_color.rgb = c_slate50; card_ai.line.color.rgb = c_slate200
    tf = card_ai.text_frame
    tf.paragraphs[0].text = "Key Highlights:"
    tf.paragraphs[0].font.bold = True; tf.paragraphs[0].font.size = Pt(15)
    p = tf.add_paragraph()
    p.text = "• Multi-Appliance Matrix (AC, Fan, RO, Geyser)\n• Dynamic branching logic\n• Instant verdict & cost bracket calculation\n• Zero pricing surprises"
    p.font.size = Pt(12); p.font.color.rgb = c_slate600

    # ------------------ SLIDE 6: Customer Portal ------------------
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, 6, "Customer Experience", "Customer Portal & Live Leaflet Tracking")
    add_footer(s6)
    img_cust = os.path.join(shots, "07_customer_dashboard.png")
    if os.path.exists(img_cust):
        s6.shapes.add_picture(img_cust, Inches(0.8), Inches(1.8), width=Inches(8.2), height=Inches(4.8))
    card_c = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.3), Inches(1.8), Inches(3.2), Inches(4.8))
    card_c.fill.solid(); card_c.fill.fore_color.rgb = c_slate50; card_c.line.color.rgb = c_slate200
    tfc = card_c.text_frame
    tfc.paragraphs[0].text = "Customer Features:"
    tfc.paragraphs[0].font.bold = True; tfc.paragraphs[0].font.size = Pt(15)
    pc = tfc.add_paragraph()
    pc.text = "• Interactive Leaflet Map with service radius\n• Finite-state booking tracking (Pending ➔ Completed)\n• Transparent rate cards\n• Single review per booking constraint"
    pc.font.size = Pt(12); pc.font.color.rgb = c_slate600

    # ------------------ SLIDE 7: Technician Workspace ------------------
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, 7, "Service Professional Hub", "Technician Workspace & Job Dispatch")
    add_footer(s7)
    img_tech = os.path.join(shots, "08_technician_dashboard.png")
    if os.path.exists(img_tech):
        s7.shapes.add_picture(img_tech, Inches(0.8), Inches(1.8), width=Inches(8.2), height=Inches(4.8))
    card_t = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.3), Inches(1.8), Inches(3.2), Inches(4.8))
    card_t.fill.solid(); card_t.fill.fore_color.rgb = c_slate50; card_t.line.color.rgb = c_slate200
    tft = card_t.text_frame
    tft.paragraphs[0].text = "Technician Features:"
    tft.paragraphs[0].font.bold = True; tft.paragraphs[0].font.size = Pt(15)
    pt = tft.add_paragraph()
    pt.text = "• Pre-diagnosed fault tickets with suspected parts\n• 1-Click status transitions (Accept ➔ In Progress ➔ Done)\n• Daily/Monthly revenue calculation\n• Real-time customer ratings & reviews"
    pt.font.size = Pt(12); pt.font.color.rgb = c_slate600

    # ------------------ SLIDE 8: Admin Control ------------------
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, 8, "Platform Governance", "Admin Master Control Center (Madhuri Shewale)")
    add_footer(s8)
    img_adm = os.path.join(shots, "06_admin_dashboard.png")
    if os.path.exists(img_adm):
        s8.shapes.add_picture(img_adm, Inches(0.8), Inches(1.8), width=Inches(8.2), height=Inches(4.8))
    card_a = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(9.3), Inches(1.8), Inches(3.2), Inches(4.8))
    card_a.fill.solid(); card_a.fill.fore_color.rgb = c_slate50; card_a.line.color.rgb = c_slate200
    tfa = card_a.text_frame
    tfa.paragraphs[0].text = "Admin Governance:"
    tfa.paragraphs[0].font.bold = True; tfa.paragraphs[0].font.size = Pt(15)
    pa = tfa.add_paragraph()
    pa.text = "• Platform macro analytics (Users, Revenue, Bookings)\n• Technician verification gate (Approve/Reject)\n• Customer dispute and complaint arbitration\n• Service catalog and pricing management"
    pa.font.size = Pt(12); pa.font.color.rgb = c_slate600

    # ------------------ SLIDE 9: Services & Technicians ------------------
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, 9, "Marketplace Catalog", "Services Catalog & Verified Expert Directory")
    add_footer(s9)
    img_s = os.path.join(shots, "03_services.png")
    img_t = os.path.join(shots, "04_technicians.png")
    if os.path.exists(img_s):
        s9.shapes.add_picture(img_s, Inches(0.8), Inches(1.8), width=Inches(5.7), height=Inches(4.8))
    if os.path.exists(img_t):
        s9.shapes.add_picture(img_t, Inches(6.8), Inches(1.8), width=Inches(5.7), height=Inches(4.8))

    # ------------------ SLIDE 10: Tech Stack ------------------
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, 10, "Engineering Architecture", "Full-Stack Technology Architecture")
    add_footer(s10)

    stacks = [
        ("Frontend Client", "• React 19 + TypeScript\n• Vite 6 High-Performance Bundler\n• Tailwind CSS 3 (Dark/Light Mode)\n• Lucide Icons & Leaflet Maps\n• Axios with Auth Interceptors", c_emerald),
        ("Backend REST API", "• Python 3.12 + FastAPI\n• Uvicorn ASGI Server\n• Pydantic v2 Schema Validation\n• OpenAPI Swagger Auto-Docs\n• Async REST Endpoints", RGBColor(13, 148, 136)),
        ("Security & RBAC", "• Pure Bcrypt Password Hashing\n• Stateless JWT HS256 Tokens\n• OAuth2 Bearer Guards\n• Role-Based Access Control\n• Parameterized SQL Injection Prev.", RGBColor(147, 51, 234)),
        ("Data Persistence", "• PostgreSQL 16 Enterprise DB\n• SQLite Resilient Dev Fallback\n• SQLAlchemy 2.0 ORM\n• 12 Normalized Relational Entities\n• ACID Transaction Guarantees", c_blue)
    ]
    for i, (title, desc, col) in enumerate(stacks):
        x = Inches(0.8 + i * 2.95)
        card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.8), Inches(2.8), Inches(4.8))
        card.fill.solid(); card.fill.fore_color.rgb = c_slate50; card.line.color.rgb = c_slate200
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15); p.font.bold = True; p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12); p2.font.color.rgb = c_slate600

    # ------------------ SLIDE 11: Database Schema ------------------
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, 11, "Data Architecture", "Relational Database Schema (12 Tables)")
    add_footer(s11)

    tables = [
        ("users", "id, email, hashed_password, role (CUSTOMER, TECH, ADMIN), is_active, created_at"),
        ("customer_profiles", "user_id, full_name, phone, address, city, pincode, lat, lng"),
        ("technician_profiles", "user_id, skills, experience_years, verification_status, hourly_rate, rating"),
        ("bookings", "id, customer_id, technician_id, service_id, status, total_price, scheduled_date"),
        ("booking_history", "id, booking_id, old_status, new_status, changed_by, timestamp"),
        ("reviews", "id, booking_id, rating (1-5), comment, created_at (Unique constraint on booking_id)"),
        ("complaints", "id, customer_id, booking_id, title, description, status (OPEN, RESOLVED)"),
        ("services & categories", "name, description, base_price, estimated_time, is_active, category_id")
    ]
    for i, (name, fields) in enumerate(tables):
        x = Inches(0.8 + (i % 4) * 2.95)
        y = Inches(1.8 + (i // 4) * 2.4)
        card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.8), Inches(2.1))
        card.fill.solid(); card.fill.fore_color.rgb = c_slate50; card.line.color.rgb = c_slate200
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = name
        p.font.size = Pt(13); p.font.bold = True; p.font.color.rgb = c_slate900
        p2 = tf.add_paragraph()
        p2.text = fields
        p2.font.size = Pt(10); p2.font.color.rgb = c_slate600

    # ------------------ SLIDE 12: AI Engine Internals ------------------
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, 12, "AI Algorithms & Safety", "Deterministic DAG vs Generative LLM Comparison")
    add_footer(s12)

    ai_cards = [
        ("A. Safety-First Rule DAG", "Unlike generative chatbots that can hallucinate dangerous advice (e.g. telling an amateur to probe an open capacitor), FIXORA uses a certified, deterministic decision graph.", c_emerald),
        ("B. Pluggable Engine Adapter", "Implemented behind an abstract base class `TroubleshootingEngine`. Allows seamless plug-and-play switching to multimodal LLMs (e.g. Gemini Vision) while keeping safety gates active.", RGBColor(13, 148, 136)),
        ("C. 3-Tier Severity Firewall", "• TIER 1 (GREEN): Safe DIY (air filter clean, reset switch).\n• TIER 2 (AMBER): Conditional DIY (main MCB switched off).\n• TIER 3 (RED): Mandatory Dispatch (gas leak, burnt insulation).", c_blue)
    ]
    for i, (title, desc, col) in enumerate(ai_cards):
        x = Inches(0.8 + i * 3.95)
        card = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.8), Inches(3.8), Inches(4.8))
        card.fill.solid(); card.fill.fore_color.rgb = c_slate50; card.line.color.rgb = c_slate200
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(16); p.font.bold = True; p.font.color.rgb = col
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(13); p2.font.color.rgb = c_slate600

    # ------------------ SLIDE 13: Security & Compliance ------------------
    s13 = prs.slides.add_slide(blank_layout)
    add_header(s13, 13, "Security & Compliance", "Authentication, Authorization & OWASP Security")
    add_footer(s13)

    secs = [
        ("Direct Bcrypt Password Hashing", "All user passwords salted and encrypted using pure bcrypt with adaptive work factor. No plaintext credentials ever hit database or logs."),
        ("Stateless JWT HS256 Tokens", "Cryptographically signed JSON Web Tokens encoding user ID, email, and verified role with 24-hour expiration token rotation."),
        ("Role-Based Access Control (RBAC)", "FastAPI Dependency Injection guards (require_role(['ADMIN'])). Customers cannot mutate technician states; technicians cannot approve themselves."),
        ("SQL Injection & CORS Hardening", "All database queries execute through SQLAlchemy parameterized ORM layers. Strict CORS policies block unauthorized cross-origin calls.")
    ]
    for i, (title, desc) in enumerate(secs):
        x = Inches(0.8 + (i % 2) * 5.9)
        y = Inches(1.8 + (i // 2) * 2.4)
        card = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(5.6), Inches(2.1))
        card.fill.solid(); card.fill.fore_color.rgb = c_slate50; card.line.color.rgb = c_slate200
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(15); p.font.bold = True; p.font.color.rgb = c_slate900
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12); p2.font.color.rgb = c_slate600

    # ------------------ SLIDE 14: Validation & Metrics ------------------
    s14 = prs.slides.add_slide(blank_layout)
    add_header(s14, 14, "Empirical Validation", "Validation Scenarios & Benchmark Metrics")
    add_footer(s14)

    cases = [
        ("Test Case 1: Geyser Not Heating", "• Input: Power LED on, water lukewarm\n• AI: Heating element burnt\n• Verdict: Technician required\n• Result: Pre-filled dispatch to Rajesh Kumar"),
        ("Test Case 2: Fan Humming Noise", "• Input: Fan hums, does not rotate\n• AI: Blown capacitor\n• Verdict: Guided Safe DIY\n• Result: ₹40 capacitor fixes issue. ₹600 saved!"),
        ("Test Case 3: Admin Approval Gate", "• Action: Dinesh registers as tech\n• Status: Gated as PENDING\n• Admin: Madhuri approves profile\n• Result: Visible on public booking map")
    ]
    for i, (title, desc) in enumerate(cases):
        x = Inches(0.8 + i * 3.95)
        card = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.8), Inches(3.8), Inches(3.0))
        card.fill.solid(); card.fill.fore_color.rgb = c_slate50; card.line.color.rgb = c_slate200
        tf = card.text_frame
        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14); p.font.bold = True; p.font.color.rgb = c_slate900
        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(11); p2.font.color.rgb = c_slate600

    metrics = [("100%", "Test Pass Rate"), ("< 15ms", "Mean API Latency"), ("35%", "DIY Cost Reduction"), ("0", "Data Inconsistencies")]
    for i, (num, lbl) in enumerate(metrics):
        x = Inches(0.8 + i * 2.95)
        mcard = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(5.1), Inches(2.8), Inches(1.5))
        mcard.fill.solid(); mcard.fill.fore_color.rgb = c_slate50; mcard.line.color.rgb = c_slate200
        tf = mcard.text_frame
        p = tf.paragraphs[0]
        p.text = num
        p.font.size = Pt(26); p.font.bold = True; p.font.color.rgb = c_emerald
        p.alignment = PP_ALIGN.CENTER
        p2 = tf.add_paragraph()
        p2.text = lbl
        p2.font.size = Pt(11); p2.font.color.rgb = c_slate600
        p2.alignment = PP_ALIGN.CENTER

    # ------------------ SLIDE 15: Conclusion ------------------
    s15 = prs.slides.add_slide(blank_layout)
    bg15 = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.8), Inches(11.733), Inches(5.9))
    bg15.fill.solid(); bg15.fill.fore_color.rgb = c_slate50; bg15.line.color.rgb = c_slate200

    tx = s15.shapes.add_textbox(Inches(1.5), Inches(1.8), Inches(10.3), Inches(3.5))
    tf = tx.text_frame
    p = tf.paragraphs[0]
    p.text = "Thank You!"
    p.font.size = Pt(44); p.font.bold = True; p.font.color.rgb = c_slate900
    p.alignment = PP_ALIGN.CENTER

    p2 = tf.add_paragraph()
    p2.text = "“Diagnose First. Book Only When Needed.”"
    p2.font.size = Pt(24); p2.font.bold = True; p2.font.color.rgb = c_emerald
    p2.alignment = PP_ALIGN.CENTER

    p3 = tf.add_paragraph()
    p3.text = "\nFIXORA bridges the critical trust gap between homeowners and certified service technicians through transparent AI triage, pre-diagnosed tickets, and verified professional standards.\n\nReady for Live Demonstration & Viva Examination"
    p3.font.size = Pt(14); p3.font.color.rgb = c_slate600
    p3.alignment = PP_ALIGN.CENTER

    # Output paths
    out_paths = [
        os.path.join(base_dir, "docs/FIXORA_Presentation.pptx"),
        os.path.join(base_dir, "public/FIXORA_Presentation.pptx"),
        "/Users/madhurani/Desktop/FIXORA_Presentation.pptx",
        "/Users/madhurani/Downloads/FIXORA_Presentation.pptx"
    ]

    for op in out_paths:
        os.makedirs(os.path.dirname(op), exist_ok=True)
        prs.save(op)
        print(f"Saved PPTX to: {op}")

if __name__ == "__main__":
    create_deck()
    print("PowerPoint deck generation finished successfully!")
