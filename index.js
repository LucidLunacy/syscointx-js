var BN = require('bn.js')
const ext = require('./bn-extensions')
const utils = require('./utils')
const syscoinBufferUtils = require('./bufferutilsassets.js')
const bitcoin = require('bitcoinjs-lib')
const coinSelect = require('coinselectsyscoin')
function createSyscoinTransaction (utxos, sysChangeAddress, outputsArr, feeRate) {
  const psbt = new bitcoin.Psbt()
  const inputsArr = []
  const { inputs, outputs, fee } = coinSelect.coinSelect(utxos, inputsArr, outputsArr, feeRate)
  // the accumulated fee is always returned for analysis
  console.log(fee)

  // .inputs and .outputs will be undefined if no solution was found
  if (!inputs || !outputs) return null

  inputs.forEach(input =>
    psbt.addInput({
      hash: input.txId,
      index: input.vout,
      witnessUtxo: input.witnessUtxo
    })
  )
  outputs.forEach(output => {
    // watch out, outputs may have been added that you need to provide
    // an output address/script for
    if (!output.address) {
      output.address = sysChangeAddress
    }
    psbt.addOutput({
      address: output.address,
      value: output.value.toNumber()
    })
  })
  return psbt
}
// update all allocations at some index or higher
function updateAllocationIndexes (assetAllocations, index) {
  for (const assetAllocation of assetAllocations.values()) {
    assetAllocation.forEach(output => {
      if (output.n >= index && output.n > 0) {
        output.n--
      }
    })
  }
}

