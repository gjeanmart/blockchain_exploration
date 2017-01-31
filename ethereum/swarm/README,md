# Swarm node installation
-------------------------------
## Machine:
1 vCPU + 3.75 GB memory
Disk: 10G

OS: Ubuntu 16.10

----------------------------------
## Prerequisite

### Common packages
```$ curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
$ sudo apt update
$ sudo apt install golang nodejs npm git```

###Go settings
```$ mkdir ~/go
$ export GOPATH="$HOME/go"
$ echo 'export GOPATH="$HOME/go"' >> ~/.profile```



----------------------------------
Installation from source
mkdir -p $GOPATH/src/github.com/ethereum
cd $GOPATH/src/github.com/ethereum
git clone https://github.com/ethereum/go-ethereum
cd go-ethereum
git checkout master
go get github.com/ethereum/go-ethereum

go install -v ./cmd/geth
go install -v ./cmd/swarm

$GOPATH/bin/swarm version


----------------------
Add it in the path
export PATH=" $PATH:$GOPATH/bin"
echo 'export PATH=" $PATH:$GOPATH/bin"' >> ~/.profile

----------------------------------
Configuration
mkdir ~/swarm

Create an Ethereum account on the Testnet network
$ geth --testnet --datadir ~/swarm/ account new
Your new account is locked with a password. Please give a password. Do not forget this password.
Passphrase: ************
Repeat passphrase: ************
Address: {xADDRESSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx}


----------------------------------
Run GETH Daemon
geth --datadir ~/swarm/ --testnet  --cache 256 --unlock 0 --password <(echo -n "*****") --rpc --rpcapi "eth,net,web3" --rpccorsdomain '*' --rpcaddr 0.0.0.0 --rpcport 8545


Run SWARM Daemon
swarm --bzzaccount xADDRESSxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --datadir ~/swarm  --keystore ~/swarm/testnet/keystore --ethapi ~/swarm/testnet/testnet/geth.ipc 






---------------------------------
Upload content

$ swarm --recursive --defaultpath /home/gjeanmart/workspace/greg.test/index.html --bzzapi http://0.0.0.0:8500/ up /home/gjeanmart/workspace/greg.test/
I0129 12:39:10.061500 upload.go:195] uploading file workspace/greg.test/index.html (178 bytes) and adding path
I0129 12:39:10.064874 upload.go:195] uploading file workspace/greg.test/css/app.css (90 bytes) and adding path css/app.css
I0129 12:39:10.065372 upload.go:195] uploading file workspace/greg.test/index.html (178 bytes) and adding path index.html
I0129 12:39:10.065897 upload.go:195] uploading file workspace/greg.test/js/app.js (28 bytes) and adding path js/app.js
fb009aace7f74ebe7f0b59e9d60053ef4c4fe44851dd6ee122a493be630ae367

http://104.196.202.241:8500/bzz:/fb009aace7f74ebe7f0b59e9d60053ef4c4fe44851dd6ee122a493be630ae367


---------------------------------
Register in ENS
geth attach ipc:/home/gjeanmart/swarm/testnet/geth.ipc
personal.unlockAccount(eth.accounts[0])

Download on the server https://raw.githubusercontent.com/ethereum/ens/master/ensutils.js in /home/gjeanmart/ensutils.js
loadScript('/home/gjeanmart/ensutils.js');

testRegistrar.register(web3.sha3('greg'), eth.accounts[0], {from: eth.accounts[0]});

eth.accounts[0] == ens.owner(namehash('greg.test'))

ens.setResolver(namehash('greg.test'), publicResolver.address, {from: eth.accounts[0], gas: 100000});

publicResolver.setContent(namehash('greg.test'), '0xfb009aace7f74ebe7f0b59e9d60053ef4c4fe44851dd6ee122a493be630ae367', {from: eth.accounts[0], gas: 100000})


http://104.196.202.241:8500/bzz:/greg.test/



-----------------------------------------------

$ swarm --recursive --defaultpath /home/gjeanmart/workspace/greg.test/index.html --bzzapi http://0.0.0.0:8500/ up /home/gjeanmart/workspace/greg.test/

function update(hash) {
        console.log("update(hash="+hash+")");
        personal.unlockAccount(eth.accounts[0]);

        //loadScript('./ensutils.js')
        console.log(publicResolver);
        publicResolver.setContent(namehash('greg.test'), hash, {'from': eth.accounts[0], 'gas': 100000});
}
$ geth --exec "loadScript('/home/gjeanmart/swarm/js/ensutils.js'); loadScript('/home/gjeanmart/swarm/js/update.js');update('0xd64003503c2ab518740f279f26fef10defb9919f27d858f2670613b898c4d925');" attach ipc:/home/gjeanmart/swarm/testnet/geth.ipc


-----------------------------------------------

Install Dev tools 

Truffle https://github.com/ConsenSys/truffle
$ npm install -g truffle

TestRPC https://github.com/ethereumjs/testrpc
$ npm install -g ethereumjs-testrpc


-----------------------------------------------
mkdir truffle-sample
cd truffle-sample
truffle init
truffle migrate --reset --compile-all

swarm --recursive --defaultpath /home/gjeanmart/workspace/truffle-sample/build/index.html --bzzapi http://0.0.0.0:8500/ up /home/gjeanmart/workspace/truffle-sample/build
