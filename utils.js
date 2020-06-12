var BN = require('bn.js')
const axios = require('axios')
const SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_SYSCOIN = 128
const SYSCOIN_TX_VERSION_SYSCOIN_BURN_TO_ALLOCATION = 129
const SYSCOIN_TX_VERSION_ASSET_ACTIVATE = 130
const SYSCOIN_TX_VERSION_ASSET_UPDATE = 131
const SYSCOIN_TX_VERSION_ASSET_SEND = 132
const SYSCOIN_TX_VERSION_ALLOCATION_MINT = 133
const SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_ETHEREUM = 134
const SYSCOIN_TX_VERSION_ALLOCATION_SEND = 135
const COIN = 100000000
const CENT = 1000000
function sanitizeBlockbookUTXOs (utxos) {
  const sanitizedUtxos = []
  utxos.forEach(utxo => {
    const newUtxo = { txId: utxo.txId, vout: utxo.vout, value: new BN(utxo.value), witnessUtxo: { script: utxo.script, value: utxo.value } }
    if (utxo.assetInfo) {
      newUtxo.assetInfo = { assetGuid: utxo.assetInfo.assetGuid, value: new BN(utxo.assetInfo.value) }
    }
    sanitizedUtxos.push(newUtxo)
  })
  return sanitizedUtxos
}
async function fetchBackendUTXOS (backendURL, addressOrXpub) {
  const request = axios.get(backendURL + addressOrXpub)
  try {
    const utxos = await request()
    return sanitizeBlockbookUTXOs(utxos)
  } catch (e) {
    console.error(e)
    return e
  }
}
async function fetchBackendAsset (backendURL, assetGuid) {
  const request = axios.get(backendURL + assetGuid)
  try {
    const data = await request()
    return data
  } catch (e) {
    console.error(e)
    return e
  }
}
function generateAssetGuid (txid) {
  let bigNum = new BN(txid, 16)
  // clear bits 33 and up to keep low 32 bits
  bigNum = bigNum.maskn(32)
  return bigNum.toNumber()
}

module.exports = {
  sanitizeBlockbookUTXOs: sanitizeBlockbookUTXOs,
  fetchBackendUTXOS: fetchBackendUTXOS,
  fetchBackendAsset: fetchBackendAsset,
  generateAssetGuid: generateAssetGuid,
  COIN: COIN,
  CENT: CENT,
  SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_SYSCOIN: SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_SYSCOIN,
  SYSCOIN_TX_VERSION_SYSCOIN_BURN_TO_ALLOCATION: SYSCOIN_TX_VERSION_SYSCOIN_BURN_TO_ALLOCATION,
  SYSCOIN_TX_VERSION_ASSET_ACTIVATE: SYSCOIN_TX_VERSION_ASSET_ACTIVATE,
  SYSCOIN_TX_VERSION_ASSET_UPDATE: SYSCOIN_TX_VERSION_ASSET_UPDATE,
  SYSCOIN_TX_VERSION_ASSET_SEND: SYSCOIN_TX_VERSION_ASSET_SEND,
  SYSCOIN_TX_VERSION_ALLOCATION_MINT: SYSCOIN_TX_VERSION_ALLOCATION_MINT,
  SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_ETHEREUM: SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_ETHEREUM,
  SYSCOIN_TX_VERSION_ALLOCATION_SEND: SYSCOIN_TX_VERSION_ALLOCATION_SEND
}
