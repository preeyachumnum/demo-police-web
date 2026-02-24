const steps = [
  "ข้อมูลผู้เสียหาย",
  "ข้อมูลคดีเบื้องต้น",
  "ผู้เกี่ยวข้องและหลักฐาน",
  "ตรวจสอบและสร้างเอกสาร",
];

const requiredFieldsByStep = {
  0: ["victimName", "victimId", "victimPhone", "victimAddress"],
  1: ["caseType", "incidentDate", "incidentTime", "incidentPlace", "incidentDetail"],
  2: [],
  3: [],
};

const form = document.getElementById("caseForm");
const panes = Array.from(document.querySelectorAll(".step-pane"));
const stepList = document.getElementById("stepList");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const reviewBox = document.getElementById("reviewBox");
const messageEl = document.getElementById("formMessage");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const fillMockBtn = document.getElementById("fillMockBtn");
const generateBtn = document.getElementById("generateBtn");
const printBtn = document.getElementById("printBtn");
const wordBtn = document.getElementById("wordBtn");
const pdfBtn = document.getElementById("pdfBtn");

const complaintDocEl = document.getElementById("complaintDoc");
const dailyDocEl = document.getElementById("dailyDoc");
const circumstanceDocEl = document.getElementById("circumstanceDoc");

let currentStep = 0;
let generated = false;
let caseCode = "";

function renderStepList() {
  stepList.innerHTML = "";
  steps.forEach((step, idx) => {
    const li = document.createElement("li");
    li.textContent = `${idx + 1}. ${step}`;
    if (idx === currentStep) li.classList.add("active");
    if (idx < currentStep) li.classList.add("done");
    stepList.appendChild(li);
  });
}

function updateProgress() {
  const value = Math.round((currentStep / (steps.length - 1)) * 100);
  progressBar.style.width = `${value}%`;
  progressText.textContent = `${value}%`;
}

function showStep(idx) {
  panes.forEach((pane, paneIdx) => {
    pane.classList.toggle("active", paneIdx === idx);
  });

  prevBtn.disabled = idx === 0;
  nextBtn.style.display = idx === steps.length - 1 ? "none" : "inline-flex";
  if (idx === steps.length - 1) {
    refreshReview();
  }

  renderStepList();
  updateProgress();
}

function getFieldValue(name) {
  const elements = form.elements[name];
  if (!elements) return "";
  if (elements.length && elements[0]?.type === "checkbox") {
    return Array.from(elements)
      .filter((el) => el.checked)
      .map((el) => el.value);
  }
  return elements.value?.trim() ?? "";
}

function collectFormData() {
  return {
    victimName: getFieldValue("victimName"),
    victimId: getFieldValue("victimId"),
    victimPhone: getFieldValue("victimPhone"),
    victimEmail: getFieldValue("victimEmail"),
    victimAddress: getFieldValue("victimAddress"),
    caseType: getFieldValue("caseType"),
    incidentDate: getFieldValue("incidentDate"),
    incidentTime: getFieldValue("incidentTime"),
    incidentPlace: getFieldValue("incidentPlace"),
    damageValue: getFieldValue("damageValue"),
    incidentDetail: getFieldValue("incidentDetail"),
    suspectInfo: getFieldValue("suspectInfo"),
    witnessInfo: getFieldValue("witnessInfo"),
    evidence: getFieldValue("evidence"),
    additionalNote: getFieldValue("additionalNote"),
  };
}

function validateStep(stepIndex) {
  const requiredFields = requiredFieldsByStep[stepIndex] || [];
  const invalid = requiredFields.filter((name) => !getFieldValue(name));
  const idValue = getFieldValue("victimId");

  if (stepIndex === 0 && idValue && idValue.length !== 13) {
    invalid.push("เลขบัตรประชาชนต้องมี 13 หลัก");
  }

  if (invalid.length === 0) {
    messageEl.textContent = "";
    return true;
  }

  messageEl.textContent = "กรุณากรอกข้อมูลให้ครบถ้วนก่อนดำเนินการขั้นตอนถัดไป";
  return false;
}

