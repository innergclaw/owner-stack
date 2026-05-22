const SUPABASE_LEAD_ENDPOINT =
  "https://zkyhhoxcrjkhywblzehr.supabase.co/functions/v1/owner-stack-lead";

const forHireForm = document.querySelector("#forHireForm");
const forHireMessage = document.querySelector("#forHireMessage");

async function submitForHireLead(formData) {
  formData.set("pageUrl", window.location.href);
  formData.set("referrer", document.referrer || "Direct / unknown");
  formData.set("userAgent", navigator.userAgent);

  const response = await fetch(SUPABASE_LEAD_ENDPOINT, {
    method: "POST",
    body: new URLSearchParams(formData).toString(),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Project inquiry failed");
  }
}

forHireForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = forHireForm.querySelector("button");
  const formData = new FormData(forHireForm);
  submitButton.disabled = true;
  forHireMessage.textContent = "Sending project details...";

  try {
    await submitForHireLead(formData);
    forHireMessage.textContent = "Project received. I will follow up from here.";
    forHireForm.reset();
  } catch {
    forHireMessage.textContent = "Saved on your side, but the live send failed. Email nasgfx215@gmail.com directly.";
  } finally {
    submitButton.disabled = false;
  }
});
