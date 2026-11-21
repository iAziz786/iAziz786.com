---
title: "What breaks in PostgreSQL 19, and how to check before you upgrade"
slug: upgrading-to-postgresql-19
author: Mohammad Aziz
date: "2026-11-21"
description: "PostgreSQL 19 is out. Here are the blockers pg_upgrade catches, the ones it misses, and a checklist to run before you switch."
tags:
  - postgresql
  - postgres
  - database
  - upgrade
---

PostgreSQL 19 was released on November 19, 2026. If you run Postgres in production, the binary upgrade path from 18 looks familiar. You install the new binaries, create a new cluster, and run `pg_upgrade`.

The failures are less obvious. Some come from catalog objects that `pg_upgrade` inspects. Others come from settings and defaults that it does not read. This post separates the two. It covers the blockers that `pg_upgrade --check` reports before you touch data, an experiment that shows the most likely one, and the changes that pass the check and still cause problems after the upgrade.

The sources are the [PostgreSQL 19 release notes](https://www.postgresql.org/docs/19/release-19.html#RELEASE-19-MIGRATION) and the [pg_upgrade documentation](https://www.postgresql.org/docs/19/pgupgrade.html).

## The blockers that pg_upgrade --check catches

PostgreSQL 19 adds four checks to `check.c`. `check_for_gist_inet_ops` covers the `btree_gist` blocker, `check_old_cluster_global_names` covers the name blocker, and `check_for_unsupported_encodings` covers the `MULE_INTERNAL` blocker. The fourth check, `check_for_oldestxid_consistency`, compares oldestXID and oldestMultiXid against `datfrozenxid` and `datminmxid`.

The first one involves `btree_gist`. PostgreSQL 19 changes the default GiST operator class for `inet` and `cidr` from the extension's `gist_inet_ops` and `gist_cidr_ops` to the built-in `inet_ops`. The old `btree_gist` operator classes are broken. They can leave out rows that a query should return. `pg_upgrade` refuses to binary upgrade indexes that use them, so you cannot ignore this one.

The second one is about names. PostgreSQL 19 no longer allows newline or carriage return characters in database, role, and tablespace names. If any name in the old cluster contains either character, `pg_upgrade` refuses to continue.

The third one is encoding. The `MULE_INTERNAL` encoding is removed. You must dump a database that uses it and restore it with a different encoding. There is no binary path for it. I did not test the `MULE_INTERNAL` case.

## Find the affected indexes before you upgrade

The `btree_gist` problem is the one most likely to affect a real installation, so find out early whether you have it. Run this query on the PostgreSQL 18 cluster:

```sql
SELECT n.nspname AS schema_name,
       c.relname AS table_name,
       i.relname AS index_name,
       opc.opcname AS opclass
FROM pg_index x
JOIN pg_class i ON i.oid = x.indexrelid
JOIN pg_class c ON c.oid = x.indrelid
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN unnest(x.indclass::oid[]) AS k(opcoid) ON true
JOIN pg_opclass opc ON opc.oid = k.opcoid
WHERE opc.opcname IN ('gist_inet_ops', 'gist_cidr_ops')
ORDER BY 1, 2, 3;
```

The query joins the index catalog to the table and its schema, then expands `indclass` so that it checks every column in the index, not only the first one. I ran it against a PostgreSQL 18 cluster with one `inet` index, one `cidr` index, and one more `inet` index on a separate table. It returned all three:

```
 schema_name | table_name  |     index_name      |    opclass
-------------+-------------+---------------------+---------------
 public      | hosts       | hosts_ip_gist       | gist_inet_ops
 public      | hosts       | hosts_net_gist      | gist_cidr_ops
 public      | hosts_plain | hosts_plain_ip_gist | gist_inet_ops
(3 rows)
```

Any row in that output is a blocker for a binary upgrade. Drop those indexes before you run `pg_upgrade`, then recreate them on PostgreSQL 19, where `CREATE INDEX ... USING gist (ip)` picks the built-in `inet_ops` by default.

## The experiment

I reproduced the block in Docker using the `postgres:19` image, which runs Debian trixie with PGDG packages. The old cluster was PostgreSQL 18.7 and the new one was 19.0. The setup was small on purpose:

```sql
CREATE EXTENSION btree_gist;
CREATE TABLE t (ip inet);
CREATE INDEX t_ip_gist ON t USING gist (ip);
CREATE TABLE t2 (net cidr);
CREATE INDEX t2_c_gist ON t2 USING gist (net);
```

Then I ran the check:

```bash
pg_upgrade --check \
  -b /usr/lib/postgresql/18/bin \
  -B /usr/lib/postgresql/19/bin \
  -d old -D new
```

The check failed with this output:

```
Checking for uses of gist_inet_ops/gist_cidr_ops              fatal
Your installation contains indexes that use the btree_gist extension's
gist_inet_ops or gist_cidr_ops operator classes, which cannot be
binary-upgraded.  Replace them with indexes that use the built-in GiST
inet_ops operator class.
A list of indexes with the problem is in the file:
    /state/A_new/pg_upgrade_output.d/20261121T074224.190/gist_inet_ops.txt
Failure, exiting
```

The file named in the output contained the database and both indexes:

```
In database: a_db
  public.t_ip_gist
  public.t2_c_gist
```

A real `pg_upgrade` without `--check` failed at the same check before it moved any data. The old cluster still started and still had all 100 rows I had loaded into it. The check stops `pg_upgrade` before it changes anything, so the old cluster stays usable.

After I dropped both indexes, `--check` passed and the real upgrade printed `Upgrade Complete`. The PostgreSQL 19 cluster had the same 100 rows. Recreating the index on PostgreSQL 19 with a plain `CREATE INDEX t_ip_gist ON t USING gist (ip)` used the core `inet_ops` operator class.

The same run also showed what `--check` does not complain about. It exited 0 and said nothing about indexes that use `pg_trgm`, roles with md5 passwords, a `radius` line in the old `pg_hba.conf`, or a clean database. It also ran against a live old server, with the message `Performing Consistency Checks on Old Live Server`. You can run it while the old server is still up.

`--check` finds catalog blockers only. It does not find changes in behavior, configuration, or defaults.

## What --check does not catch

### Authentication

RADIUS support is removed. PostgreSQL only supported RADIUS over UDP, and the release notes call that unfixably insecure. If your `pg_hba.conf` uses RADIUS, you need another authentication method before the upgrade, and the check will not warn you.

MD5 password authentication still works, but a successful login now prints a warning. MD5 was already deprecated in PostgreSQL 18. You can silence the warning with `md5_password_warnings`, but a better fix is to move roles to `scram-sha-256`. PostgreSQL 19 also adds `password_expiration_warning_threshold`, which defaults to 7 days.

`standard_conforming_strings` is forced on. A dump made with an older `pg_dump` and the setting turned off will not load correctly. Take the dump with the PostgreSQL 19 `pg_dump`, or make sure the old server has `standard_conforming_strings = on`. The `escape_string_warning` setting is removed as well.

### Defaults and performance

JIT is off by default. The release notes say the JIT cost estimates were unreliable. Benchmark analytic queries with JIT on and off, and turn it on again where it helps.

`max_locks_per_transaction` changes its default from 64 to 128. PostgreSQL 19 also sizes lock space differently, so you must double a custom value to keep the same capacity. If you copy a tuned `postgresql.conf` unchanged, the server has half the lock capacity it had before.

`io_workers` is removed. The replacement settings are `io_min_workers`, `io_max_workers`, `io_worker_idle_timeout`, and `io_worker_launch_interval`.

The leader and the workers of a parallel vacuum now share one cost limit, so a parallel vacuum can be slower after the upgrade.

Two storage defaults changed. `default_toast_compression` moves from `pglz` to `lz4`. With `wal_compression` set to `on`, the server picks the best available method instead of always using `pglz`. Both can change CPU and I/O profiles on a busy system.

### Query results

`json_array()` over zero rows now returns `[]` instead of `NULL`. Code that checks for `NULL` to detect an empty result will take the wrong branch.

`postgres_fdw` now passes `READ ONLY` and `DEFERRABLE` to the remote server. A read-only transaction cannot modify data through the foreign data wrapper, so such a write now fails.

`COPY FROM ... WHERE` no longer accepts system columns. If a load script filters on `ctid` or another system column, it needs a change.

In `psql`, `\crosstabview` now honors `\pset null`, so output changes when you set a null display string.

### Work after the upgrade

Full text search and `pg_trgm` now use the database locale provider for character classification. For databases that use the ICU or builtin provider and whose locale differs from `LC_CTYPE`, especially `C`, you need to reindex the full text search and `pg_trgm` indexes and recompute any stored `tsvector` values.

`fuzzystrmatch` changed in three ways. `dmetaphone` uses the default collation. `soundex`, `metaphone`, and `difference` treat only ASCII letters as letters. Reindex any indexes that use those functions.

### Monitoring renames

Update dashboards and alerts during the upgrade. Queries that use the old names will fail or return nothing.

- `pg_stat_subscription_stats.sync_error_count` is renamed to `sync_table_error_count`.
- The wait event type `BUFFERPIN` is renamed to `BUFFER`, and `BufferPin` becomes `BufferCleanup`.
- `BufferContent` is replaced by `BufferShared`, `BufferShareExclusive`, and `BufferExclusive`.

## What is new in PostgreSQL 19

`REPACK (CONCURRENTLY)` reclaims space without blocking reads and writes, which gives you an alternative to `VACUUM FULL` for the usual bloat problem. You can turn on logical replication without a restart when `wal_level` is `replica`. Logical replication now also copies sequence values. The new `WAIT` command gives read-your-writes behavior on standbys.

Autovacuum can process indexes in parallel, and `pg_stat_autovacuum_scores` exposes the scoring it uses to decide what to vacuum next. Foreign key checks are faster, `NOT IN` becomes an anti join when no `NULL` values are possible, and sorts use radix sort. The new `pg_plan_advice` extension lets you control planner decisions, and `pg_stash_advice` applies stored advice automatically based on the query.

## Pre-upgrade checklist

1. Restore a copy of production and run `pg_upgrade --check` with the PostgreSQL 19 binaries. Fix every fatal result before you go further.
2. Run the `btree_gist` query from this post on PostgreSQL 18, then drop the affected indexes or plan their replacement.
3. Inspect database, role, and tablespace names for newline or carriage return. Confirm that no database uses `MULE_INTERNAL`.
4. Grep `postgresql.conf` and `pg_hba.conf` for `radius`, `io_workers`, `max_locks_per_transaction`, and `jit`. Plan each change, including doubling a custom lock value.
5. Move md5 roles to `scram-sha-256` and find a replacement for RADIUS.
6. Search application code for `json_array(`, for `COPY FROM` with a `WHERE` clause on a system column, and for writes through `postgres_fdw` inside read-only transactions.
7. Update dashboards and alerts for the renamed subscription statistics column and the wait event names.
8. After the upgrade, reindex full text search and `pg_trgm` indexes on ICU or builtin provider databases, and recompute stored `tsvector` values.
9. Reindex indexes that use `fuzzystrmatch` functions.
10. Benchmark analytic queries with JIT off and on, and take any future logical dump with the PostgreSQL 19 `pg_dump`.
