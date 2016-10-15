
Install parity (Ubuntu)
1. Install cargo
```
# curl https://sh.rustup.rs -sSf | sh
# wget https://launchpad.net/ubuntu/+source/cargo/0.9.0-1/+build/9706103/+files/cargo_0.9.0-1_amd64.deb
# dpkg -i cargo_0.9.0-1_amd64.deb
# sudo apt-get update
# sudo apt-get install cargo
# sudo cargo install --git https://github.com/ethcore/parity.git parity
```
