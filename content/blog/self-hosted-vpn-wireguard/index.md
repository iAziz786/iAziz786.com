---
title: "Self-hosted: WireGuard VPN Server on Ubuntu, with MacOS and Android Clients"
slug: self-hosted-vpn-wireguard
author: Mohammad Aziz
date: "2023-05-25"
description: "You don't need to buy a VPN provider to get high performance VPN server."
categories:
  - "vpn"
tags:
  - vpn
  - wireguard
  - hetzner
  - android
  - macos
  - ubuntu
cover:
  image: "blog/self-hosted-vpn-wireguard/images/grayscale-photography-of-penguin.jpg"
  caption: Photo by [Jean van der Meulen](https://www.pexels.com/photo/grayscale-photography-of-penguin-2078475/)
---

WireGuard is a modern, high-performance VPN designed to be easy to use while providing robust security. This guide will walk you through the steps to set up a WireGuard VPN server on Ubuntu, and connect to it using MacOS and Android clients.

### Setting up the WireGuard VPN Server

1. **Install WireGuard** on your Ubuntu server:

   ```bash
   sudo add-apt-repository ppa:wireguard/wireguard
   sudo apt-get update
   sudo apt-get install wireguard
   ```

2. **Generate the server keys**:

   ```bash
   umask 077
   wg genkey | tee /etc/wireguard/privatekey | wg pubkey > /etc/wireguard/publickey
   ```

3. **Configure the VPN** in `/etc/wireguard/wg0.conf`:

   ```bash
   [Interface]
   Address = 10.0.0.1/24
   ListenPort = 51820 # standard port, change as you like
   PrivateKey = (your server's private key)

   PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
   PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
   ```

4. **Enable and start the VPN**:

   ```bash
   sudo systemctl enable wg-quick@wg0
   sudo systemctl start wg-quick@wg0
   ```
5. **Configuring Firewall** (optional): If your firewall blocks all ports by default you have to allow UDP connections on port **51820** as WireGuard uses UDP for its transport protocol.

If you use **`ufw`** use the following commands.

  ```bash
  sudo ufw allow 51820/udp
  ```

Remember to enable the firewall if it's not already enabled:

  ```bash
  sudo ufw enable
  ```

### Connecting a MacOS Client

1. **Install WireGuard** on your MacOS device. You can do this through the [App Store](https://apps.apple.com/us/app/wireguard/id1451685025?mt=12). Also, make sure that you have wireguard CLI install. You can do that by running homebrew command.

  ```bash
  brew install wireguard-tools
  ```

2. **Generate the client keys** in terminal:

   ```bash
   wg genkey | tee privatekey | wg pubkey > publickey
   ```

3. **Add the client's public key to the server's configuration**:

   ```bash
   [Peer]
   PublicKey = (your client's public key)
   AllowedIPs = 10.0.0.2/32
   ```

Restart the WireGuard service to apply the changes:

  ```bash
  sudo systemctl restart wg-quick@wg0
  ```

4. **Create the client configuration** in WireGuard on MacOS:

   ```bash
   [Interface]
   PrivateKey = (your client's private key)
   Address = 10.0.0.2/32
   DNS = 10.0.0.1

   [Peer]
   PublicKey = (your server's public key)
   Endpoint = (your server's IP):51820
   AllowedIPs = 0.0.0.0/0
   ```

### Connecting an Android Client

1. **Install the WireGuard app**: Open the Google Play Store on your Android device, search for WireGuard, and install the WireGuard app.

2. **Generate a key pair**: Open the WireGuard app and tap the "+" button to add a new tunnel. Select "Create from scratch." This will create a new key pair for your Android client.

3. **Configure the tunnel**: In the new tunnel configuration:

    - **Name** your tunnel. This can be anything you like. It's just to identify the connection in your WireGuard app.
    - The **Private key** should be automatically generated. Tap on the eye icon to view the key and the corresponding **Public key**. You'll need to add this Public key to your server's configuration later.
    - For **Addresses**, enter the next IP address in your VPN's subnet. For example, if your server is `10.0.0.1` and your macOS client is `10.0.0.2`, you could use `10.0.0.3/32` for your Android client.
    - Leave **DNS servers** empty for now.
    - Under **Peer**, you'll need to add the Public key of your server, the **Endpoint** (your server's public IP address and the port WireGuard is listening on), and the **Allowed IPs**. For Allowed IPs, you can use `0.0.0.0/0` to route all traffic through the VPN, or use your VPN's subnet (`10.0.0.0/24` in this example) to only route internal VPN traffic.

4. **Add the Android client to the server's configuration**: On your server, open the WireGuard configuration file (`/etc/wireguard/wg0.conf`), and add a new `[Peer]` section for the Android client. It should look something like this:

    ```
    [Peer]
    PublicKey = ANDROID_PUBLIC_KEY
    AllowedIPs = 10.0.0.3/32
    ```

    Replace "ANDROID_PUBLIC_KEY" with the Public key you generated on your Android device. Save the file and exit, then restart the WireGuard service to apply the changes:

    ```
    sudo systemctl restart wg-quick@wg0
    ```

5. **Connect**: Back on your Android device, you can now tap the toggle switch to connect to the VPN. If everything is configured correctly, it should connect successfully. You can verify your connection by checking your IP address (it should be your server's IP address if you're routing all traffic through the VPN), or by trying to access a resource on your VPN's network.

### Speed Differences

Depending upon the various factors you speed might vary with the VPN. Let's see how does the speed looks like for me. My VPN server is hosted in **Finland** and I'm using it form **India** so definitely there will be some latencies.

#### Speed without VPN

I'm getting **197.32 Mbps** download and **143.42 Mbps** upload speed out of my 200 Mbps connection without any VPN in place.


#### Speed with VPN

I'm getting **177.80 Mbps** download and **66.52 Mbps** upload speed out of my 200 Mbps connection with any VPN in place.

👋🏼
