-- TABLE
CREATE TABLE device_list_ipv4
(
	id INTEGER not null
		constraint device_list_ipv4_pk
			primary key autoincrement,
	network_id INTEGER
		constraint device_list_ipv4_network_list_ipv4_id_fk
			references network_list_ipv4
				on update cascade on delete cascade,
	name text,
	ip_address bigint,
	mac_address text
);
CREATE TABLE group_list
(
	id INTEGER not null
		constraint group_list_pk
			primary key autoincrement,
	name text
);
CREATE TABLE network_list_ipv4
(
	id INTEGER not null
		constraint network_list_ipv4_pk
			primary key autoincrement,
	group_id integer
		constraint network_list_ipv4_group_list_id_fk
			references group_list
				on update cascade on delete cascade,
	name text,
	network bigint,
	mask bigint
);
CREATE TABLE subnetwork_list_ipv4
(
	id INTEGER not null
		constraint subnetwork_list_ipv4_pk
			primary key autoincrement,
	network_id integer
		constraint subnetwork_list_ipv4_network_list_ipv4_id_fk
			references network_list_ipv4
				on update cascade on delete cascade,
	name text,
	start bigint,
	end bigint
);
CREATE TABLE version
(
	version int default 1 not null
		constraint version_pk
			primary key
);
 
-- INDEX
CREATE UNIQUE INDEX device_list_ipv4_id_uindex
	on device_list_ipv4 (id);
CREATE INDEX device_list_ipv4_network_id_index
	on device_list_ipv4 (network_id);
CREATE UNIQUE INDEX group_list_id_uindex
	on group_list (id);
CREATE INDEX network_list_ipv4_group_id_index
	on network_list_ipv4 (group_id);
CREATE UNIQUE INDEX network_list_ipv4_id_uindex
	on network_list_ipv4 (id);
CREATE UNIQUE INDEX subnetwork_list_ipv4_id_uindex
	on subnetwork_list_ipv4 (id);
CREATE INDEX subnetwork_list_ipv4_network_id_index
	on subnetwork_list_ipv4 (network_id);
CREATE UNIQUE INDEX group_list_name_uindex
	on group_list (name);
CREATE UNIQUE INDEX network_list_ipv4_group_id_name_uindex
	on network_list_ipv4 (group_id, name);
CREATE UNIQUE INDEX subnetwork_list_ipv4_network_id_name_uindex
	on subnetwork_list_ipv4 (network_id, name);
CREATE UNIQUE INDEX device_list_ipv4_network_id_name_uindex
	on device_list_ipv4 (network_id, name);

-- INSERT
INSERT INTO version (version) VALUES(1);
