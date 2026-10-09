// Fade-in animation for sections
document.querySelectorAll("section").forEach(sec => {
  sec.classList.add("fade-in");
});

// Handle Application Form
document.getElementById("applicationForm").addEventListener("submit", function(e) {
  e.preventDefault();
  alert("🎉 Application submitted successfully!");
});

// Bursary Checker with clickable buttons (real links)
const bursaries = [
  { name: "IT Bursary", link: "https://www.sita.co.za/bursaries" },
  { name: "Engineering Bursary", link: "https://www.csir.co.za/bursaries" },
  { name: "Medical Bursary", link: "https://www.health.gov.za/bursary" },
  { name: "Business Bursary", link: "https://www.sabursaryhub.co.za/commerce-business" },
  { name: "Law Bursary", link: "https://www.fidfund.co.za/bursaries" },
  { name: "Education Bursary", link: "https://www.nsfas.org.za" }
];

const bursaryList = document.getElementById("bursaryList");

function displayBursaries(list) {
  bursaryList.innerHTML = "";
  list.forEach(b => {
    let li = document.createElement("li");
    let btn = document.createElement("a");
    btn.textContent = b.name;
    btn.href = b.link;
    btn.target = "_blank"; // open in new tab
    btn.className = "bursary-btn";
    li.appendChild(btn);
    bursaryList.appendChild(li);
  });
}
displayBursaries(bursaries);

document.getElementById("searchBursary").addEventListener("input", function() {
  const query = this.value.toLowerCase();
  const filtered = bursaries.filter(b => b.name.toLowerCase().includes(query));
  displayBursaries(filtered);
});

// Payment Simulation
function makePayment() {
  alert("💳 Redirecting to secure payment gateway...");
}

// University Cards Hover Highlight
document.querySelectorAll(".uni-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    card.style.background = "linear-gradient(135deg, #e0f7fa, #ffffff)";
  });
  card.addEventListener("mouseleave", () => {
    card.style.background = "#fff";
  });
});

// Carousel Pause on Hover
const track = document.querySelector(".carousel-track");
if (track) {
  track.addEventListener("mouseenter", () => track.style.animationPlayState = "paused");
  track.addEventListener("mouseleave", () => track.style.animationPlayState = "running");
}

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post("/create-payment", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      { price_data: { currency: "zar", product_data: { name: "Application Fee" }, unit_amount: 5000 }, quantity: 1 }
    ],
    mode: "payment",
    success_url: "http://localhost:5500/success.html",
    cancel_url: "http://localhost:5500/cancel.html"
  });
  res.json({ url: session.url });
});

import mongoose from "mongoose";
mongoose.connect(process.env.MONGO_URI);

const Application = mongoose.model("Application", {
  name: String,
  email: String,
  program: String
});

app.post("/apply", async (req, res) => {
  const appData = new Application(req.body);
  await appData.save();
  res.send("Application saved!");
});

document.getElementById("applyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    program: e.target.program.value
  };

  try {
    const response = await fetch("http://studentassist.onrender.com/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.text();
    document.getElementById("status").textContent = result;
  } catch (error) {
    document.getElementById("status").textContent = "Error sending email.";
  }
});
