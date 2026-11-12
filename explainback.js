const form = document.getElementById("session");
const message = document.getElementById("message");
const list = document.getElementById("sessions");
const block = document.getElementById("recallBlock");
const recallButton = document.getElementById("recallButton");
const key = "learning-lab-explainback-v1";
const fields = ["concept", "explanation", "example", "limits"];
const tutorialFields = {
  question: "Question",
  source: "Source",
  attempt: "Small build I tried",
  outcome: "Test or failure",
  changes: "What I changed",
  evidence: "Evidence",
  learned: "What I learned",
  next: "What I would try next",
  readerExercise: "Reader exercise"
};
let sessions = [];
try {
  sessions = JSON.parse(localStorage.getItem(key) || "[]");
} catch {
  message.textContent = "Saved sessions could not be read in this browser.";
}
function reveal(visible) {
  block.hidden = !visible;
  recallButton.hidden = visible;
  form.elements.example.disabled = !visible;
  form.elements.limits.disabled = !visible;
}
function render() {
  list.replaceChildren();
  if (!sessions.length) list.textContent = "Your saved sessions will appear here.";
  sessions.forEach(session => {
    const card = document.createElement("details");
    const title = document.createElement("summary");
    title.textContent = session.concept + " · " + new Date(session.savedAt).toLocaleString();
    const text = document.createElement("p");
    text.style.whiteSpace = "pre-wrap";
    text.textContent = "Explanation\n" + session.explanation + "\n\nExample\n" + session.example + "\n\nLimits\n" + session.limits;
    Object.entries(tutorialFields).forEach(([name, label]) => {
      if (session[name]) text.textContent += "\n\n" + label + "\n" + session[name];
    });
    const button = document.createElement("button");
    button.className = "secondary";
    button.textContent = "Export this session";
    button.onclick = () => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(session,null,2)], {type:"application/json"}));
      const link = document.createElement("a");
      link.href = url;
      link.download = "explainback-session.json";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    card.append(title, text, button);
    list.append(card);
  });
}
recallButton.onclick = () => {
  if (!form.reportValidity()) return;
  if (!fields.slice(0,2).every(name => form.elements[name].value.trim())) {
    message.textContent = "Enter a concept and an explanation first.";
    return;
  }
  message.textContent = "";
  reveal(true);
  form.elements.example.focus();
};
form.onsubmit = event => {
  event.preventDefault();
  if (block.hidden) return;
  const values = Object.fromEntries(fields.map(name => [name, form.elements[name].value.trim()]));
  if (Object.values(values).some(value => !value)) {
    message.textContent = "Fill in each field before saving.";
    return;
  }
  const tutorial = Object.fromEntries(
    Object.keys(tutorialFields).map(name => [name, form.elements[name].value.trim()])
  );
  const updated = [{...values, ...tutorial, savedAt:new Date().toISOString()}, ...sessions];
  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch {
    message.textContent = "Browser storage is unavailable. Copy your answers before leaving this page.";
    return;
  }
  sessions = updated;
  form.reset();
  reveal(false);
  render();
  message.textContent = "Session saved.";
};
render();
