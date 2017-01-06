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
You need to figure out which IP has been addressed to your device (ethnode-xxxxxx) : 192.168.0.XXX

- Open a SSH client (Putty) and connect to the device [username: pi | password: raspberry]

- Change the password
```
pi@ethnode-xxxxxx:~ $ passwd
Changing password for pi.
(current) UNIX password: raspberry
Enter new UNIX password: ******
Retype new UNIX password: ******
passwd: password updated successfully
```

- Managing the daemon
Parity runs as a bootup service so it wakes up automatically. You can stop, start, restart and check the console output using systemctl:
```
sudo systemctl stop|start|restart|status parity
```
