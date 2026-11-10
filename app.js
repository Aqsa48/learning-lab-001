const sources = {
  retrieval: ["The Learning Scientists · Retrieval practice", "https://www.learningscientists.org/retrieval-practice"],
  mollick: ["Ethan Mollick · Seven ways of using AI in class", "https://www.oneusefulthing.org/p/assigning-ai-seven-ways-of-using"],
  cs50: ["Harvard CS50 · Artificial Intelligence", "https://cs50.harvard.edu/x/weeks/ai/"],
  harvard: ["Harvard Online · Agentic AI Foundations", "https://harvardonline.harvard.edu/course/agentic-ai-foundations"],
  mit: ["MIT Professional Education · No Code and Agentic AI", "https://professional.mit.edu/course-catalog/no-code-and-agentic-ai"],
  coursera: ["DeepLearning.AI on Coursera · Agentic AI", "https://www.coursera.org/learn/dlai-agentic-ai"],
  ibm: ["IBM on Coursera · RAG and Agentic AI", "https://www.coursera.org/professional-certificates/ibm-rag-and-agentic-ai"],
  hfllm: ["Hugging Face · LLM Course", "https://huggingface.co/learn/llm-course/en/chapter1/1"],
  hfagents: ["Hugging Face · Agents Course Unit 1", "https://huggingface.co/learn/agents-course/en/unit1/introduction"],
  react: ["React · Quick Start", "https://react.dev/learn"],
  bootcamp: ["Full Stack Deep Learning · LLM Bootcamp", "https://fullstackdeeplearning.com/llm-bootcamp/"],
  ollama: ["Ollama · Quickstart", "https://docs.ollama.com/quickstart"],
  structured: ["Ollama · Structured outputs", "https://docs.ollama.com/capabilities/structured-outputs"],
  embeddings: ["Ollama · Embeddings", "https://docs.ollama.com/capabilities/embeddings"],
  tools: ["Ollama · Tool calling", "https://docs.ollama.com/capabilities/tool-calling"],
  pages: ["GitHub Docs · GitHub Pages quickstart", "https://docs.github.com/en/pages/quickstart"],
  mdn: ["MDN · Web Storage API", "https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API"]
};
const freeStudy = [
  ["retrieval","Start with the video or poster. Then close it and try the recall exercise."],
  ["hfagents","Read What are Tools?, Messages and Special Tokens, and the Thought–Action–Observation Cycle."],
  ["react","Read Responding to events and Updating the screen. Then try saving one form value."],
  ["retrieval","Use the bookmark prompts to prepare the retest. Review them after you finish answering."],
  ["pages","Use the branch deployment steps when your draft and demo are ready."],
  ["mdn","Read the localStorage section. Save, reload and inspect a fictional entry."],
  ["retrieval","Use the prompt examples to write questions that require recall or a new example."],
  ["cs50","Use the lecture or notes. Focus on language models, prompting and hallucinations."],
  ["hfllm","Open Inference with LLMs and Bias and limitations from the chapter menu."],
  ["ollama","Follow the local setup. Choose a local model to avoid cloud usage charges."],
  ["cs50","Read the prompt engineering notes and change one instruction at a time."],
  ["structured","Read Generating structured JSON. Use the sample or write your own valid and invalid fixtures."],
  ["ollama","Use local chat, or write a sample feedback response by hand to test your review flow."],
  ["mdn","Use the storage examples to check what happens in a fresh browser profile."],
  ["embeddings","Read the introduction and CLI example. The worksheet vectors work without a download."],
  ["bootcamp","Open Augmented Language Models and focus on retrieval before generation."],
  ["bootcamp","Open Augmented Language Models and identify where retrieved context enters the prompt."],
  ["hfagents","Read the Thought–Action–Observation lesson and trace two examples on paper."],
  ["tools","Start with Calling a single tool. Use a sample tool-call object if your model lacks tool support."],
  ["hfagents","Read the Actions and Observe lessons. Replay a two-step example with mocked responses."],
  ["bootcamp","Open the Agents lecture. Compare tool use with a single model response on the same inputs."],
  ["bootcamp","Open LLMOps and focus on testing. Build your ten cases before changing the prototype."],
  ["hfllm","Read Bias and limitations. Map which parts of your own app handle personal data."],
  ["pages","Follow the branch publishing quickstart for the manual static demo."],
  ["retrieval","Return to the original reading and check how you describe recall in your draft."],
  ["bootcamp","Open Project Walkthrough: askFSDL. Use it to study how a workflow can be shown step by step."],
  ["retrieval","Check the wording of your learning claims against the source and your own scores."],
  ["pages","Use the published URL shown under Settings → Pages and test it before sharing."]
];
const themes = [
  ["Agent workflows and tool use", ["harvard","mit","coursera","ibm","hfagents","bootcamp"]],
  ["Hands-on exercises or projects", ["harvard","mit","coursera","ibm","hfagents","bootcamp"]],
  ["Evaluation, benchmarking or reliability", ["harvard","mit","coursera","ibm","hfagents","bootcamp"]],
  ["Retrieval or grounded generation", ["mit","ibm","hfagents","bootcamp"]],
  ["Prompting or model foundations", ["mit","ibm","hfagents","bootcamp"]],
  ["Risk or human oversight as an explicit topic", ["harvard","mit"]]
];
const weeks = ["Experiment and prototype", "Models and local AI", "Retrieval and agents", "Evaluate and publish"];
const checks = {learn:"Answer the recall question",build:"Run the exercise",proof:"Verify the result and record evidence"};
const noteNames = {learning:"What I learned",evidence:"Evidence and next step",scene:"Scene and visual",voiceover:"Voiceover and duration"};
const $ = id => document.getElementById(id);
const key = "learning-lab-001-v2";
let records = {};
try {
  const currentVersion = localStorage.getItem(key);
  if (currentVersion) {
    records = JSON.parse(currentVersion) || {};
  } else {
    const previous = JSON.parse(localStorage.getItem("learning-lab-001-v1") || "{}") || {};
    const dayMapping = [0, 2, 5, 4, null, 6, null];
    lessons.forEach((_, i) => {
      const prior = previous[i < 7 ? dayMapping[i] : i];
      if (prior) records[i] = i < 7 ? {checks:{}, notes:prior.notes, done:false} : prior;
    });
  }
} catch {
  $("storageError").textContent = "Saved progress could not be read in this browser.";
}
let current = 0;
let pending = null;
const record = i => records[i] || (records[i] = {checks:{}, notes:{}, done:false});
const label = i => String(i + 1).padStart(2,"0");
const firstOpen = () => lessons.findIndex((_, i) => !record(i).done);
const checklist = [...document.querySelectorAll("[data-check]")];
const fields = [...document.querySelectorAll("[data-note]")];
const dayButtons = [];
const missingFor = i => {
  const entry = record(i);
  const missing = Object.keys(checks).filter(k => !entry.checks[k]).map(k => checks[k]);
  if (!entry.notes.evidence?.trim()) missing.push("Add evidence in the daily notes");
  return missing;
};
function save() {
  try { localStorage.setItem(key, JSON.stringify(records)); }
  catch { $("storageError").textContent = "Browser storage is unavailable. Export your notes before closing this tab."; }
}
function update() {
  const count = lessons.filter((_, i) => record(i).done).length;
  $("count").textContent = count + " / 28 days";
  $("progress").value = count;
  $("resume").textContent = count === 28 ? "Review the roadmap" : (count ? "Resume Day " : "Start Day ") + label(firstOpen());
  dayButtons.forEach((button,i) => {
    button.textContent = (record(i).done ? "✓ " : "") + label(i) + " · " + lessons[i][0];
    button.setAttribute("aria-current", String(i === current));
  });
  $("finish").textContent = record(current).done ? "Reopen this day" : "Mark day complete";
}
function show(i, focus = true) {
  current = i;
  const [title, , concept, task, proof, recall, shot] = lessons[i];
  $("dayLabel").textContent = "WEEK " + (Math.floor(i / 7) + 1) + " / DAY " + label(i);
  $("dayTitle").textContent = title;
  $("concept").textContent = concept;
  const [freeSource, studyTip] = freeStudy[i];
  const [sourceTitle, sourceUrl] = sources[freeSource];
  const reading = $("reading");
  reading.textContent = "Free study material · " + sourceTitle;
  reading.href = sourceUrl;
  let tip = $("studyTip");
  if (!tip) {
    tip = document.createElement("p");
    tip.id = "studyTip";
    tip.className = "small";
    reading.after(tip);
  }
  tip.textContent = studyTip;
  $("exercise").textContent = task;
  $("deliverable").textContent = proof;
  $("recall").textContent = recall;
  $("shot").textContent = shot;
  $("feedback").textContent = "";
  checklist.forEach(el => { el.checked = Boolean(record(i).checks[el.dataset.check]); });
  fields.forEach(el => { el.value = record(i).notes[el.dataset.note] || ""; });
  $("prev").disabled = i === 0;
  $("next").disabled = i === lessons.length - 1;
  dayButtons[i].closest("details").open = true;
  update();
  if (focus) $("lesson").focus();
}
function warn(message, destination) {
  pending = destination;
  $("missingText").textContent = message;
  $("keep").hidden = destination === null;
  $("missing").showModal();
}
function navigate(i) {
  const earlier = lessons.findIndex((_, d) => d < i && !record(d).done);
  if (i > current && earlier >= 0) {
    const missing = missingFor(earlier);
    warn("Day " + label(earlier) + " is incomplete. " + (missing.length ? missing.join(". ") + "." : "Mark the day complete after reviewing your work."), i);
    return;
  }
  show(i);
}
weeks.forEach((week,w) => {
  const group = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = "W" + (w + 1) + " · " + week;
  group.append(summary);
  for (let i = w*7; i < w*7+7; i++) {
    const button = document.createElement("button");
    button.onclick = () => navigate(i);
    group.append(button);
    dayButtons.push(button);
  }
  $("days").append(group);
});
checklist.forEach(el => { el.onchange = () => {
  const entry = record(current);
  entry.checks[el.dataset.check] = el.checked;
  if (!el.checked) entry.done = false;
  save(); update();
}; });
fields.forEach(el => { el.oninput = () => {
  const entry = record(current);
  entry.notes[el.dataset.note] = el.value;
  if (missingFor(current).length) entry.done = false;
  save(); update();
}; });
$("finish").onclick = () => {
  const entry = record(current);
  const missing = missingFor(current);
  if (!entry.done && missing.length) {
    warn(missing.join(". ") + ".", null);
    return;
  }
  entry.done = !entry.done;
  save(); update();
  $("feedback").textContent = entry.done ? "Day " + label(current) + " complete." : "Day reopened.";
};
$("missing").addEventListener("close", () => {
  const dialog = $("missing");
  if (dialog.returnValue === "continue" && pending !== null) show(pending);
  if (dialog.returnValue === "review") {
    if (pending !== null) show(firstOpen());
    else $("lesson").focus();
  }
  pending = null;
  dialog.returnValue = "";
});
$("resume").onclick = () => show(Math.max(0,firstOpen()));
$("prev").onclick = () => navigate(current - 1);
$("next").onclick = () => navigate(current + 1);
$("export").onclick = () => {
  const lines = ["# Learning Lab 001", ""];
  lessons.forEach(([title],i) => {
    const entry = record(i);
    lines.push("## Day " + label(i) + " · " + title + " (" + (entry.done ? "complete" : "open") + ")", "");
    Object.entries(checks).forEach(([k,name]) => lines.push("- [" + (entry.checks[k] ? "x" : " ") + "] " + name));
    Object.entries(noteNames).forEach(([k,name]) => lines.push("", "### " + name, entry.notes[k] || ""));
    lines.push("");
  });
  const url = URL.createObjectURL(new Blob([lines.join("\n")], {type:"text/markdown;charset=utf-8"}));
  const link = document.createElement("a");
  link.href = url; link.download = "learning-lab-001-journal.md"; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
const matrix = document.createElement("table");
matrix.innerHTML = "<thead><tr><th scope='col'>Topic</th><th scope='col'>Outlines</th></tr></thead><tbody></tbody>";
themes.forEach(([topic, keys]) => {
  const row = matrix.tBodies[0].insertRow();
  row.insertCell().textContent = topic;
  const cell = row.insertCell();
  const detail = document.createElement("details");
  const summary = document.createElement("summary");
  summary.textContent = keys.length + " / 6";
  detail.append(summary, keys.map(k => sources[k][0].split(" · ")[0]).join(", "));
  cell.append(detail);
});
$("matrix").append(matrix);
["harvard","mit","coursera","ibm","hfagents","bootcamp"].forEach(k => {
  const item = document.createElement("li");
  const link = document.createElement("a");
  [link.textContent, link.href] = sources[k];
  if (["harvard","mit","coursera","ibm"].includes(k)) link.textContent += " (syllabus reference)";
  item.append(link); $("sourceList").append(item);
});
show(Math.max(0, firstOpen()), false);
