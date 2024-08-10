document.addEventListener("DOMContentLoaded", function () {
  displayFeedback();
});

document
  .getElementById("feedbackForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const feedback = document.getElementById("feedback").value;

    if (!name || !email || !feedback) {
      alert("All fields are required!");
      return;
    }

    if (!validateEmail(email)) {
      alert("Invalid email format!");
      return;
    }

    const feedbackData = {
      name: name,
      email: email,
      feedback: feedback,
    };

    saveFeedback(feedbackData);
    displayFeedback();

    alert("Feedback submitted!");
  });

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function saveFeedback(feedback) {
  let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
  feedbackList.push(feedback);
  localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
}

function displayFeedback() {
  const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
  const feedbackContainer = document.getElementById("feedbackList");
  feedbackContainer.innerHTML = "";
  feedbackList.forEach((item) => {
    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("feedback-item");
    feedbackElement.innerHTML = `
            <strong>${item.name}</strong> (${item.email})<br>
            <p>${item.feedback}</p>
            <hr>
        `;
    feedbackContainer.appendChild(feedbackElement);
  });
}
