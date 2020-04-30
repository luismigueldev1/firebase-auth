// Your web app's Firebase configuration
// const firebaseConfig = {
// -------------------------------
// -------------------------------
//YOUR FIREBASE CONFIG CREDENTIALS
// -------------------------------
// -------------------------------
//}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const auth = firebase.auth()
const db = firebase.firestore()
const functions = firebase.functions()

//add admin cloud funcions
const adminForm = document.querySelector(".admin-actions")
adminForm.addEventListener("submit", e => {
  e.preventDefault()
  const adminEmail = adminForm["admin-email"].value
  const addAdminRole = functions.httpsCallable("addAdminRole")
  addAdminRole({ email: adminEmail })
    .then(result => {
      adminForm.reset()
      console.log("success", result.data)
      M.toast({
        html: `${result.data.message}`,
        classes: "green"
      })
    })
    .catch(error => {
      console.log("error", error)
      M.toast({
        html: `${error}`,
        classes: "red"
      })
    })
})

//listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin
      setupUI(user)
    })
    //get data from firestore
    db.collection("guides").onSnapshot(
      snapshot => {
        renderGuides(snapshot.docs)
      },
      error => console.log(error.message)
    )
  } else {
    setupUI()
    renderGuides([])
  }
})

//create new guide
const createGuideForm = document.querySelector("#create-guide-form")
createGuideForm.addEventListener("submit", async e => {
  e.preventDefault()
  creat
  const title = createGuideForm["title"].value
  const content = createGuideForm["content"].value

  try {
    await db.collection("guides").add({
      title,
      content
    })
    M.toast({
      html: `Guide: "${title}" created succesfully`,
      classes: "green"
    })
    const modal = document.querySelector("#modal-create")
    M.Modal.getInstance(modal).close()
    createGuideForm.reset()
  } catch (error) {
    M.toast({
      html: error.message,
      classes: "red"
    })
  }
})

//sign up
const signupForm = document.querySelector("#signup-form")
signupForm.addEventListener("submit", async e => {
  e.preventDefault()
  //Get Signup info
  const email = signupForm["signup-email"].value
  const password = signupForm["signup-password"].value
  const bio = signupForm["signup-bio"].value
  //Signup user
  try {
    const response = await auth.createUserWithEmailAndPassword(email, password)
    const uid = await response.user.uid
    await db
      .collection("users")
      .doc(uid)
      .set({ bio })
      .then(() => console.log("User Data added succesfully "))
      .catch(error =>
        console.log("An error has ocurred adding user doc: ", error.message)
      )
    //toast notification
    M.toast({
      html: "User created succesfully, now log in",
      classes: "green"
    })

    //modal close & form reset
    const modal = document.querySelector("#modal-signup")
    M.Modal.getInstance(modal).close()
    signupForm.reset()
  } catch (error) {
    M.toast({
      html: error.message,
      classes: "red"
    })
  }
})

//logout
const logout = document.querySelector("#logout")
logout.addEventListener("click", e => {
  e.preventDefault()
  auth.signOut().then(
    M.toast({
      html: `User Logout`,
      classes: "orange"
    })
  )
})

//login
const loginForm = document.querySelector("#login-form")
loginForm.addEventListener("submit", async e => {
  e.preventDefault()

  const email = loginForm["login-email"].value
  const password = loginForm["login-password"].value

  try {
    const response = await auth.signInWithEmailAndPassword(email, password)
    const data = await response.user
    M.toast({
      html: "Log in succesfully! Welcome " + data.email,
      classes: "green"
    })

    //modal close & form reset
    const modal = document.querySelector("#modal-login")
    M.Modal.getInstance(modal).close()
    loginForm.reset()
  } catch (error) {
    M.toast({
      html: error.message,
      classes: "red"
    })
  }
})
