---
title: How to Get a Free PostgreSQL* Database?
slug: free-cockroachdb-server
author: Mohammad Aziz
date: "2022-07-02"
description: "Relation databases are fit for more general workload than NoSQL database. Know how you can get your own  PostgreSQL* server for free."
categories:
  - "database"
tags:
  - postgres
  - postgresql
  - cockroachdb
cover:
  image: "blog/free-cockroachdb-server/images/database-rack-looking.jpeg"
  caption: "Photo by Engin Akyurt on [Pexels](https://www.pexels.com/photo/light-city-street-dirty-10149268/)"
---

### Sign Up to Cockroachlabs Cloud

Go to the [cockroachlabs.com](https://www.cockroachlabs.com/) and create your account.

### Create a Cluster on their Cloud

After successfully login you will see an option to create the cluster.
 * Click on the _Create Cluster_.
 * Select Serverless on the plan section.
 * Configure other options like Cloud provider, Regions, Spend limit, and the Cluster name as you like.
 * Next, click on the _Create your free cluster_.

You get a cluster with **5 GB** of storage space.
It is ~10x more than the offering from MongoDB Atlas.

### Create the DB User

After the cluster creation it will ask you to create the user.
Enter the username you like and generate the password for that user.

Copy the generated password for future use.

### Get the Connection String

Now that your are ready to connect to the database, click on the Connect button for the connection URL.
It will have the `postgresql` dialect and all the other details except the password which you have copied from the previous step.

> _There you have it! A PostgreSQL* cluster on cloud for free_.

### *Does CockroachDB supports all the features of PostgreSQL?
* No, there are few features which are not supported. Please refer to the [PostgreSQL Compatibility](https://www.cockroachlabs.com/docs/stable/postgresql-compatibility.html#unsupported-features) page for more info.