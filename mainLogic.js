// const baseUrl="https://tarmeezacademy.com/api/v1";
// const baseUrl = "https://tarmeezacademy.com/api/v1";

setupUI();
function setupUI() {
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const userName = document.getElementById("userName");
  const addBtn = document.getElementById("add-btn");
  const imageUpload = document.getElementById("userImg");
  const comment=document.getElementById("CommentAll");

  if (token == null) {
    // User is signed out.
    logoutBtn.style.display = "none";
    loginBtn.style.display = "block";
    registerBtn.style.display = "block";
    userName.style.display = "none";
    imageUpload.style.display = "none";
    if (addBtn != null) {
      addBtn.style.display = "none";
    }
    // comment.style.display = "none";
  } else {
    // User is signed in.
    logoutBtn.style.display = "block";
    userName.style.display = "block";
    imageUpload.style.display = "block";
    if (addBtn != null) {
      addBtn.style.display = "block";
    }
    loginBtn.style.display = "none";
    registerBtn.style.display = "none";
    const user = getCurrentUser();
    userName.innerHTML = user.username;
    imageUpload.innerHTML = `<img  class="border border-black border-2 rounded-circle" src="${user.profile_image?'profile-pics/profile.svg':user.profile_image}" alt="" style="width:40px;height:40px">`;
    // comment.style.display = "block";  
}
}

////// Authentication Functions --------------------------------
function loginBtnClicked() {
  const username = document.getElementById("username-input").value;
  const password = document.getElementById("pass-input").value;
  const params = {
    username: username,
    password: password,
  };
  const url = `${baseUrl}/login`;
  axios.post(url, params).then((response) => {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage;
    const modal = document.getElementById("login-modal");
    const instanceModal = bootstrap.Modal.getInstance(modal);
    instanceModal.hide();
    setupUI();
    showAlert("You are logged in Successfully!", "success");
  });
}

function registerBtnClicked() {
  const name = document.getElementById("register-name-input").value;
  const username = document.getElementById("register-username-input").value;
  const password = document.getElementById("register-pass-input").value;
  const image = document.getElementById("imageUpload").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("username", username);
  formData.append("password", password);
  formData.append("image", image);

  const headers = {
    "Content-Type": "multipart/form-data",
  };
  const url = `${baseUrl}/register`;
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const modal = document.getElementById("register-modal");
      const instanceModal = bootstrap.Modal.getInstance(modal);
      instanceModal.hide();
      setupUI();
      showAlert("You are Register New User Successfully!", "success");
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}

function logOutClicked() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupUI();
  showAlert("You are logged out Successfully!", "success");
}

function showAlert(showMsg, type) {
  const alertPlaceholder = document.getElementById("success-alert");
  let appendAlert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");
    alertPlaceholder.append(wrapper);
  };
  appendAlert(showMsg, type);
  
}

function getCurrentUser() {
  let user = null;
  const storageUser = localStorage.getItem("user");
  if (storageUser != null) {
    user = JSON.parse(storageUser);
  }
  return user;
}

function createCommentClicked(){
    const comment = document.getElementById("comment-content").value;
    let token = localStorage.getItem('token');
    const params = {
        "body": comment,
    };
    const url = `${baseUrl}/posts/${id}/comments`;
    axios.post(url, params,{
        headers: {
            "authorization": `Bearer ${token}`,
        },
    }).then((response) => {
        document.getElementById("comment-content").value = "";
        showAlert("Comment added successfully!", "success");
        getPost();
    }).catch((error) => {
        showAlert(error.response.data.message, "danger");
    });
}