function optimizeOutputs (outputs, assetAllocations) {
  // first find all syscoin outputs that are change (should only be one)
  const changeOutputs = outputs.filter(output => output.changeIndex !== undefined)
  if (changeOutputs.length > 1) {
    console.log('optimizeOutputs: too many change outputs')
    return
  }
  // find all asset change outputs
  const assetOutputs = outputs.filter(assetOutput => assetOutput.assetChangeIndex !== undefined && assetOutput.assetInfo.assetGuid > 0)
  changeOutputs.forEach(output => {
    // for every asset output and find any where the allocation index and change output index don't match
    // make the allocation point to the syscoin change output and we can delete the asset output (it sends dust anyway)
    for (var i = 0; i < assetOutputs.length; i++) {
      const assetOutput = assetOutputs[i]
      // get the allocation by looking up from assetChangeIndex which is indexing into the allocations array for this asset guid
      const allocations = assetAllocations.get(assetOutput.assetInfo.assetGuid)
      const allocation = allocations[assetOutput.assetChangeIndex]
      // ensure that the output index's don't match between sys change and asset output
      if (allocation.n !== output.changeIndex) {
        // remove the output, we will recalc and optimize fees after this call
        outputs.splice(allocation.n, 1)

        // because we deleted this index, it will invalidate any indexes after (we must subtract by one on every index after assetChangeIndex)
        updateAllocationIndexes(assetAllocations, allocation.n)

        // set them the same and remove asset output
        if (output.changeIndex >= allocation.n && output.changeIndex > 0) {
          allocation.n = output.changeIndex - 1
        } else {
          allocation.n = output.changeIndex
        }
        return
      }
    }
  })
}
function optimizeFees (outputs, inputs, feeRate) {
  const changeOutputs = outputs.filter(output => output.changeIndex !== undefined)
  if (changeOutputs.length > 1) {
    console.log('optimizeFees: too many change outputs')
    return
  }
  if (changeOutputs.length === 0) {
    return
  }
  const changeOutput = changeOutputs[0]
  const bytesAccum = coinSelect.utils.transactionBytes(inputs, outputs)
  const feeRequired = ext.mul(feeRate, bytesAccum)
  const feeFoundInOut = ext.sub(coinSelect.utils.sumOrNaN(inputs), coinSelect.utils.sumOrNaN(outputs))
  if (feeFoundInOut && ext.gt(feeFoundInOut, feeRequired)) {
    const reduceFee = ext.sub(feeFoundInOut, feeRequired)
    console.log('optimizeFees: reducing fees by: ' + reduceFee.toNumber())
    // add to change to effectively reduce fee
    changeOutput.value = ext.add(changeOutput.value)
  } else if (ext.lt(feeFoundInOut, feeRequired)) {
    console.log('optimizeFees: warning, not enough fees found in transaction: required: ' + feeRequired.toNumber() + ' found: ' + feeFoundInOut.toNumber)
  }
}
function createAssetTransaction (txVersion, utxos, dataBuffer, dataAmount, assetMap, sysChangeAddress, feeRate) {
  const psbt = new bitcoin.Psbt()
  psbt.setVersion(txVersion)
  const isNonAssetFunded = txVersion === utils.SYSCOIN_TX_VERSION_ASSET_ACTIVATE || txVersion === utils.SYSCOIN_TX_VERSION_SYSCOIN_BURN_TO_ALLOCATION ||
    txVersion === utils.SYSCOIN_TX_VERSION_ALLOCATION_MINT
  const isAsset = txVersion === utils.SYSCOIN_TX_VERSION_ASSET_ACTIVATE || txVersion === utils.SYSCOIN_TX_VERSION_ASSET_UPDATE || txVersion === utils.SYSCOIN_TX_VERSION_ASSET_SEND
  const isAllocationBurn = txVersion === utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_SYSCOIN || txVersion === utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_ETHEREUM
  let { inputs, outputs, assetAllocations } = coinSelect.coinSelectAsset(utxos, assetMap, feeRate, isNonAssetFunded, isAsset)
  // .inputs and .outputs will be undefined if no solution was found
  if (!inputs || !outputs) {
    console.log('createAssetTransaction: inputs or outputs are empty after coinSelectAsset')
    return null
  }

  let burnAllocationValue
  if (isAllocationBurn) {
    // ensure only 1 to 2 outputs (2 if change was required)
    if (outputs.length > 2 && outputs.length < 1) {
      console.log('Assetallocationburn: expect output of length 1 got: ' + outputs.length)
      return null
    }

    if (!assetAllocations.has(outputs[0].assetInfo.assetGuid)) {
      console.log('Assetallocationburn: assetAllocations map does not have key: ' + outputs[0].assetInfo.assetGuid)
      return null
    }
    const allocation = assetAllocations.get(outputs[0].assetInfo.assetGuid)
    burnAllocationValue = new BN(allocation[0].value)
    if (txVersion === utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_ETHEREUM) {
      outputs.splice(0, 1)
      // we removed the first index via slice above, so all N's at index 1 or above should be reduced by 1
      updateAllocationIndexes(assetAllocations, 0)
    }
    // point first allocation to next output (burn output)
    // now this index is available we can use it
    allocation[0].n = outputs.length
  }

  let assetAllocationsBuffer = syscoinBufferUtils.serializeAssetAllocations(assetAllocations)
  let buffArr
  if (dataBuffer) {
    buffArr = [assetAllocationsBuffer, dataBuffer]
  } else {
    buffArr = [assetAllocationsBuffer]
  }
  // create and add data script for OP_RETURN
  let dataScript = bitcoin.payments.embed({ data: [Buffer.concat(buffArr)] }).output
  const dataOutput = {
    script: dataScript,
    value: dataAmount
  }
  outputs.push(dataOutput)
  let res = coinSelect.coinSelect(utxos, inputs, outputs, feeRate)
  if (!res.inputs || !res.outputs) {
    console.log('createAssetTransaction: inputs or outputs are empty after coinSelect trying to fund with asset inputs...')
    res = coinSelect.coinSelectAssetGas(assetAllocations, utxos, inputs, outputs, feeRate)
    if (!res.inputs || !res.outputs) {
      console.log('createAssetTransaction: inputs or outputs are empty after coinSelectAssetGas')
      return null
    }
  }
  inputs = res.inputs
  outputs = res.outputs
  // once funded we should swap the first output asset amount to sys amount as we are burning sysx to sys in output 0
  if (isAllocationBurn) {
    if (txVersion === utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_SYSCOIN) {
      // modify output from asset value to syscoin value
      // first output is special it is the sys amount bring minted
      outputs[0].value = burnAllocationValue
    }
  } else if (txVersion === utils.SYSCOIN_TX_VERSION_ASSET_ACTIVATE) {
    const deterministicGuid = utils.generateAssetGuid(inputs[0].txId)
    // delete old asset guid and create copy of new one
    const oldAssetAllocation = assetAllocations.get(0)
    assetAllocations.set(deterministicGuid, [])
    const assetAllocation = assetAllocations.get(deterministicGuid)
    assetAllocation.push({ n: JSON.parse(JSON.stringify(oldAssetAllocation[0].n)), value: new BN(oldAssetAllocation[0].value) })
    assetAllocations.delete(0)
  }
  if (txVersion !== utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_SYSCOIN) {
    // re-use syscoin change outputs for allocation change outputs where we can, this will possible remove one output and save fees
    optimizeOutputs(outputs, assetAllocations)
  }

  // serialize allocations again they may have been changed in optimization
  assetAllocationsBuffer = syscoinBufferUtils.serializeAssetAllocations(assetAllocations)
  if (dataBuffer) {
    buffArr = [assetAllocationsBuffer, dataBuffer]
  } else {
    buffArr = [assetAllocationsBuffer]
  }
  // update script with new guid
  dataScript = bitcoin.payments.embed({ data: [Buffer.concat(buffArr)] }).output
  // update output with new data output with new guid
  outputs.forEach(output => {
    if (output.script) {
      output.script = dataScript
    }
  })

  optimizeFees(inputs, outputs, feeRate)

  inputs.forEach(input => {
    psbt.addInput({
      hash: input.txId,
      index: input.vout,
      witnessUtxo: input.witnessUtxo
    })
  })

  outputs.forEach(output => {
    // watch out, outputs may have been added that you need to provide
    // an output address/script for
    if (!output.address) {
      if (output.assetInfo) {
        if (assetMap.has(output.assetInfo.assetGuid)) {
          output.address = assetMap.get(output.assetInfo.assetGuid).changeAddress
        }
      } else {
        output.address = sysChangeAddress
      }
    }
    psbt.addOutput({
      script: output.script,
      address: output.script ? null : output.address,
      value: output.value.toNumber()
    })
  })
  return psbt
}
function assetNew (assetOpts, assetOptsOptional, utxos, sysChangeAddress, feeRate) {
  const txVersion = utils.SYSCOIN_TX_VERSION_ASSET_ACTIVATE
  const dataAmount = new BN(150 * utils.COIN)
  assetOpts.contract = assetOpts.contract || assetOptsOptional.contract || Buffer.from('')
  assetOpts.pubdata = assetOpts.pubdata || assetOptsOptional.pubdata || Buffer.from('')
  assetOpts.prevcontract = assetOpts.prevcontract || assetOptsOptional.prevcontract || Buffer.from('')
  assetOpts.prevpubdata = assetOpts.prevpubdata || assetOptsOptional.prevpubdata || Buffer.from('')
  assetOpts.totalsupply = ext.BN_ZERO
  const dataBuffer = syscoinBufferUtils.serializeAsset(assetOpts)
  // create dummy map where GUID will be replaced by deterministic one based on first input txid, we need this so fees will be accurately determined on first place of coinselect
  const assetMap = new Map([
    [0, { changeAddress: sysChangeAddress, outputs: [{ value: ext.BN_ZERO, address: sysChangeAddress }] }]
  ])
  return createAssetTransaction(txVersion, utxos, dataBuffer, dataAmount, assetMap, sysChangeAddress, feeRate)
}