function checkStepCompletion(stepIndex) {
  const requiredFields = requiredFieldsByStep[stepIndex] || [];
  const hasMissing = requiredFields.some((name) => !getFieldValue(name));
  const idValue = getFieldValue("victimId");
  const invalidId = stepIndex === 0 && idValue && idValue.length !== 13;
  return !hasMissing && !invalidId;
}

function checkCoreCompletion() {
  return checkStepCompletion(0) && checkStepCompletion(1);
}

function formatDateThai(isoDate) {
  if (!isoDate) return "-";
  const dt = new Date(isoDate);
  if (Number.isNaN(dt.getTime())) return isoDate;
  return dt.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function refreshReview() {
  const data = collectFormData();
  const evidenceText = data.evidence.length ? data.evidence.join(", ") : "ไม่มีข้อมูล";
  const damageText = data.damageValue ? Number(data.damageValue).toLocaleString("th-TH") : "ไม่ระบุ";

  reviewBox.innerHTML = `
    <p class="review-item"><strong>ผู้เสียหาย:</strong> ${escapeHtml(data.victimName || "-")} (${escapeHtml(data.victimPhone || "-")})</p>
    <p class="review-item"><strong>ประเภทคดี:</strong> ${escapeHtml(data.caseType || "-")}</p>
    <p class="review-item"><strong>วันเวลาเกิดเหตุ:</strong> ${escapeHtml(formatDateThai(data.incidentDate))} เวลา ${escapeHtml(data.incidentTime || "-")} น.</p>
    <p class="review-item"><strong>สถานที่:</strong> ${escapeHtml(data.incidentPlace || "-")}</p>
    <p class="review-item"><strong>มูลค่าความเสียหาย:</strong> ${escapeHtml(damageText)} บาท</p>
    <p class="review-item"><strong>หลักฐาน:</strong> ${escapeHtml(evidenceText)}</p>
    <p class="review-item"><strong>สถานะความพร้อม:</strong> ${
      checkCoreCompletion() ? "ข้อมูลครบพร้อมสร้างเอกสาร" : "ยังมีข้อมูลที่ต้องกรอกเพิ่ม"
    }</p>
  `;
}

function createCaseCode() {
  const now = new Date();
  return `CASE-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
}

function generateDocs(data) {
  const evidenceText = data.evidence.length ? data.evidence.join(", ") : "ไม่มีการระบุ";
  const damageText = data.damageValue ? `${Number(data.damageValue).toLocaleString("th-TH")} บาท` : "ไม่ระบุ";
  const incidentDate = formatDateThai(data.incidentDate);
  const complaintDoc = `
คำร้องทุกข์
รหัสคดีชั่วคราว: ${caseCode}

ข้าพเจ้า ${data.victimName} บัตรประชาชนเลขที่ ${data.victimId}
ที่อยู่ ${data.victimAddress}
โทรศัพท์ ${data.victimPhone}

มีความประสงค์ร้องทุกข์ในคดีประเภท "${data.caseType}"
เหตุเกิดเมื่อวันที่ ${incidentDate} เวลา ${data.incidentTime} น.
สถานที่เกิดเหตุ ${data.incidentPlace}
รายละเอียดเหตุการณ์: ${data.incidentDetail}
มูลค่าความเสียหาย: ${damageText}

จึงเรียนมาเพื่อโปรดดำเนินการตามกฎหมาย
ลงชื่อ ........................................ ผู้ร้องทุกข์
วันที่ ........................................
`.trim();

  const dailyDoc = `
บันทึกประจำวัน
รหัสคดีชั่วคราว: ${caseCode}

วันนี้ได้รับแจ้งความจาก ${data.victimName}
หมายเลขโทรศัพท์ ${data.victimPhone}
คดีประเภท ${data.caseType}
สถานที่เกิดเหตุ ${data.incidentPlace}
วันเวลาเกิดเหตุ ${incidentDate} ${data.incidentTime} น.

หลักฐานที่ผู้แจ้งนำส่ง: ${evidenceText}
ผู้ต้องสงสัยที่ระบุ: ${data.suspectInfo || "-"}
พยานที่ระบุ: ${data.witnessInfo || "-"}

บันทึกไว้เป็นหลักฐาน
ลงชื่อ ........................................ พนักงานสอบสวน
`.trim();

  const circumstanceDoc = `
พฤติการณ์แห่งคดี
รหัสคดีชั่วคราว: ${caseCode}

ผู้เสียหาย: ${data.victimName}
รายละเอียดพฤติการณ์:
${data.incidentDetail}

ข้อมูลผู้ต้องสงสัย/ผู้เกี่ยวข้อง:
${data.suspectInfo || "ไม่มีข้อมูล"}

พยาน:
${data.witnessInfo || "ไม่มีข้อมูล"}

หลักฐานประกอบ:
${evidenceText}

หมายเหตุเพิ่มเติม:
${data.additionalNote || "ไม่มี"}
`.trim();

  return { complaintDoc, dailyDoc, circumstanceDoc };
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function createWordContent(docs) {
  return `
<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><title>Police Case Documents</title></head>
<body style="font-family:'TH Sarabun New','Sarabun',sans-serif; white-space: pre-wrap;">
<h2>ชุดเอกสารประกอบสำนวนคดี (Mockup)</h2>
<h3>1) คำร้องทุกข์</h3>
<p>${escapeHtml(docs.complaintDoc).replace(/\n/g, "<br>")}</p>
<hr>
<h3>2) บันทึกประจำวัน</h3>
<p>${escapeHtml(docs.dailyDoc).replace(/\n/g, "<br>")}</p>
<hr>
<h3>3) พฤติการณ์แห่งคดี</h3>
<p>${escapeHtml(docs.circumstanceDoc).replace(/\n/g, "<br>")}</p>
</body>
</html>
`.trim();
}

function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function createSimplePdf(lines) {
  const streamLines = ["BT", "/F1 12 Tf", "50 800 Td"];
  lines.forEach((line, idx) => {
    if (idx > 0) streamLines.push("0 -16 Td");
    streamLines.push(`(${escapePdfText(line)}) Tj`);
  });
  streamLines.push("ET");
  const stream = streamLines.join("\n");

  const objects = [];
  const addObj = (content) => {
    objects.push(content);
    return objects.length;
  };

  const catalog = addObj("<< /Type /Catalog /Pages 2 0 R >>");
  addObj("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  addObj("<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>");
  addObj(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  addObj("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function openPrintableWindow(docs) {
  const html = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>พิมพ์เอกสารคดี</title>
  <style>
    body { font-family: "Sarabun", sans-serif; margin: 30px; line-height: 1.5; }
    h1 { margin-bottom: 4px; }
    h2 { margin-top: 28px; border-bottom: 1px solid #ccc; padding-bottom: 6px; }
    .doc { white-space: pre-wrap; }
    .hint { color: #555; font-size: 14px; }
    @media print { .hint { display: none; } }
  </style>
</head>
<body>
  <h1>เอกสารประกอบสำนวนคดี (Mockup)</h1>
  <p class="hint">ใช้เมนูพิมพ์ของเบราว์เซอร์เพื่อบันทึกเป็น PDF</p>
  <h2>1) คำร้องทุกข์</h2>
  <div class="doc">${escapeHtml(docs.complaintDoc)}</div>
  <h2>2) บันทึกประจำวัน</h2>
  <div class="doc">${escapeHtml(docs.dailyDoc)}</div>
  <h2>3) พฤติการณ์แห่งคดี</h2>
  <div class="doc">${escapeHtml(docs.circumstanceDoc)}</div>
</body>
</html>
  `.trim();

  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) return false;
  win.document.open();
  win.document.write(html);
  win.document.close();
  setTimeout(() => win.print(), 300);
  return true;
}

