// const { default: axios } = require("axios");
const baseUrl = "https://tarmeezacademy.com/api/v1";

getPosts();
let contentPost = "";
let currentPage = 1;
let lastPage = 1;
let countPost = 0;
/////////////////// infinite Scroll////////////////

window.addEventListener("scrollend", function () {
  const endOfPage =
    window.innerHeight + window.scrollY >= document.body.offsetHeight;
  if (endOfPage && currentPage < lastPage) {
    currentPage++;
    getPosts(currentPage);
  }
});

//////////////////////////////////////////////////

function getPosts(page) {
  axios
    .get(`${baseUrl}/posts?limit=20&page=${page}`)
    .then(function (response) {
      // handle success
      let posts = response.data.data;
      let tages = "";
      lastPage = response.data.meta.last_page;
      for (const post of posts) {
        // show od hide edit button
        let user = getCurrentUser();
        let isMyPost = user != null && post.author.id == user.id;
        let editBtnContent = "";

        if (isMyPost) {
          editBtnContent = `
            <button class="btn btn-success btn-sm" onclick="editPostBtnClicked('${encodeURIComponent(
              JSON.stringify(post)
            )}')">Edit</button>
            <button class="btn btn-danger btn-sm" style="" onclick="deletePostBtnClicked('${encodeURIComponent(
              JSON.stringify(post)
            )}')">Delete</button>
            `;
        }
        // show od hide edit button
        //// if image body not found
        let imgpost = " ";
        if (post.image[0] == undefined) {
          imgpost = ` `;
        } else {
          imgpost = `<img src="${post.image}"  class="card-img-top" alt="...">
                `;
        }
        ////
        tages = " ";
        for (let i = 0; i < post.tags.length; i++) {
          tages += `<span class="mx-2 align-content-center badge rounded-pill text-bg-success">${post.tags[i].name}</span>`;
        }
        contentPost += `
                <div class="col-9 m-auto mt-5" id="posts">
                <div class="card shadow-lg">
                <div class="card-header fs-6 d-flex align-items-center justify-content-between">
                <div>
                <img class="border border-black border-2 rounded-circle" src="${
                  post.author.profile_image[0] == undefined
                    ? "profile-pics/profile.svg"
                    : post.author.profile_image
                }" alt="" style="width:40px;height:40px">
                <b>${post.author.username}</b>
                </div>
                <div>
                ${editBtnContent}
                </div>
                </div>
                <div class="card-body" onclick="postClicked(${
                  post.id
                })" style="cursor:pointer">${imgpost}
  <p class="card-text"><small class="text-body-secondary"> ${
    post.created_at
  }</small></p>
  <h5 class="card-title fs-5">${post.title == null ? " " : post.title}</h5>
  <p class="card-text">${post.body == null ? " " : post.body}</p>
  <hr>
  <span class="d-flex align-items-center">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots-fill mx-1" viewBox="0 0 16 16">
  <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
</svg>(${post.comments_count}) Comments ${tages} 
</span>
          </div>
        </div>
      </div>
      `;
      }
      document.getElementById("mainContent").innerHTML = contentPost;
    })
    .catch(function (error) {
      alert(error);
    });
}

function postClicked(postId) {
  window.location = `postDetails.html?postId=${postId}`;
}

function postBtnClicked() {
  let postId = document.getElementById("post-id-input").value;
  let isCreate = postId == null || postId == "";

  const title = document.getElementById("post-title-input").value;
  const body = document.getElementById("post-body-input").value;

  const image = document.getElementById("post-image-input").files[0];
  console.log(image);
  const token = localStorage.getItem("token");

  let formData = new FormData();
  formData.append("title", title);
  formData.append("body", body);
  document.getElementById("post-image-input").files[0]?formData.append("image", image):'';

  let url = ``;
  const headers = {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${token}`,
  };

  if (isCreate) {
    url = `${baseUrl}/posts`;
  } else {
    formData.append("_method", "put");
    url = `${baseUrl}/posts/${postId}`;
  }
  axios
    .post(url, formData, {
      headers: headers,
    })
    .then((response) => {
      const modal = document.getElementById("add-post");
      const instanceModal = bootstrap.Modal.getInstance(modal);
      instanceModal.hide();
      // setupUI()
      window.location.reload();
      showAlert("You Create A New Post Successfully!", "success");
      getPosts();
    })
    .catch((error) => {
      showAlert(error.response.data.message, "danger");
    });
}

function editPostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  document.getElementById("post-modal-submit-btn").innerHTML = "Update";
  document.getElementById("post-id-input").value = post.id;
  document.getElementById("post-modal-title").innerHTML = "Edit Post";
  document.getElementById("post-title-input").value = post.title;
  document.getElementById("post-body-input").value = post.body;
  document.getElementById("post-image-input").files[0] = post.image;
  let postModal = new bootstrap.Modal(document.getElementById("add-post"), {});
  postModal.toggle();
}

function addBtnClicked() {
  document.getElementById("post-modal-submit-btn").innerHTML = "Create";
  document.getElementById("post-id-input").value = "";
  document.getElementById("post-modal-title").innerHTML = "Create A New Post";
  document.getElementById("post-title-input").value = "";
  document.getElementById("post-body-input").value = "";
  let postModal = new bootstrap.Modal(document.getElementById("add-post"), {});
  postModal.toggle();
}
function deletePostBtnClicked(postObject) {
  let post = JSON.parse(decodeURIComponent(postObject));
  console.log(post);

  document.getElementById("delete-post-id-input").value = post.id;

  let postModal = new bootstrap.Modal(
    document.getElementById("delete-post"),
    {}
  );
  postModal.toggle();
}

function confirmPostDelete() {
  const postId = document.getElementById("delete-post-id-input").value;
  const url = `${baseUrl}/posts/${postId}`;
  const token = localStorage.getItem("token");

  axios.delete(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    showAlert("You deleted Post Successfully!", "success");

    window.location.reload();
    console.log('Post deleted:', response);
  })
  .catch(error => {
    console.error('Error deleting post:', error);
  });
  
}
