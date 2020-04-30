//Materialize Components
document.addEventListener("DOMContentLoaded", function () {
  const modals = document.querySelectorAll(".modal")
  M.Modal.init(modals)

  const collapsibles = document.querySelectorAll(".collapsible")
  M.Collapsible.init(collapsibles)
})

//render correct links
const loggedOutLinks = document.querySelectorAll(".logged-out")
const loggedInLinks = document.querySelectorAll(".logged-in")
const userDetails = document.querySelector(".account-details")
const adminItems = document.querySelectorAll(".admin")

function setupUI(user) {
  if (user) {
    //check if user is an admin
    if (user.admin) {
      adminItems.forEach(item => (item.style.display = "block"))
    }
    //Show user info on Account Modal
    db.collection("users")
      .doc(user.uid)
      .get()
      .then(doc => {
        const data = doc.data()
        const htmlUserDetails = `
        <div>Logged in as: ${user.email}</div>
        <div>Biografy: ${data.bio}</div>
        <div class="pink-text">${user.admin ? "Admin" : ""}</div>`
        userDetails.innerHTML = htmlUserDetails
      })

    //toggle ui elements
    loggedInLinks.forEach(item => (item.style.display = "block"))
    loggedOutLinks.forEach(item => (item.style.display = "none"))
  } else {
    //Hidden admin items
    adminItems.forEach(item => (item.style.display = "none"))

    //Hidden user info on Account Modal
    userDetails.innerHTML = ""

    //toggle ui elements
    loggedInLinks.forEach(item => (item.style.display = "none"))
    loggedOutLinks.forEach(item => (item.style.display = "block"))
  }
}

//render gudies
const guides = document.querySelector(".guides")
function renderGuides(data) {
  let html = ""
  if (data.length) {
    data.forEach(doc => {
      const guide = doc.data()
      const li = ` 
        <li>
          <div class="collapsible-header grey lighten-3 ">
            ${guide.title}
          </div>
          <div class="collapsible-body white">
            <span>${guide.content}</span>
          </div>
        </li>
        `
      html += li
    })
    guides.innerHTML = html
  } else {
    guides.innerHTML = '<h5 class="center"> Log in to view guides</h5>'
  }
}