function setGeneratedState(value) {
  generated = value;
  printBtn.disabled = !value;
  wordBtn.disabled = !value;
  pdfBtn.disabled = !value;
}

function fillMockData() {
  const mock = {
    victimName: "นายสมชาย ใจดี",
    victimId: "1103701234567",
    victimPhone: "0891234567",
    victimEmail: "somchai.demo@example.com",
    victimAddress: "99/9 หมู่ 4 ต.บางรัก อ.เมือง จ.เชียงใหม่",
    caseType: "ฉ้อโกงออนไลน์",
    incidentDate: "2026-02-18",
    incidentTime: "20:35",
    incidentPlace: "บ้านพักผู้เสียหาย (ติดต่อผ่านแอปพลิเคชันแชต)",
    damageValue: "120000",
    incidentDetail:
      "ผู้เสียหายพบโฆษณาขายสินค้าออนไลน์ในราคาถูกกว่าท้องตลาด หลังจากโอนเงินแล้วไม่สามารถติดต่อผู้ขายได้และไม่ได้รับสินค้า",
    suspectInfo: "ใช้ชื่อบัญชีผู้รับเงินว่า นายA ธนาคารตัวอย่าง เลขบัญชี 123-4-56789-0",
    witnessInfo: "นางสาวบี เพื่อนผู้เสียหาย เห็นขั้นตอนการโอนเงินทั้งหมด",
    additionalNote: "ผู้เสียหายต้องการอายัดบัญชีปลายทางโดยเร่งด่วน",
  };

  Object.entries(mock).forEach(([name, value]) => {
    const el = form.elements[name];
    if (el) el.value = value;
  });

  const checks = Array.from(form.querySelectorAll('input[name="evidence"]'));
  checks.forEach((el) => {
    el.checked = ["สลิปโอนเงิน", "ข้อความแชต", "ภาพถ่าย"].includes(el.value);
  });

  refreshReview();
  messageEl.textContent = "โหลดข้อมูลตัวอย่างแล้ว สามารถสร้างเอกสารเดโมได้ทันที";
}

prevBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep -= 1;
    showStep(currentStep);
  }
});

nextBtn.addEventListener("click", () => {
  const valid = validateStep(currentStep);
  if (!valid) return;
  if (currentStep < steps.length - 1) {
    currentStep += 1;
    showStep(currentStep);
  }
});

fillMockBtn.addEventListener("click", fillMockData);

form.addEventListener("input", () => {
  if (currentStep === steps.length - 1) refreshReview();
});

generateBtn.addEventListener("click", () => {
  const isValid = validateStep(0) && validateStep(1);
  if (!isValid) {
    messageEl.textContent = "ไม่สามารถสร้างเอกสารได้ เนื่องจากข้อมูลบังคับยังไม่ครบ";
    return;
  }

  const data = collectFormData();
  caseCode = createCaseCode();
  const docs = generateDocs(data);
  complaintDocEl.value = docs.complaintDoc;
  dailyDocEl.value = docs.dailyDoc;
  circumstanceDocEl.value = docs.circumstanceDoc;
  setGeneratedState(true);
  messageEl.textContent = `สร้างเอกสารเรียบร้อยแล้ว (รหัสคดี ${caseCode})`;
});

printBtn.addEventListener("click", () => {
  const docs = {
    complaintDoc: complaintDocEl.value,
    dailyDoc: dailyDocEl.value,
    circumstanceDoc: circumstanceDocEl.value,
  };
  const ok = openPrintableWindow(docs);
  if (!ok) {
    messageEl.textContent = "เบราว์เซอร์บล็อกการเปิดหน้าพิมพ์ กรุณาอนุญาต pop-up แล้วลองใหม่";
  }
});

wordBtn.addEventListener("click", () => {
  const docs = {
    complaintDoc: complaintDocEl.value,
    dailyDoc: dailyDocEl.value,
    circumstanceDoc: circumstanceDocEl.value,
  };
  const content = createWordContent(docs);
  downloadFile(`${caseCode || "case-demo"}-documents.doc`, content, "application/msword");
});

pdfBtn.addEventListener("click", () => {
  const lines = [
    "Police Case Document Pack (Mock PDF)",
    `Case Code: ${caseCode || "CASE-DEMO"}`,
    "",
    "This PDF file is a lightweight mock output.",
    "Use Print to PDF for full Thai-formatted documents.",
  ];
  const pdf = createSimplePdf(lines);
  downloadFile(`${caseCode || "case-demo"}-mock.pdf`, pdf, "application/pdf");
});

renderStepList();
showStep(currentStep);
