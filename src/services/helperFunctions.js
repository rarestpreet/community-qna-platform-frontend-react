const paramEncryptionId = crypto.randomUUID()

function encryptNavId(replacement) {
    return paramEncryptionId.substring(0, 12) + replacement + paramEncryptionId.substring(12 + 1, paramEncryptionId.length)
}
function decryptNavId(encryptedNavId) {
    return encryptedNavId.charAt(12)
}

const helperFunctions = {
    encryptNavId,
    decryptNavId
}

export default helperFunctions