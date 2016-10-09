# Ethereum

## Client installation

###GETH (on Linux)
**1. Installation**
```
# sudo apt-get install software-properties-common
# sudo add-apt-repository -y ppa:ethereum/ethereum
# sudo apt-get update
# sudo apt-get install ethereum
```

Check

```
# geth version
```

The configuration is stored in **~/.ethereum/** .


**2.Chain synchronisation**
- Main network
```
# geth --fast --cache=1048 console
```
The blocks are stored in **~/.ethereum/chaindata**


- Test network (morden)
*Just add this argument `--testnet``
```
# geth --fast --cache=1048 –-testnet console
```
The blocks are stored in **~/.ethereum/testnet/chaindata**


**3. Account management**
- List accounts
```
# geth account list 
```

- Create an account
```
# geth account new 
```

- Import an account
```
# geth account import /dir/to/priv_key.txt
```

- Get Node account (in geth console)
```
# eth.coinbase
```

- Unlock account (in geth console)
```
personal.unlockAccount(eth.coinbase)
```
You can directly unlock your account when you start geth using `--unlock "0x8888888888888888888888888888888888888888"
```

The private keys are stored in **~/.ethereum/keystores** (and **~/.ethereum/testnet/keystores**)


**3. JSON RPC**
Allow JSONRPC on your node
```
# geth --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr 0.0.0.0 --rpcport 8545 
```
	* --rpc enable
	* --rpcapi api
	* --rpcaddr listenning interface
	* --rpcport listenning port
	* --rpccorsdomain IP restrictions

	
** Summary**
```
geth --fast --cache=1048 --testnet --unlock "0x8888888888888888888888888888888888888888" --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr 0.0.0.0 --rpcport 8545 console
```
	

### Parity (on Linux)
**1. Installation**
```
# sudo apt-get install cargo
# sudo cargo install --git https://github.com/ethcore/parity.git parity
```

Check
```
# parity --version
```



**2. Go to workspace**
```
cd blockchain_exploration/ethereum/dapp/PotChain/
```

**3. Deploy the contracts**
```
truffle migrate --reset --compile-all
truffle serve --p 8080
```

