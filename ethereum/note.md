
Install parity (Ubuntu)

1-Install Rust language
```
# curl https://sh.rustup.rs -sSf | sh
# source $HOME/.cargo/env
# rustc --version
# > min 1.12
```


2-Install Cargo
```
# wget https://launchpad.net/ubuntu/+source/cargo/0.9.0-1/+build/9706103/+files/cargo_0.9.0-1_amd64.deb
# dpkg -i cargo_0.9.0-1_amd64.deb

# sudo apt-get update
# sudo apt-get install cargo
# cargo --version
# > min 0.9
```


3-Install Parity
```
# sudo cargo install --git https://github.com/ethcore/parity.git parity
# parity --version
```
