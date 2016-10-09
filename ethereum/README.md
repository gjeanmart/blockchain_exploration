**1. Start geth on the testnet	**

`geth --testnet --unlock "0x31b26E43651e9371C88aF3D36c14CfD938BaF4Fd" --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr 0.0.0.0 --rpcport 8545 console`

**2. Go to workspace**
`cd blockchain_exploration/ethereum/dapp/PotChain/`

**3. Deploy the contracts**
`truffle migrate --reset --compile-all`
`truffle serve --p 8080`

