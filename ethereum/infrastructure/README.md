# Setup an Ethereum DAPP (Decentralized APPlication) on RaspberryPi 3

## Material:
- Raspberry Pi 3 - Model B [https://www.raspberrypi.org/products/raspberry-pi-3-model-b/]


## Prerequisite
- Download the EthRaspbian image (you can choose from Geth or Parity images): http://ethraspbian.com/downloads/image_2017-01-01-EthRaspbian-parity-1.4.7-lite.zip
- unzip image_2017-01-01-EthRaspbian-parity-1.4.7-lite.zip
- Insert a SD card into your computer
- Install the image on your SD card using Win32DiskInstaller  [https://sourceforge.net/projects/win32diskimager/]
<IMAGE>
- Once done, extract the SD card

## Installation
- Insert the SD card into the Raspberry Pi
- Plug it to the network (Ethernet)
- Power it on

- Network settings
You need to figure out which IP has been addressed to your device : 192.168.0.XXX

- Open a SSH client (Putty) and connect to the device [username: pi | password: raspberry]

- Change the password
```
$ passwd
Changing password for pi.
(current) UNIX password: raspberry
Enter new UNIX password: ******
Retype new UNIX password: ******
passwd: password updated successfully
```

## Ethereum Node:

### Parity

- Managing the daemon
Parity runs as a bootup service so it wakes up automatically. You can stop, start, restart and check the console output using systemctl:
```
$ sudo systemctl stop|start|restart|status parity
```


- Parity Settings
```
$ vi /etc/parity/parity.conf
ARGS='--testnet --unlock "*************"  --password "/etc/parity/*************.password" --jsonrpc-apis "eth,net,web3" --jsonrpc-cors '*' --jsonrpc-interface 0.0.0.0 --jsonrpc-port 8545 --jsonrpc-hosts=all --no-dapps'
```


### GETH

- Create an account
```
geth account new --testnet --datadir /home/pi/swarm/ 
```

- GETH Settings
```
$ vi /etc/geth/geth.conf
ARGS=--datadir /home/pi/swarm/ --testnet  --cache 256 --unlock 0 --password <(echo -n "*****") --rpc --rpcaddr 0.0.0.0
```

- Managing the daemon

geth runs as a bootup service so it wakes up automatically. You can stop, start, restart and check the console output using systemctl:
```
$ sudo systemctl stop|start|restart|status geth
```


## SWARM (Decentralized File storage)
- Daemon
```
swarm --bzzaccount "0xADDRESS" --datadir /home/pi/swarm/ --keystore /home/pi/swarm/testnet/keystore --ethapi /home/pi/swarm/testnet/geth.ipc --bzzapi http://0.0.0.0:8500
```

- Read a file
Im the browser
http://192.168.0.22:8500/bzz:/photoalbum.eth/
http://192.168.0.22:8500/bzz:/%HASH%

Upload a file
```
$ git clone https://github.com/ethersphere/go-ethereum.git
$ ./go-ethereum/swarm/cmd/bzzup.sh /path/to/myfile
```

## Development environment

**Prerequisite**
- Install Git, NodeJS and NPM
```
$ $ curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
$ sudo apt-get install nodejs npm git
```


**Truffle**
https://github.com/ConsenSys/truffle
```
$ npm install -g truffle
```

**TestRPC**
https://github.com/ethereumjs/testrpc
```
npm install -g ethereumjs-testrpc
```
