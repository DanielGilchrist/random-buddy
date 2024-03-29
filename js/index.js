window.onload = function () {
  let namesList = getNames() || []

  if (namesList.length > 0) {
    populateNames(namesList)
  }

  function populateNames (names) {
    const nameList = document.getElementById("name-list")

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

  function clearNames () {
    namesList = []
    setNames()
  }

  function storageWrapper (callback) {
    return typeof(localStorage) !== "undefined" ? callback() : null
  }

  function encryptPairings(pairings, secretKey) {
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(pairings), secretKey).toString()
    return encrypted
  }

  function pairBuddies () {
    const shuffledNames = namesList.sort((_a, _b) => 0.5 - Math.random())
    const pairings = []

    for (let i = 0; i < shuffledNames.length; i += 2) {
      const pair = [shuffledNames[i], shuffledNames[i+1]]
      pairings.push(pair)
    }

    return pairings
  }

  /* Event Handlers */
  window.clearBuddies = function () {
    const nameList = document.getElementById("name-list")
    nameList.innerHTML = ""

    clearNames()
  }

  window.submitName = function () {
    const nameInput = document.getElementById("name-input")
    const name = nameInput.value

    if (name === "") {
      window.alert("Please enter a name!")
      return
    }

    if (namesList.includes(name)) {
      window.alert("This name already exists!")
      return
    }

    namesList.push(name)

    populateNames([name])

    nameInput.value = ""
    nameInput.focus()
  }

  window.pairRandomBuddies = function () {
    if (namesList.length < 4) {
      window.alert("You need to add at least 4 names to pair buddies!")
      return
    }

    if (namesList.length % 2 !== 0) {
      window.alert("You need to add an even number of names to pair buddies!")
      return
    }

    const pairings = pairBuddies()
    const secret = window.prompt("Please enter a secret key")
    const hash = encryptPairings(pairings, secret)

    const url = `pages/pairings.html?hash=${encodeURIComponent(hash)}&secret=${encodeURIComponent(secret)}`
    window.location.href = url

    clearNames()
  }
  /* /Event Handlers */
}
