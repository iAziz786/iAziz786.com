---
title: "Breaking Free: How I Self-Hosted My SMTP Server with Haraka"
slug: self-hosted-smtp-haraka
author: Mohammad Aziz
date: "2023-04-24"
description: "Send thousands of emails per second at the cost of pennies."
tags:
  - smtp
  - haraka
  - mail
  - email
  - smtp
  - hetzner
cover:
  image: "blog/self-hosted-smtp-haraka/images/free-smtp-email.jpg"
  caption: Photo by [Daria Nepriakhina 🇺🇦](https://unsplash.com/@epicantus?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/guiQYiRxkZY?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)
---

You use SMTP providers to programmatically send emails. I don't like these when using third-party SMTP providers:

1. Sending emails is free, I won't pay a penny more than what's minimum.
2. One small bug and you sent 10M emails. Oh no! MY MONEY!!!
3. I'm pissed that Amazon SES rejected my request for an SMTP server. :(( 
4. I won't know the internals--I know not everyone wants to know how SMTP works, but I do!

Previously I've used [Postal][p], which is not simple but okay. Can I do better? Isn't why I'm writing this?!

I found that Zerodha uses [Haraka][h] and [Karan][k]--their DevOps guy, mentioned it is easy-setup and performant.

Enough Karan, I'm already convinced. Let's do this!!

So I tried. I must say, it's darn simple!

Before that, do you know...

## 📧 The emails are sent on outbound port 25 & 465 and they are blocked by default?

Get ready for an email adventure! Imagine sending an email from *you@example.com* to *myfriend@gmail.com*. By default, your server sends the email to port 25 or 465 of the receiver's email server. It's like a secret handshake between email servers, figuring out the correct address for gmail.com before delivering your message.

But what if you want to host your own SMTP server to send those emails? Buckle up, because we're diving into the world of cloud providers! I've been using [Hetzner][hz], a fantastic value-for-money option. Now, most cloud providers are like overprotective parents – they block outbound ports 25 & 465 to prevent spamming.

No worries, though! With Hetzner, it's like joining an exclusive club. After you pay your first bill, all you need to do is raise a ticket request, and they'll unblock those ports for you, just like that. It's like having the bouncer let you into the coolest party in town.

So, gear up to host your SMTP server and send emails with freedom and style!

## DNS Setup

You need to DNS configuration to send the emails. The `MX` record should point to the IP of your server. When you send mail to `example.com`, the `MX` record is obtained. Wherever the MX records point it will eventually resolve to an IP address.

That IP is used to send the mail on either port 25 or 465. I used ChatGPT-4 to explain you about MX record & SPF.

{{< collapse summary="How do you set up an MX record?" >}}
An MX (Mail Exchange) record is a type of DNS record that specifies the mail servers responsible for receiving emails on behalf of your domain. To set up an MX record, follow these steps:

1. Log in to your domain registrar or DNS hosting provider's control panel.

2. Navigate to the DNS management section.

3. Create a new MX record with the following details:
   - Name/Host: Leave this field empty, "@" or enter your domain name, depending on the requirements of your DNS provider. This ensures that the MX record is added to the root level of your domain (e.g., example.com).
   - Type: Select "MX" as the record type.
   - Value: Enter the fully qualified domain name (FQDN) of your mail server. For example, "mail.example.com".
   - Priority: Assign a priority to the mail server. Lower numbers have higher priority. If you have multiple mail servers, the receiving server will attempt to deliver the email to the one with the highest priority first, and then move on to the others in case of failure.

4. Save the MX record: Click on the "Save" or "Add Record" button to save the new MX record. The DNS changes may take some time to propagate.

Here's an example of an MX record configuration:

- Name/Host: @ (or your domain name)
- Type: MX
- Value: mail.example.com
- Priority: 10

If you have multiple mail servers, you can add additional MX records with different priorities. For example:

- Name/Host: @ (or your domain name)
- Type: MX
- Value: backupmail.example.com
- Priority: 20

In this case, the receiving server would try to deliver emails to "mail.example.com" first, and if that fails, it would attempt delivery to "backupmail.example.com".

After setting up your MX record, your domain will be able to receive emails through the specified mail servers. Ensure that your mail servers are properly configured to accept emails for your domain and deliver them to the appropriate mailboxes.

*-- by ChatGPT*
{{< /collapse >}}

At this point, it should be enough to add the MX record but we should tackle email spoofing and phishing as well. You require SPF for that. It's one of many methods to prevent those.

{{< collapse summary="What is SPF?" >}}
Sender Policy Framework (SPF) is an email authentication protocol designed to prevent email spoofing and phishing attacks by verifying that an email message is sent from an authorized mail server.

Here's how SPF helps prevent email spoofing and phishing attacks:

1. Domain owner publishes an SPF record:
The domain owner creates an SPF record in their domain's DNS settings. This record lists all the authorized mail servers (IP addresses or hostnames) that are permitted to send emails on behalf of the domain.

2. Email is sent from a mail server:
When a mail server sends an email on behalf of the domain, the email includes the sender's domain and the IP address of the sending server in the email header.

3. Receiving mail server checks SPF record:
When the receiving mail server gets the email, it checks the sender's domain for an SPF record. If the SPF record exists, the receiving server compares the sending server's IP address or hostname against the authorized mail servers listed in the SPF record.

4. SPF validation result:
There are three possible outcomes of the SPF validation:

   - Pass: The sending server's IP address or hostname matches an authorized server in the SPF record. The receiving server accepts the email, and it is less likely to be flagged as spam or phishing.
   - Fail: The sending server's IP address or hostname does not match any authorized server in the SPF record. This suggests that the email could be a spoof or phishing attempt. The receiving server may reject the email, flag it as spam, or apply additional scrutiny.
   - Neutral or other results: In some cases, the SPF record may be misconfigured or not definitive. In these cases, the receiving server may apply other mechanisms to determine the legitimacy of the email, such as DKIM (DomainKeys Identified Mail) and DMARC (Domain-based Message Authentication, Reporting, and Conformance).

By setting up an SPF record, domain owners can help protect their domain from being used in email spoofing and phishing attacks. This makes it more difficult for attackers to impersonate a legitimate domain, ultimately reducing the effectiveness of these types of attacks.

*-- by ChatGPT*
{{< /collapse >}}

{{<collapse summary="How to add SPF to DNS record?">}}
To add an SPF record to your domain's DNS settings, follow these steps:

1. Log in to your domain registrar or DNS hosting provider's control panel.

2. Navigate to the DNS management section.

3. Create a new TXT record with the following details:
   - Name/Host: Leave this field empty, "@" or enter your domain name, depending on the requirements of your DNS provider. This ensures that the SPF record is added to the root level of your domain (e.g., example.com).
   - Type: Select "TXT" as the record type.
   - Value: Add the SPF record value. The value should start with "v=spf1" and list the authorized mail servers or IP addresses, followed by an action for unauthorized servers.

Here's an example of an SPF record value:

```
v=spf1 ip4:192.0.2.0/24 ip4:198.51.100.0/24 include:_spf.example.net -all
```

This SPF record value has the following components:

- `v=spf1`: This indicates the SPF version being used, which is version 1.
- `ip4:192.0.2.0/24`: This authorizes the IP addresses in the range 192.0.2.0 to 192.0.2.255 to send emails on behalf of the domain.
- `ip4:198.51.100.0/24`: This authorizes the IP addresses in the range 198.51.100.0 to 198.51.100.255 to send emails on behalf of the domain.
- `include:_spf.example.net`: This includes the SPF record of another domain (example.net) and authorizes its mail servers to send emails on behalf of your domain. This is useful when using third-party email services.
- `-all`: This indicates that any mail server not listed in the SPF record is not authorized to send emails on behalf of your domain. The receiving server should mark such emails as a hard fail. If you want a soft fail, use `~all` instead.

4. Save the TXT record: Click on the "Save" or "Add Record" button to save the new SPF record. The DNS changes may take some time to propagate.

Once you have added the SPF record to your domain's DNS settings, receiving mail servers will check it when they receive emails from your domain. This helps protect your domain from email spoofing and phishing attacks by verifying that emails are sent from authorized servers.

Remember to update your SPF record whenever you add or remove mail servers or third-party email services that send emails on behalf of your domain.

*-- by ChatGPT*
{{< /collapse >}}

This will be enough for the DNS related changes. We can move ahead with the Haraka setup now.

## Setup Haraka

### 1. Installation

It's a CLI tool and you can install it with NPM.

```sh
sudo npm install -g Haraka
```

Now you can use the `haraka` from your CLI. Next, create a folder which Haraka will use to start the server.

### 2. Folder & Files

The setup starts here. At first, Haraka needs a folder where it holds all files it requires.

```sh
haraka -i /var/local/your-smtp-folder
```

In Haraka's lingo, it is called creating the service. It gives you a few files and folders to work with. We need to tweak a few of them to work for our domain.

If your email address is `you@example.com` you need to put your `example.com` to the `config/host_list` file. Just put your domain name in plain text, simple as that.

You can put a subdomain as well. I like the mail domain as `mailer.example.com`.

### 3. You Need Plugins

Haraka uses plugins do to almost everything. Hence, to send emails you also need plugins. We need two plugins for now:

1. [`tls`][t] -- Haraka uses port 587 to send mails. It is like port 443 of HTTP. Therefore it requires TLS for security.
2. [`auth/flat_file`][a] -- This is for user credentials management. You shouldn't use it in production instead use [auth-enc][ae] plugin.

#### 3.a. TLS Setup

I won't go too deep into this topic but the steps below will help.

I've used [ZeroSSL][z] because they're free and simple. You've to rotate the certificates every 90 days though. But there is a way to [automate it][za].

Eventually, you will have three files, `ca_bundle.crt`, `certificate.crt`, and `private.key`. You need to generate a new file combining these three files.

The order here is important, so **follow the order** of the `cat` command.

```sh
cat private.key certificate.crt ca_bundle.crt > config/tls/example.com.pem
```

The `config` folder here resides in the folder which the `haraka` command generated for you on [step 2](#2-folder--files).

#### 3.b. Auth User Setup

You need to create a `config/auth_flat_file.ini` file. Put this content inside it. Don't forget to change `testpassword` with a stronger password.

```ini
[core]
methods=PLAIN,LOGIN,CRAM-MD5

[users]
you@example.com=testpassword
```

### 4. Check If All Works

You must be done at this point. There are lots of tools to check SMTP. I'm going to use `swaks`.

```sh
swaks --tls --to myfriend@gmail.com --from you@example.com --server example.com --port 587 --auth-user you@example.com --auth-password testpassword
```

This command sends a test mail to `myfriend@gmail.com` from `you@example.com` using `example.com` on secure port `587` using `you@example.com`'s credentials with password `testpassword`.

Here is a service file which you can use with systemd for the Haraka process management.

```service
[Unit]
Description=Running Haraka mail servers
After=network.target
Wants=network-online.target

[Service]
Restart=always
Type=simple
ExecStart=/usr/bin/sudo /usr/bin/haraka -c /var/local/your-smtp-folder

[Install]
WantedBy=multi-user.target
```

Change the `/var/local/your-smtp-folder` to the location where you've created the Haraka service.

## Conclusion

At the start I mentioned setting up an SMTP server is darn simple. Maybe you might find it a little intimidating. I understand you. I'm a nerd who wants to know the internals. You might not. Feel free to use whatever is your preference. Easy or a more hands-on setup like this post. I wrote this for my future self and also for people who like to get intimidated. Who push to understand the systems they work with.

And for those who do, you will find that setting up this may require only one hour. In my case the only time taking process was to wait to unblock port 25 & 465 from Hetzner. Once it had, everything flows smoothly.

If you face any issue and wants to talk to me, just hit me up on Twitter.

Twitter: [iAziz786][tw]

[h]: https://github.com/haraka/Haraka
[k]: https://mrkaran.dev/
[p]: https://github.com/postalserver/postal
[t]: https://haraka.github.io/plugins/tls/
[a]: https://haraka.github.io/plugins/auth/flat_file
[ae]: https://github.com/AuspeXeu/haraka-plugin-auth-enc-file
[z]: https://zerossl.com/
[za]: https://github.com/zerossl/zerossl-bot
[tw]: https://twitter.com/iAziz786
[hz]: https://www.hetzner.com/
[mx]: https://blog.lemlist.com/how-to-setup-mx-records/