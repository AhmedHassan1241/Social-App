
const baseUrl = "https://tarmeezacademy.com/api/v1";
  const UrlParams = new URLSearchParams(window.location.search);
const id = UrlParams.get("postId")
// console.log(id);

getPost();
function getPost() {
axios.get(`${baseUrl}/posts/${id}`)
  .then(function (response) {
    // handle success
    let post = response.data.data;
    let tages = "";
    let commentsContent=" ";
      //// if image body not found
      let imgpost = " ";
      if (post.image[0] == undefined) {
        imgpost = ` `;
      } else {
        imgpost = `<img src="${post.image}"  class="card-img-top" alt="...">
              `;
      }
      //////
let comment= post.comments;
      /////tages
      tages = " ";
      for (let i = 0; i < post.tags.length; i++) {
        tages += `<span class="mx-2 align-content-center badge rounded-pill text-bg-success">${post.tags[i].name}</span>`;
      }
      ///////
     
/// post username
document.getElementById("uName").innerText = post.author.username;
///


     // comment conditions
     for(let i=0;i<post.comments_count;i++){
              commentsContent += `
        <div id="comments" class="border border-black rounded-2 m-1">
          <div class="p-2 rounded-2" style="background-color: rgb(220, 214, 214);">
  
              <!-- pic + userName -->
              <div class="fs-6 pb-2">
                  <img class="border border-black border-2 rounded-circle" src="${comment[i].author.profile_image[0]==undefined? "profile-pics/profile.svg": comment[i].author.profile_image}" alt=""  style="width:30px;height:30px">
                  <b>${comment[i].author.username}</b>
                </div>
              <!-- ////pic + userName -->
              <!-- comment body -->
              <div class="p-2 bg-info-subtle rounded-2">
                  ${comment[i].body}
              </div>
              <!-- ///////comment body -->
          </div> 
         </div>    
        `
      }
      
      // comment conditions



/////content post
      let contentPost = `
              <div class="m-auto mt-5" id="post">
                  <div class="card shadow-lg">
                      <div class="card-header fs-6">
                          <img class="border border-black border-2 rounded-circle" src="${post.author.profile_image[0] == undefined? "profile-pics/profile.svg": post.author.profile_image}" alt="" style="width:40px;height:40px">
                          <b>${post.author.username}</b>
                      </div>
                      <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer">${imgpost}
                          <p class="card-text"><small class="text-body-secondary"> ${post.created_at}</small></p>
                          <h5 class="card-title fs-5">${post.title == null ? " " : post.title}</h5>
                          <p class="card-text">${post.body == null ? " " : post.body}</p>
                          <hr>
                          <span class="d-flex align-items-center mb-3">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-dots-fill mx-1" viewBox="0 0 16 16">
                                  <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                              </svg>(${post.comments_count}) Comments ${tages} 
                          </span>
                        ${commentsContent}
                      </div>
                      <div class="card-footer" id="commentAll">
                          <div class="input-group">
                              <input id="comment-content" type="text" class="form-control" placeholder="Write a comment" aria-label="Recipient's username" aria-describedby="sent-btn-comment">
                              <button class="btn btn-outline-primary" type="button" id="sent-btn-comment" onclick="createCommentClicked()">Sent</button>
                          </div> 
                      </div>`;
    document.getElementById("postOnly").innerHTML = contentPost;

////// end of content post

  })
  .catch(function (error) {
    alert(error);
  });
}


