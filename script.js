const itemsPerPage = 5;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", function () {
  displayFeedback();
  setupPagination();
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

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, feedbackList.length);

  for (let i = startIndex; i < endIndex; i++) {
    const item = feedbackList[i];
    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("feedback-item");
    feedbackElement.innerHTML = `
            <strong>${item.name}</strong> (${item.email})<br>
            <p>${item.feedback}</p>
            <button onclick="editFeedback(${i})">Edit</button>
            <hr>
        `;
    feedbackContainer.appendChild(feedbackElement);
  }

  updatePageInfo();
}

function setupPagination() {
  document.getElementById("prevPage").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displayFeedback();
    }
  });

  document.getElementById("nextPage").addEventListener("click", function () {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const totalPages = Math.ceil(feedbackList.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayFeedback();
    }
  });
}

function updatePageInfo() {
  const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
  const totalPages = Math.ceil(feedbackList.length / itemsPerPage);
  document.getElementById(
    "pageInfo"
  ).textContent = `Page ${currentPage} of ${totalPages}`;
}

function editFeedback(index) {
  const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
  const item = feedbackList[index];

  document.getElementById("name").value = item.name;
  document.getElementById("email").value = item.email;
  document.getElementById("feedback").value = item.feedback;

  document
    .getElementById("feedbackForm")
    .removeEventListener("submit", handleSubmit);

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

      feedbackList[index] = {
        name: name,
        email: email,
        feedback: feedback,
      };

      localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
      displayFeedback();

      alert("Feedback updated!");

      document
        .getElementById("feedbackForm")
        .addEventListener("submit", handleSubmit);
    });
}

function handleSubmit(event) {
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
}
