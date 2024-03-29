window.onload = function () {
  checkForHashAndSecret()

  function checkForHashAndSecret () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const hash = urlParams.get('hash')
    const secret = urlParams.get('secret')

    if (hash == null || secret == null) {
      window.alert("A hash and secret key must be passed!")
      return
    }

    const pairings = decryptPairings(hash, secret)
    populatePairings(pairings)
  }

  function decryptPairings(encryptedHash, secretKey) {
    const bytes = CryptoJS.AES.decrypt(encryptedHash, secretKey)
    const originalText = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(originalText)
  }

  function populatePairings (pairings) {
    const pairingsList = document.getElementById("pairings-list")

    pairings.forEach(pair => {
      const pairElement = document.createElement("div")
      pairElement.classList.add("pairing")
      pairElement.innerHTML = `
          <span class="pair">${pair[0]}</span>
          <div class="paired-text">is paired with</div>
          <span class="pair">${pair[1]}</span>`
      pairingsList.appendChild(pairElement)
    })
  }

  /* Event Handlers */
  window.copyUrlButton = function () {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      alert('URL copied to clipboard!')
    }).catch(err => {
      console.error('Error copying url: ', err)
    })
  }
  /* /Event Handlers */
}
