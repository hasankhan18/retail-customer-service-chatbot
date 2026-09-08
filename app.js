const messages = document.getElementById("messages");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const resetButton = document.getElementById("resetButton");

const replies = [
  { keys: ["track", "where is my order", "order status", "order"], answer: "I can help you track it. This demo order <strong>RC-10458</strong> is packed and expected to arrive tomorrow between 12:00 and 16:00. In a real store, I would securely ask for your order number.", follow: ["Return an item", "Delivery options"] },
  { keys: ["return", "send back", "exchange"], answer: "Most unused items can be returned within <strong>30 days</strong> with proof of purchase. Start online, pack the item, and attach the prepaid return label. Refunds normally reach the original payment method within 3–5 business days.", follow: ["How long does a refund take?", "Can I return in store?"] },
  { keys: ["refund"], answer: "After the returned item is checked, refunds usually appear on the original payment method within <strong>3–5 business days</strong>. Bank processing times can vary.", follow: ["Return an item", "Talk to a person"] },
  { keys: ["delivery", "shipping"], answer: "Standard delivery takes <strong>2–4 business days</strong> and express delivery takes <strong>1–2 business days</strong>. Orders over €50 qualify for free standard delivery.", follow: ["Track my order", "Do you deliver internationally?"] },
  { keys: ["international"], answer: "This demonstration store currently delivers within Finland. International delivery would depend on the destination and product restrictions.", follow: ["Delivery options", "Store hours"] },
  { keys: ["hour", "open", "closing"], answer: "Our demonstration store is open <strong>Monday–Friday 09:00–20:00</strong>, Saturday 10:00–18:00, and Sunday 12:00–17:00.", follow: ["Where is the store?", "Talk to a person"] },
  { keys: ["where is the store", "location", "address"], answer: "The demonstration store is located in Kokkola city centre. A real chatbot could connect to a store locator and show the nearest branch based on your selected location.", follow: ["Store hours", "Delivery options"] },
  { keys: ["payment", "pay", "card", "cash"], answer: "We accept Visa, Mastercard, MobilePay and common Finnish online banking methods. Never send card numbers in this chat.", follow: ["Is payment secure?", "Return an item"] },
  { keys: ["secure"], answer: "Payments are processed through an encrypted payment provider, and the chatbot does not store payment-card details. Always complete payment only on the store’s official checkout page.", follow: ["Payment methods", "Talk to a person"] },
  { keys: ["stock", "available", "product"], answer: "I can check product information and availability. Tell me the product name, size or colour you are looking for. This thesis demo uses sample data rather than live inventory.", follow: ["Do you have running shoes?", "Talk to a person"] },
  { keys: ["running shoe", "shoes"], answer: "The sample catalogue has the <strong>NordRun Everyday</strong> in black and navy, sizes 40–45, for €69.90. Store availability is demonstration data.", follow: ["Is size 42 available?", "Return policy"] },
  { keys: ["size 42"], answer: "Yes—size 42 is available in both black and navy in the sample catalogue. Would you like help with another product?", follow: ["What payment methods?", "Delivery options"] },
  { keys: ["human", "person", "agent", "staff", "complaint"], answer: "Of course. In a real store, I would transfer this conversation to a customer-service agent. Support hours are Monday–Friday, 09:00–17:00.", follow: ["Store hours", "Start over"] },
  { keys: ["hello", "hi", "hey"], answer: "Hello! What can I help you with today? You can ask about an order, return, delivery, product, payment or store information.", follow: ["Track my order", "Return an item", "Store hours"] },
  { keys: ["thank", "thanks"], answer: "You’re welcome! Is there anything else I can help you with?", follow: ["Track my order", "Start over"] }
];

function currentTime() {
  return new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit" }).format(new Date());
}
function scrollBottom() { messages.scrollTop = messages.scrollHeight; }
function addMessage(text, sender) {
  const row = document.createElement("div");
  row.className = `message-row ${sender}`;
  if (sender === "bot") row.innerHTML = '<div class="mini-avatar" aria-hidden="true">RC</div>';
  const content = document.createElement("div");
  content.innerHTML = `<div class="bubble"><p>${text}</p></div><span class="time">${currentTime()}</span>`;
  row.appendChild(content);
  messages.appendChild(row);
  scrollBottom();
}
function addActions(actions) {
  if (!actions?.length) return;
  const wrap = document.createElement("div");
  wrap.className = "quick-actions";
  actions.forEach(label => {
    const button = document.createElement("button");
    button.type = "button"; button.textContent = label; button.dataset.message = label;
    wrap.appendChild(button);
  });
  messages.appendChild(wrap); scrollBottom();
}
function showTyping() {
  const row = document.createElement("div");
  row.className = "message-row bot typing";
  row.id = "typing";
  row.innerHTML = '<div class="mini-avatar" aria-hidden="true">RC</div><div><div class="bubble"><i></i><i></i><i></i></div></div>';
  messages.appendChild(row); scrollBottom();
}
function getReply(text) {
  const clean = text.toLowerCase();
  if (clean.includes("start over")) return { answer: "No problem—we can start again. What would you like help with?", follow: ["Track my order", "Return an item", "Delivery options", "Store hours"] };
  const match = replies.find(item => item.keys.some(key => clean.includes(key)));
  return match || { answer: "I’m sorry, I don’t have a confident answer for that. I can help with orders, returns, refunds, delivery, payments, products and store hours—or connect you with a staff member.", follow: ["Talk to a person", "Track my order", "Return an item"] };
}
function respond(text) {
  document.querySelectorAll(".quick-actions").forEach(el => el.remove());
  addMessage(text.replace(/[<>]/g, ""), "user");
  showTyping();
  const reply = getReply(text);
  setTimeout(() => {
    document.getElementById("typing")?.remove();
    addMessage(reply.answer, "bot");
    addActions(reply.follow);
  }, 650);
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  input.value = ""; input.style.height = "auto"; respond(text);
});
input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
});
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 110) + "px";
});
messages.addEventListener("click", event => {
  const button = event.target.closest("[data-message]");
  if (button) respond(button.dataset.message);
});
resetButton.addEventListener("click", () => {
  messages.innerHTML = '<div class="date-label">Today</div><div class="message-row bot"><div class="mini-avatar" aria-hidden="true">RC</div><div><div class="bubble"><p>Hello! I’m the RetailCare Assistant. How can I help with your shopping today?</p></div><span class="time">Now</span></div></div>';
  addActions(["Where is my order?", "Return an item", "Delivery options", "Store hours"]);
  input.focus();
});