function assetUpdate (assetOpts, assetOptsOptional, utxos, assetMap, sysChangeAddress, feeRate) {
  const txVersion = utils.SYSCOIN_TX_VERSION_ASSET_UPDATE
  const dataAmount = ext.BN_ZERO
  assetOpts.balance = assetOpts.balance || assetOptsOptional.balance || ext.BN_ZERO
  assetOpts.contract = assetOpts.contract || assetOptsOptional.contract || ''
  assetOpts.pubdata = assetOpts.pubdata || assetOptsOptional.pubdata || ''
  assetOpts.prevcontract = assetOpts.prevcontract || assetOptsOptional.prevcontract || ''
  assetOpts.prevpubdata = assetOpts.prevpubdata || assetOptsOptional.prevpubdata || ''
  assetOpts.updateflags = assetOpts.updateflags || assetOptsOptional.updateflags || 31
  assetOpts.prevupdateflags = assetOpts.prevupdateflags || assetOptsOptional.prevupdateflags || 31
  // these are inited to 0 they are included on wire as empty, also used to ser/der into the asset db in core
  assetOpts.totalsupply = ext.BN_ZERO
  assetOpts.maxsupply = ext.BN_ZERO
  assetOpts.symbol = Buffer.from('')
  const dataBuffer = syscoinBufferUtils.serializeAsset(assetOpts)
  return createAssetTransaction(txVersion, utxos, dataBuffer, dataAmount, assetMap, sysChangeAddress, feeRate)
}

