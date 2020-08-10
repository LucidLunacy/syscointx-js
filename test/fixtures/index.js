var BN = require('bn.js')
var utils = require('../../utils')

module.exports = [{
  description: 'new asset',
  version: utils.SYSCOIN_TX_VERSION_ASSET_ACTIVATE,
  feeRate: new BN(10),
  utxos: [
    { txId: 'add9bf0783d1e18bccf016e5c779be5cd390d8906f7b2ef4afa28c775c888b21', vout: 0, script: Buffer.from('001495e1cb724b74c32526209265c9f96a4e8ed256db', 'hex'), value: 100000000000 }
  ],
  assetOpts: { precision: 8, symbol: utils.encodeToBase64('CAT'), updateflags: 31, prevupdateflags: 31, balance: new BN(10000000000), maxsupply: new BN(100000000000) },
  assetOptsOptional: { contract: Buffer.from(''), pubdata: utils.encodeToBase64('{"d":"publicvalue"}'), prevcontract: Buffer.from(''), prevpubdata: Buffer.from('') },
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  expected: {
    numOutputs: 2,
    script: Buffer.from('6a3701218b885c0101000008001c65794a6b496a6f696348566962476c6a646d46736457556966513d3d04513046551f000000001f64008668', 'hex'),
    asset: {
      allocation: [{ assetGuid: 1552452385, values: [{ n: 1, value: new BN(0) }], notarysig: Buffer.from('') }],
      precision: 8,
      contract: Buffer.from(''),
      pubdata: utils.encodeToBase64('{"d":"publicvalue"}'),
      symbol: utils.encodeToBase64('CAT'),
      updateflags: 31,
      prevcontract: Buffer.from(''),
      prevpubdata: Buffer.from(''),
      prevupdateflags: 31,
      notarykeyid: Buffer.from(''),
      prevnotarykeyid: Buffer.from(''),
      balance: new BN(10000000000),
      totalsupply: new BN(0),
      maxsupply: new BN(100000000000)
    }
  }
},
{
  description: 'update asset',
  version: utils.SYSCOIN_TX_VERSION_ASSET_UPDATE,
  feeRate: new BN(10),
  utxos: [
    { txId: 'd31783dcbb96cf104970a5fd427f3c9f91921233478f80d8b63d80b2089ea15c', vout: 0, script: Buffer.from('0014f0cb48bf627b8603adfa80be7cbe980f1964294b', 'hex'), value: 99999796, assetInfo: { assetGuid: 1552452385, value: new BN(0) } },
    { txId: 'd31783dcbb96cf104970a5fd427f3c9f91921233478f80d8b63d80b2089ea15c', vout: 2, script: Buffer.from('001493b69b7e29c5869a50a41c122c51423003335184', 'hex'), value: 84900000000 }
  ],
  assetOpts: { assetGuid: 1552452385, precision: 8 },
  assetOptsOptional: { updateflags: 16, prevupdateflags: 31, balance: new BN(42000000000), contract: Buffer.from('2b1e58b979e4b2d72d8bca5bb4646ccc032ddbfc', 'hex'), pubdata: utils.encodeToBase64('{"d":"new publicvalue"}'), prevcontract: Buffer.from(''), prevpubdata: utils.encodeToBase64('{"d":"publicvalue"}') },
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  assetMap: new Map([
    [1552452385, { changeAddress: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9', outputs: [{ value: new BN(0), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }] }]
  ]),
  expected: {
    numOutputs: 2,
    script: Buffer.from('6a4c6701218b885c0101000008142b1e58b979e4b2d72d8bca5bb4646ccc032ddbfc2065794a6b496a6f69626d563349484231596d787059335a686248566c496e303d00100000001c65794a6b496a6f696348566962476c6a646d46736457556966513d3d1f82240000', 'hex'),
    asset: {
      allocation: [{ assetGuid: 1552452385, values: [{ n: 1, value: new BN(0) }], notarysig: Buffer.from('') }],
      precision: 8,
      contract: Buffer.from('2b1e58b979e4b2d72d8bca5bb4646ccc032ddbfc', 'hex'),
      pubdata: utils.encodeToBase64('{"d":"new publicvalue"}'),
      symbol: utils.encodeToBase64(''),
      updateflags: 16,
      prevcontract: Buffer.from(''),
      prevpubdata: utils.encodeToBase64('{"d":"publicvalue"}'),
      prevupdateflags: 31,
      notarykeyid: Buffer.from(''),
      prevnotarykeyid: Buffer.from(''),
      balance: new BN(42000000000),
      totalsupply: new BN(0),
      maxsupply: new BN(0)
    }
  }
},
{
  description: 'send asset',
  version: utils.SYSCOIN_TX_VERSION_ASSET_SEND,
  feeRate: new BN(10),
  utxos: [
    { txId: 'befed752e1444b66fd91dd121f772d0f2f081c579f04b419eb18960dcd55e84f', vout: 2, script: Buffer.from('0014fb1a61908e16c8c5ad306b6d8ef11a6cc4f91ff5', 'hex'), value: 84900000000 },
    { txId: '5e9c72abf1d3df7ac5f673de603cd7946b25e58de8e8f87a852ba291790a5181', vout: 0, script: Buffer.from('001462621943decf05bd265f6c352db0e42f73a60f68', 'hex'), value: 99999593, assetInfo: { assetGuid: 1635229536, value: new BN(0) } }
  ],
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  assetMap: new Map([
    [1635229536, { changeAddress: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9', outputs: [{ value: new BN(1000000000), address: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq' }, { value: new BN(0), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }] }]
  ]),
  expected: {
    numOutputs: 3,
    script: Buffer.from('6a0b01609f776102000a020000', 'hex'),
    asset: {
      allocation: [{ assetGuid: 1635229536, values: [{ n: 0, value: new BN(1000000000) }, { n: 2, value: new BN(0) }], notarysig: Buffer.from('') }]
    }
  }
},
{
  description: 'send asset allocation',
  version: utils.SYSCOIN_TX_VERSION_ALLOCATION_SEND,
  feeRate: new BN(10),
  utxos: [
    { txId: 'c6e7702f1ab817bacf81e5678ba89e0b43a8a7b6f56c4c055aa8aeda87197a62', vout: 0, script: Buffer.from('0014712a0433b3be8c2860db2d313c44fa1967542780', 'hex'), value: 980, assetInfo: { assetGuid: 1635229536, value: new BN(1000000000) } },
    { txId: '2cf903537c6c161a1c65d940758b63efd4706fc8f78eb21d252612407e59e865', vout: 0, script: Buffer.from('0014ab0ed68aa74cc422d69e4d675eb029ab93211c4c', 'hex'), value: 100000000 }
  ],
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  assetMap: new Map([
    [1635229536, { changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(600000000), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }] }]
  ]),
  expected: {
    numOutputs: 3,
    script: Buffer.from('6a0b01609f776102003b022700', 'hex'),
    asset: {
      allocation: [{ assetGuid: 1635229536, values: [{ n: 0, value: new BN(600000000) }, { n: 2, value: new BN(400000000) }], notarysig: Buffer.from('') }]
    }
  }
},
{
  description: 'send multi asset allocations with notarization',
  version: utils.SYSCOIN_TX_VERSION_ALLOCATION_SEND,
  feeRate: new BN(10),
  utxos: [
    { txId: 'c6e7702f1ab817bacf81e5678ba89e0b43a8a7b6f56c4c055aa8aeda87197a62', vout: 0, script: Buffer.from('0014712a0433b3be8c2860db2d313c44fa1967542780', 'hex'), value: 980, assetInfo: { assetGuid: 1635229536, value: new BN(100000000) } },
    { txId: 'c6e7702f1ab817bacf81e5678ba89e0b43a8a7b6f56c4c055aa8aeda87197a63', vout: 0, script: Buffer.from('0014712a0433b3be8c2860db2d313c44fa1967542781', 'hex'), value: 980, assetInfo: { assetGuid: 1635229537, value: new BN(200000000) } },
    { txId: 'c6e7702f1ab817bacf81e5678ba89e0b43a8a7b6f56c4c055aa8aeda87197a64', vout: 0, script: Buffer.from('0014712a0433b3be8c2860db2d313c44fa1967542782', 'hex'), value: 980, assetInfo: { assetGuid: 1635229538, value: new BN(300000000) } },
    { txId: 'c6e7702f1ab817bacf81e5678ba89e0b43a8a7b6f56c4c055aa8aeda87197a65', vout: 0, script: Buffer.from('0014712a0433b3be8c2860db2d313c44fa1967542783', 'hex'), value: 980, assetInfo: { assetGuid: 1635229539, value: new BN(400000000) } },
    { txId: 'c6e7702f1ab817bacf81e5678ba89e0b43a8a7b6f56c4c055aa8aeda87197a66', vout: 0, script: Buffer.from('0014712a0433b3be8c2860db2d313c44fa1967542784', 'hex'), value: 980, assetInfo: { assetGuid: 1635229540, value: new BN(500000000) } },
    { txId: 'c6e7702f1ab817bacf81e5678ba89e0b43a8a7b6f56c4c055aa8aeda87197a67', vout: 0, script: Buffer.from('0014712a0433b3be8c2860db2d313c44fa1967542785', 'hex'), value: 980, assetInfo: { assetGuid: 1635229541, value: new BN(600000000) } },
    { txId: '2cf903537c6c161a1c65d940758b63efd4706fc8f78eb21d252612407e59e865', vout: 0, script: Buffer.from('0014ab0ed68aa74cc422d69e4d675eb029ab93211c4c', 'hex'), value: 100000000 }
  ],
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  assetMap: new Map([
    [1635229536, { requireNotarization: true, changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(50000000), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }, { value: new BN(50000000), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }] }],
    [1635229537, { requireNotarization: true, changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(200000000), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }] }],
    [1635229538, { requireNotarization: true, changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(250000000), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }] }],
    [1635229539, { requireNotarization: true, changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(300000000), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }] }],
    [1635229540, { requireNotarization: true, changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(350000000), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }] }],
    [1635229541, { requireNotarization: false, changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(500000000), address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9' }] }]
  ]),
  expected: {
    numOutputs: 12,
    script: Buffer.from('6a4d830106609f77610200300130410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000619f7761010213410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000629f7761020380640b30410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000639f776102041d0509410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000649f77610206813e07800a410000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000659f7761020831090900', 'hex'),
    asset: {
      allocation: [{ assetGuid: 1635229536, values: [{ n: 0, value: new BN(50000000) }, { n: 1, value: new BN(50000000) }], notarysig: Buffer.alloc(65, 0) },
        { assetGuid: 1635229537, values: [{ n: 2, value: new BN(200000000) }], notarysig: Buffer.alloc(65, 0) },
        { assetGuid: 1635229538, values: [{ n: 3, value: new BN(250000000) }, { n: 11, value: new BN(50000000) }], notarysig: Buffer.alloc(65, 0) },
        { assetGuid: 1635229539, values: [{ n: 4, value: new BN(300000000) }, { n: 5, value: new BN(100000000) }], notarysig: Buffer.alloc(65, 0) },
        { assetGuid: 1635229540, values: [{ n: 6, value: new BN(350000000) }, { n: 7, value: new BN(150000000) }], notarysig: Buffer.alloc(65, 0) },
        { assetGuid: 1635229541, values: [{ n: 8, value: new BN(500000000) }, { n: 9, value: new BN(100000000) }], notarysig: Buffer.from('') }]
    }
  }
},
{
  description: 'burn asset allocation to syscoin',
  version: utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_SYSCOIN,
  feeRate: new BN(10),
  utxos: [
    { txId: 'e77901b5181e1ac5dc428d43ccc7e677c8c9179b982c779464e95c3190054c0e', vout: 0, script: Buffer.from('001483516da577935f20272bca9b62d262a4226f9c72', 'hex'), value: 980, assetInfo: { assetGuid: 1635229536, value: new BN(600000000) } },
    { txId: 'e77901b5181e1ac5dc428d43ccc7e677c8c9179b982c779464e95c3190054c0e', vout: 2, script: Buffer.from('001461dffc7defeb8e0b5cd00ff24c196f71fe31feee', 'hex'), value: 99999771, assetInfo: { assetGuid: 1635229536, value: new BN(400000000) } }
  ],
  assetOpts: { ethaddress: Buffer.from('', 'hex') },
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  assetMap: new Map([
    [1635229536, { changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(400000000) }] }]
  ]),
  expected: {
    numOutputs: 3,
    script: Buffer.from('6a0a01609f77610101270000', 'hex'),
    asset: {
      allocation: [{ assetGuid: 1635229536, values: [{ n: 1, value: new BN(400000000) }], notarysig: Buffer.from('') }]
    }
  }
},
{
  description: 'burn asset allocation to ethereum',
  version: utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_ETHEREUM,
  feeRate: new BN(10),
  utxos: [
    { txId: '26f6b17b715bcd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 1, script: Buffer.from('001487e5ec8eb455b3bbf42c5d5f952f67c26793115d', 'hex'), value: 100000914, assetInfo: { assetGuid: 1635229536, value: new BN(900000000) } }
  ],
  assetOpts: { ethaddress: Buffer.from('9667de58c15475626165eaa4c9970e409e1181d0', 'hex') },
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  assetMap: new Map([
    [1635229536, { changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(100000000) }] }]
  ]),
  expected: {
    numOutputs: 2,
    script: Buffer.from('6a2001609f7761020009014f00149667de58c15475626165eaa4c9970e409e1181d0', 'hex'),
    asset: {
      allocation: [{ assetGuid: 1635229536, values: [{ n: 0, value: new BN(100000000) }, { n: 1, value: new BN(800000000) }], notarysig: Buffer.from('') }],
      ethaddress: Buffer.from('9667de58c15475626165eaa4c9970e409e1181d0', 'hex')
    }
  }
},
{
  description: 'burn asset allocation to ethereum multiple inputs',
  version: utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_ETHEREUM,
  feeRate: new BN(10),
  utxos: [
    { txId: '26f6b17b715bcd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 1, script: Buffer.from('001487e5ec8eb455b3bbf42c5d5f952f67c26793115d', 'hex'), value: 980, assetInfo: { assetGuid: 1635229536, value: new BN(900000000) } },
    { txId: '36f6b17b715ccd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 0, script: Buffer.from('001497e5ec8eb455b3bba42c5d5f952f67c26793115d', 'hex'), value: 100000914 }
  ],
  assetOpts: { ethaddress: Buffer.from('9667de58c15475626165eaa4c9970e409e1181d0', 'hex') },
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  assetMap: new Map([
    [1635229536, { changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(100000000) }] }]
  ]),
  expected: {
    numOutputs: 2,
    script: Buffer.from('6a2001609f7761020009014f00149667de58c15475626165eaa4c9970e409e1181d0', 'hex'),
    asset: {
      allocation: [{ assetGuid: 1635229536, values: [{ n: 0, value: new BN(100000000) }, { n: 1, value: new BN(800000000) }], notarysig: Buffer.from('') }],
      ethaddress: Buffer.from('9667de58c15475626165eaa4c9970e409e1181d0', 'hex')
    }
  }
},
{
  description: 'burn asset allocation to ethereum multiple inputs, change has asset',
  version: utils.SYSCOIN_TX_VERSION_ALLOCATION_BURN_TO_ETHEREUM,
  feeRate: new BN(10),
  utxos: [
    { txId: '26f6b17b715bcd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 1, script: Buffer.from('001487e5ec8eb455b3bbf42c5d5f952f67c26793115d', 'hex'), value: 980, assetInfo: { assetGuid: 1635229536, value: new BN(900000000) } },
    { txId: '36f6b17b715ccd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 0, script: Buffer.from('001497e5ec8eb455b3bba42c5d5f952f67c26793115d', 'hex'), value: 100000914, assetInfo: { assetGuid: 1635229536, value: new BN(800000000) } }
  ],
  assetOpts: { ethaddress: Buffer.from('9667de58c15475626165eaa4c9970e409e1181d0', 'hex') },
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  assetMap: new Map([
    [1635229536, { changeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', outputs: [{ value: new BN(100000000) }] }]
  ]),
  expected: {
    numOutputs: 2,
    script: Buffer.from('6a2101609f776102000901801500149667de58c15475626165eaa4c9970e409e1181d0', 'hex'),
    asset: {
      allocation: [{ assetGuid: 1635229536, values: [{ n: 0, value: new BN(100000000) }, { n: 1, value: new BN(1600000000) }], notarysig: Buffer.from('') }],
      ethaddress: Buffer.from('9667de58c15475626165eaa4c9970e409e1181d0', 'hex')
    }
  }
},
{
  description: 'standard sys send',
  version: 2,
  feeRate: new BN(10),
  utxos: [
    { txId: '26f6b17b715bcd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 1, script: Buffer.from('001487e5ec8eb455b3bbf42c5d5f952f67c26793115d', 'hex'), value: 100000000 },
    { txId: '36f6b17b715ccd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 0, script: Buffer.from('001497e5ec8eb455b3bba42c5d5f952f67c26793115d', 'hex'), value: 100000914 }
  ],
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  outputs: [
    { address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9', value: new BN(150000000) }
  ],
  expected: {
    version: 2,
    numOutputs: 2
  }
},
{
  description: 'standard sys send with asset inputs',
  version: 2,
  feeRate: new BN(10),
  utxos: [
    { txId: '26f6b17b715bcd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 1, script: Buffer.from('001487e5ec8eb455b3bbf42c5d5f952f67c26793115d', 'hex'), value: 100000000, assetInfo: { assetGuid: 1635229536, value: new BN(900000000) } },
    { txId: '36f6b17b715ccd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 0, script: Buffer.from('001497e5ec8eb455b3bba42c5d5f952f67c26793115d', 'hex'), value: 100000914, assetInfo: { assetGuid: 1635229536, value: new BN(800000000) } }
  ],
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  outputs: [
    { address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9', value: new BN(150000000) }
  ],
  expected: {
    version: utils.SYSCOIN_TX_VERSION_ALLOCATION_SEND,
    numOutputs: 3, // 3 because new opreturn will be created
    script: Buffer.from('6a4b01609f77610100801f41' + Buffer.alloc(65, 0).toString('hex'), 'hex'),
    asset: {
      allocation: [{ assetGuid: 1635229536, values: [{ n: 0, value: new BN(1700000000) }], notarysig: Buffer.alloc(65, 0) }]
    }
  }
},
{
  description: 'standard sys send with asset input and regular input',
  version: 2,
  feeRate: new BN(10),
  utxos: [
    { txId: '26f6b17b715bcd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 1, script: Buffer.from('001487e5ec8eb455b3bbf42c5d5f952f67c26793115d', 'hex'), value: 100000000, assetInfo: { assetGuid: 1635229536, value: new BN(900000000) } },
    { txId: '36f6b17b715ccd5fda921108b3bedd9a3d89ea58c666a40a3e5a6f833a454e36', vout: 0, script: Buffer.from('001497e5ec8eb455b3bba42c5d5f952f67c26793115d', 'hex'), value: 100000914 }
  ],
  sysChangeAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
  outputs: [
    { address: 'bc1qc7slrfxkknqcq2jevvvkdgvrt8080852dfjewde450xdlk4ugp7szw5tk9', value: new BN(150000000) }
  ],
  expected: {
    version: utils.SYSCOIN_TX_VERSION_ALLOCATION_SEND,
    numOutputs: 3, // 3 because new opreturn will be created
    script: Buffer.from('6a4a01609f776101005941' + Buffer.alloc(65, 0).toString('hex'), 'hex'),
    asset: {
      allocation: [{ assetGuid: 1635229536, values: [{ n: 0, value: new BN(900000000) }], notarysig: Buffer.alloc(65, 0) }]
    }
  }
}
]
