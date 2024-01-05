window.onload = function () {
  let namesList = getNames() || []

  if (namesList.length > 0) {
    populateNames(namesList)
  }

  checkForHashAndSecret()

  function checkForHashAndSecret () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    console.log(queryString)
    console.log(urlParams)

    const hash = urlParams.get('hash');
    const secret = urlParams.get('secret');

    console.log(hash)
    console.log(secret)

    if (hash == null || secret == null) {
      console.log("No hash or secret found")
      return
    }

    const pairings = decryptPairings(hash, secret);
    console.log(pairings);
  }

  function encryptPairings(pairings, secretKey) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(pairings), secretKey).toString();
    console.log(encrypted);
    return encrypted
  }

  function decryptPairings(encryptedHash, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedHash, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(originalText);
  }

  function populateNames (names) {
    const nameList = document.getElementById("nameList")

    names.forEach(name => {
      const nameItem = document.createElement("li")
      nameItem.textContent = name

      const deleteBtn = document.createElement("button")
      deleteBtn.textContent = "Remove"
      deleteBtn.className = "delete-btn"
      deleteBtn.onclick = function () {
          nameList.removeChild(nameItem)

          const index = namesList.indexOf(name)
          namesList.splice(index, 1)

          setNames()
      }

      nameItem.appendChild(deleteBtn)
      nameList.appendChild(nameItem)
    })

    setNames()
  }

  function getNames () {
    return storageWrapper(() => {
      const storedNames = localStorage.getItem("names")
      return storedNames ? storedNames.split(",") : null
    })
  }

  function setNames () {
    storageWrapper(() => {
      const joinedNames = namesList.join(",")
      localStorage.setItem("names", joinedNames)
    })
  }

  function storageWrapper (callback) {
    return typeof(localStorage) !== "undefined" ? callback() : null
  }

  /* Event Handlers */
  window.clearBuddies = function () {
    const nameList = document.getElementById("nameList")
    nameList.innerHTML = ""

    namesList = []
    setNames()
  }

  window.submitName = function () {
    const nameInput = document.getElementById("nameInput")
    const name = nameInput.value

    if (name === "") {
      window.alert("Please enter a name!")
      return
    }

    namesList.push(name)

    populateNames([name])

    nameInput.value = ""
    nameInput.focus()
  }

  window.pairRandomBuddies = function () {
    const joinedNames = namesList.join(", ")
    window.alert("Your random buddy pairings are: " + joinedNames)
  }
  /* /Event Handlers */
}