function assetSend (utxos, assetMap, sysChangeAddress, feeRate) {
  const txVersion = utils.SYSCOIN_TX_VERSION_ASSET_SEND
  const dataAmount = ext.BN_ZERO
  const dataBuffer = null
  return createAssetTransaction(txVersion, utxos, dataBuffer, dataAmount, assetMap, sysChangeAddress, feeRate)
}

function assetAllocationSend (utxos, assetMap, sysChangeAddress, feeRate) {
  const txVersion = utils.SYSCOIN_TX_VERSION_ALLOCATION_SEND
  const dataAmount = ext.BN_ZERO
  const dataBuffer = null
  return createAssetTransaction(txVersion, utxos, dataBuffer, dataAmount, assetMap, sysChangeAddress, feeRate)
}

function assetAllocationBurn (syscoinBurnToEthereum, utxos, assetMap, sysChangeAddress, feeRate) {
  let txVersion = 0
  if (syscoinBurnToEthereum.ethaddress.length > 0) {
    txVersion = utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_ETHEREUM
  } else {
    txVersion = utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_SYSCOIN
  }
  const dataAmount = ext.BN_ZERO
  const dataBuffer = syscoinBufferUtils.serializeAllocationBurnToEthereum(syscoinBurnToEthereum)
  return createAssetTransaction(txVersion, utxos, dataBuffer, dataAmount, assetMap, sysChangeAddress, feeRate)
}

function assetAllocationMint (mintSyscoin, utxos, assetMap, sysChangeAddress, feeRate) {
  const txVersion = utils.SYSCOIN_TX_VERSION_ALLOCATION_MINT
  const dataAmount = ext.BN_ZERO
  const dataBuffer = syscoinBufferUtils.serializeMintSyscoin(mintSyscoin)
  return createAssetTransaction(txVersion, utxos, dataBuffer, dataAmount, assetMap, sysChangeAddress, feeRate)
}

function syscoinBurnToAssetAllocation (utxos, assetMap, sysChangeAddress, dataAmount, feeRate) {
  const txVersion = utils.SYSCOIN_TX_VERSION_SYSCOIN_BURN_TO_ALLOCATION
  const dataBuffer = null
  return createAssetTransaction(txVersion, utxos, dataBuffer, dataAmount, assetMap, sysChangeAddress, feeRate)
}

module.exports = {
  createSyscoinTransaction: createSyscoinTransaction,
  createAssetTransaction: createAssetTransaction,
  assetNew: assetNew,
  assetUpdate: assetUpdate,
  assetSend: assetSend,
  assetAllocationSend: assetAllocationSend,
  assetAllocationBurn: assetAllocationBurn,
  assetAllocationMint: assetAllocationMint,
  syscoinBurnToAssetAllocation: syscoinBurnToAssetAllocation
}
