const itemsPerPage = 5;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", function () {
  if (isUserLoggedIn()) {
    if (isAdmin()) {
      document.getElementById("auth").style.display = "none";
      document.getElementById("adminSection").style.display = "block";
      document.getElementById("userSection").style.display = "none";
      displayFeedbackAdmin();
    } else {
      document.getElementById("auth").style.display = "none";
      document.getElementById("adminSection").style.display = "none";
      document.getElementById("userSection").style.display = "block";
      displayFeedbackUser();
    }
  } else {
    document.getElementById("adminSection").style.display = "none";
    document.getElementById("userSection").style.display = "none";
  }
});

document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "admin" && password === "adminpass") {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userRole", "admin");
      document.getElementById("auth").style.display = "none";
      document.getElementById("adminSection").style.display = "block";
      displayFeedbackAdmin();
    } else if (username === "user" && password === "userpass") {
      localStorage.setItem("userLoggedIn", "true");
      localStorage.setItem("userRole", "user");
      document.getElementById("auth").style.display = "none";
      document.getElementById("userSection").style.display = "block";
      displayFeedbackUser();
    } else {
      alert("Invalid username or password");
    }
  });

document
  .getElementById("feedbackForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const feedback = document.getElementById("feedback").value;
    const rating = document.getElementById("rating").value;

    if (!name || !email || !feedback || !rating) {
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
      rating: rating,
    };

    saveFeedback(feedbackData);
    displayFeedbackUser();

    alert("Feedback submitted!");
  });

document.getElementById("viewFeedback").addEventListener("click", function () {
  displayFeedbackAdmin();
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

function displayFeedbackAdmin() {
  const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
  const feedbackContainer = document.getElementById("feedbackList");
  feedbackContainer.innerHTML = "";

  for (let i = 0; i < feedbackList.length; i++) {
    const item = feedbackList[i];
    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("feedback-item");
    feedbackElement.innerHTML = `
            <strong>${item.name}</strong> (${item.email})<br>
            <p>${item.feedback}</p>
            <p>Rating: ${item.rating}</p>
            <button onclick="editFeedback(${i})">Edit</button>
            <button onclick="deleteFeedback(${i})">Delete</button>
            <hr>
        `;
    feedbackContainer.appendChild(feedbackElement);
  }
}

function displayFeedbackUser() {
  const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
  const feedbackContainer = document.getElementById("feedbackListUser");
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
            <p>Rating: ${item.rating}</p>
            <button onclick="editFeedback(${i})">Edit</button>
            <button onclick="deleteFeedback(${i})">Delete</button>
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
      displayFeedbackUser();
    }
  });

  document.getElementById("nextPage").addEventListener("click", function () {
    const feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
    const totalPages = Math.ceil(feedbackList.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      displayFeedbackUser();
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
  document.getElementById("rating").value = item.rating;

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
      const rating = document.getElementById("rating").value;

      if (!name || !email || !feedback || !rating) {
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
        rating: rating,
      };

      localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
      displayFeedbackUser();

      alert("Feedback updated!");

      document
        .getElementById("feedbackForm")
        .addEventListener("submit", handleSubmit);
    });
}

function deleteFeedback(index) {
  let feedbackList = JSON.parse(localStorage.getItem("feedbackList")) || [];
  feedbackList.splice(index, 1);
  localStorage.setItem("feedbackList", JSON.stringify(feedbackList));
  displayFeedbackUser();
}

function isUserLoggedIn() {
  return localStorage.getItem("userLoggedIn") === "true";
}

function isAdmin() {
  return localStorage.getItem("userRole") === "admin";
}
