 const sellerName = "STOCKTUTOR";
    const redirectUrl = "https://google.com";
    const webhook = "https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZhMDYzNjA0M2Q1MjZmNTUzMDUxM2Ii_pc";
    let currentStep = 1;

    document.getElementById("actionBtn").addEventListener("click", async () => {
      if (currentStep === 1) {
        if (!validateForm()) return;
        goToStep2();
        currentStep = 2;
        document.getElementById("actionBtn").textContent = "Submit";
      } else {
        await handleSubmit();
      }
    });

function goToStep2() {
  // Hide Step 1 content, show Step 2 content
  document.getElementById("step1").classList.add("hidden");
  document.getElementById("step2").classList.remove("hidden");

  // Change footer indicators
  document.getElementById("step1Indicator").innerHTML = `<i class="fas fa-lock text-gray-400"></i>`;
  document.getElementById("step2Indicator").innerHTML = `<span class="text-blue-600 font-semibold">Step 2</span>`;
}

function goToStep1() {
  // Show Step 1 content, hide Step 2 content
  document.getElementById("step1").classList.remove("hidden");
  document.getElementById("step2").classList.add("hidden");

  // Change footer indicators
  document.getElementById("step1Indicator").innerHTML = `<span class="text-blue-600 font-semibold">Step 1</span>`;
  document.getElementById("step2Indicator").innerHTML = `<i class="fas fa-lock text-gray-400"></i>`;
}



    function validateForm() {
      let valid = true;

      const name = document.getElementById("name").value.trim();
      if (!name) {
        document.getElementById("nameError").classList.remove("hidden");
        valid = false;
      } else {
        document.getElementById("nameError").classList.add("hidden");
      }

      const email = document.getElementById("email").value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        document.getElementById("emailError").classList.remove("hidden");
        valid = false;
      } else {
        document.getElementById("emailError").classList.add("hidden");
      }

      const phone = document.getElementById("phone").value.trim();
      if (!/^\d{10}$/.test(phone)) {
        document.getElementById("phoneError").classList.remove("hidden");
        valid = false;
      } else {
        document.getElementById("phoneError").classList.add("hidden");
      }

      return valid;
    }

    function getFormData() {
      return {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        revenue: document.querySelector('input[name="revenue"]:checked')?.value || "",
        challenge: document.querySelector('input[name="challenge"]:checked')?.value || "",
        profitable: document.querySelector('input[name="profitable"]:checked')?.value || ""
      };
    }

    function getFormDataWithUTM() {
      const payload = getFormData();
      const urlParams = new URLSearchParams(window.location.search);
      payload.utmParams = {
        utm_source: urlParams.get("utm_source"),
        utm_medium: urlParams.get("utm_medium"),
        utm_campaign: urlParams.get("utm_campaign"),
        utm_adgroup: urlParams.get("utm_adgroup"),
        utm_content: urlParams.get("utm_content"),
        utm_term: urlParams.get("utm_term"),
        adsetName: urlParams.get("adset name"),
        adName: urlParams.get("ad name"),
      };
      return payload;
    }

 async function handleSubmit() {
  const btn = document.getElementById("actionBtn");
  btn.disabled = true;
  btn.textContent = "Submitting...";

  try {
    const payload = getFormDataWithUTM();
    console.log("Payload being sent to webhook:", payload); 

    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const res = await fetch(`https://growthifymedia-services.onrender.com/api/free-lead/${sellerName}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.success) {
      console.log("Your form has been submitted successfully!");
      window.location.href = redirectUrl;
    } else {
      console.log(result.message || "Something went wrong. Try again.");
      btn.disabled = false;
      btn.textContent = "Submit";
    }
  } catch {
    console.log("Submission failed. Please try again.");
    btn.disabled = false;
    btn.textContent = "Submit";
  }
}
