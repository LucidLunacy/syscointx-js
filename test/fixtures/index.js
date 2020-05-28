var BN = require('bn.js')
var utils = require('../../utils')

module.exports = [{
  description: 'new asset',
  version: utils.SYSCOIN_TX_VERSION_ASSET_ACTIVATE,
  feeRate: new BN(10),
  utxos: [
    { txId: '698890216173b8cd6d0b86b3c7c4e66a0641829bede3d66b4ba2fc905dc65ef1', vout: 1, script: Buffer.from('001424e9ca410d96a30f68b932af7664b8f06d8ca78b'), value: 100000000000 }
  ],
  assetOpts: { precision: 8, symbol: Buffer.from('CAT'), updateflags: 31, balance: new BN(10000000000), maxsupply: new BN(100000000000) },
  assetOptsOptional: { contract: Buffer.from('contractaddr'), pubdata: Buffer.from('{"description":"publicvalue"}'), prevcontract: Buffer.from(''), prevpubdata: Buffer.from('') },
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  expected: {
    script: Buffer.from('6a3301f15ec65d01010008001d7b226465736372697074696f6e223a227075626c696376616c7565227d034341541f00001f648668')
  }
}
]
