import * as SQLite from "expo-sqlite";
import { db } from '../dbconnect/dbconnect';

export const OnInitialize = () => {

    // table agriculteur 
    const __tbl_historiques_agriculteurs = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_agriculteurs (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    ref varchar(60) NOT NULL,
                    nom varchar(60) NOT NULL,
                    postnom varchar(60) NOT NULL,
                    prenom varchar(60) NOT NULL,
                    email varchar(60) NOT NULL,
                    phone varchar(60) NOT NULL,
                    genre varchar(60) NOT NULL,
                    isfake int(11) NOT NULL,
                    date_de_daissance varchar(60) NOT NULL,
                    password varchar(60) NOT NULL,
                    membrecooperative int(11) NULL,
                    status int(11) NOT NULL DEFAULT 1,
                    idambassadeur int(11) NOT NULL,
                    createdon varchar(60) NOT NULL,
                    issynched int NOT NULL
                )`
            )
        })
    };
    // table champs
    const __tbl_historiques_champs = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_champs (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    champs varchar(60) NULL,
                    idagriculteurs integer NOT NULL,
                    idambassadeur integer NOT NULL,
                    dimensions float NOT NULL,
                    latitude varchar(60) NOT NULL,
                    longitude varchar(60) NOT NULL,
                    altitude varchar(60) NOT NULL,
                    idzoneproduction varchar(60) NOT NULL,
                    idculture varchar(60) NOT NULL,
                    status int(11) NOT NULL,
                    createdon varchar(60) NOT NULL,
                    issynched int not null
                )`
            )
        }, 
            er => console.log(er)
        )
    };
    // table user | Current user
    const __tbl_users = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_user (
                    id integer primary key not null,
                    realid integer NOT NULL,
                    iscollector integer NOT NULL,
                    nom varchar(100) NOT NULL,
                    postnom varchar(60) NOT NULL,
                    prenom varchar(60) NOT NULL,
                    datenaissance varchar(60) NOT NULL,
                    email varchar(60) NOT NULL,
                    phone varchar(60) NOT NULL,
                    adresse integer NOT NULL,
                    genre integer NOT NULL,
                    idvillage integer NOT NULL,
                    crearedon varchar(60) NOT NULL
                )`
            )
        }, err => {
            console.log(" ======================================================================= ");
            console.log(" Error on creating table user =>", err);
            console.log(" ======================================================================= ");
        })
    };
    // table where are stoked champs records
    const __tbl_offlinebackupChamps = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_champs (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    realid int(11) not null,
                    champs varchar(60) NULL,
                    idagriculteurs int(11) NOT NULL,
                    idambassadeur int(11) NOT NULL,
                    dimensions float NOT NULL,
                    latitude varchar(60) NOT NULL,
                    longitude varchar(60) NOT NULL,
                    altitude varchar(60) NOT NULL,
                    idzoneproduction varchar(60) NOT NULL,
                    idculture varchar(60) NOT NULL,
                    status int(11) NOT NULL,
                    createdon varchar(60) NOT NULL
                )`
            )
        }, er => console.log(er))
    };
    // table where are stoked agris records
    const __tbl_offlinebackupAgriculteurs = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_agriculteurs (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    realid int(11) not null,
                    ref varchar(60) NOT NULL,
                    nom varchar(60) NOT NULL,
                    postnom varchar(60) NOT NULL,
                    prenom varchar(60) NOT NULL,
                    email varchar(60) NOT NULL,
                    phone varchar(60) NOT NULL,
                    genre varchar(60) NOT NULL,
                    isfake int(11) NOT NULL DEFAULT 0,
                    date_de_daissance varchar(60) NOT NULL,
                    password varchar(60) NOT NULL,
                    membrecooperative int(11) DEFAULT NULL,
                    status int(11) NOT NULL DEFAULT 1,
                    idambassadeur int(11) NOT NULL,
                    createdon varchar(60) NOT NULL 
                )`
            )
        },
        e => console.log("Error occured on creating agribackup table ", e)
        )
    };
    // table where are stoked provinces records
    const __tbl_offlinebackupProvinces = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_provinces (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    realid int(11) not null,
                    province varchar(60) NOT NULL,
                    status int(11) NOT NULL DEFAULT 1,
                    createdon varchar(60) NOT NULL 
                )`
            )
        },
        e => console.log("Error occured on creating provincebackup table ", e)
        )
    };
    // table where are stoked territoire records
    const __tbl_offlinebackupTerritoires = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_territoires (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    realid int(11) not null,
                    idprovince varchar(60) NOT NULL,
                    territoire varchar(60) NOT NULL,
                    status int(11) NOT NULL DEFAULT 1,
                    createdon varchar(60) NOT NULL 
                )`
            )
        },
        e => console.log("Error occured on creating territories table ", e)
        )
    };
    // table where are stoked village records
    const __tbl_offlinebackupVillages = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_villages (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    realid int(11) not null,
                    village varchar(60) NOT NULL,
                    latitude varchar(60) NOT NULL,
                    longitude varchar(60) NOT NULL,
                    groupement varchar(60) NOT NULL,
                    territoire varchar(60) NOT NULL,
                    provincecode varchar(60) NOT NULL,
                    status int(11) NOT NULL DEFAULT 1
                )`
            )
        },
        e => console.log("Error occured on creating territories table ", e)
        )
    };
    // table where are stoked cultures records
    const __tbl_offlinebackupCultures = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_cultures (
                    id integer PRIMARY KEY AUTOINCREMENT,
                    realid int(11) not null,
                    cultures varchar(60) NOT NULL,
                    ref varchar(60) NOT NULL,
                    createdon varchar(60) NOT NULL,
                    status int(11) NOT NULL DEFAULT 1
                )`
            )
        },
        e => console.log("Error occured on creating culture table ", e)
        )
    };
    // table where are stocked products
    const __tbl_offlinebackupProducts = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_products (
                    id integer primary key not null,
                    realid integer NOT NULL,
                    designation integer NOT NULL,
                    crearedon varchar(60) NOT NULL
                )`
            )
        }, err => {
            console.log(" ======================================================================= ");
            console.log(" Error on creating table __tbl_backup_products =>", err);
            console.log(" ======================================================================= ");
        })
    };
    // table where are stocked unities
    const __tbl_offlinebackupUnities = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_unities (
                    id integer primary key not null,
                    realid integer NOT NULL,
                    designation integer NOT NULL,
                    crearedon varchar(60) NOT NULL
                )`
            )
        }, err => {
            console.log(" ======================================================================= ");
            console.log(" Error on creating table __tbl_backup_unities =>", err);
            console.log(" ======================================================================= ");
        })
    };
    // table where are stocked market
    const __tbl_offlinebackupMarket = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_markets (
                    id integer primary key not null,
                    realid integer NOT NULL,
                    designation integer NOT NULL,
                    crearedon varchar(60) NOT NULL
                )`
            )
        }, err => {
            console.log(" ======================================================================= ");
            console.log(" Error on creating table __tbl_backup_markets =>", err);
            console.log(" ======================================================================= ");
        })
    };
    // table where are stocked market
    const __tbl_offlinebackupPackets = () => {
        db.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS __tbl_backup_packets (
                    id integer primary key not null,
                    realid integer NOT NULL,
                    designation integer NOT NULL,
                    crearedon varchar(60) NOT NULL
                )`
            )
        }, err => {
            console.log(" ======================================================================= ");
            console.log(" Error on creating table __tbl_backup_packets =>", err);
            console.log(" ======================================================================= ");
        })
    };

    __tbl_offlinebackupMarket();
    __tbl_offlinebackupPackets();
    __tbl_offlinebackupUnities();
    __tbl_offlinebackupProducts();
    __tbl_offlinebackupCultures();
    __tbl_offlinebackupVillages();
    __tbl_offlinebackupTerritoires();
    __tbl_offlinebackupProvinces();
    __tbl_historiques_champs();
    __tbl_historiques_agriculteurs();
    __tbl_users();
    __tbl_offlinebackupChamps();
    __tbl_offlinebackupAgriculteurs();
    
}
