import axios from 'axios';
import { endpoint, endpointcollector } from '../assets/configs/configs';
import { db, storage } from './dbconnect/dbconnect';

import { OnInitialize } from './tables/tables';
import { keys } from '../assets/Helper/Helpers';

OnInitialize(); // initialize tables and create them if not exist

axios.interceptors.request.use(async config => {
    const controller = new AbortController();
    const { code, data, message } = await syncLocalStorageLOAD({ key: keys['token'] });
    if (code === 200) {
        config.headers.apikey = "$2b$10$AS6GbX37SkQS6skhMOYjveDOuUUgvGz9dvsrCbeylWl/SwMkDDp2G";
        config.headers.apikeyaccess = "kivugreen@api2022";
        config.headers['x-connexion-hewagri-origin-mob'] = true;
        config.headers['x-connexion-hewagri'] = data.trim();
    }
    return { ...config, signal: controller.signal };
}, rejected => {
    return new Promise.reject(rejected)
});

axios.interceptors.response.use(
    (resposne) => {
        return resposne;
    }
    , error => {
        const er = error.response ? error.response : undefined;
        return er ? er : new Promise.reject(error)
    });

export const timeout = 25000;
const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Access-Control-Allow-Origin", "*");
headers.append("Access-Control-Allow-Methods", "POST, GET, PUT");
headers.append("Accept", "application/json");

export const onRunInsertQRY = async ({ columns, dot, table, values, options }, cb) => {
    try {
        db.transaction(
            (tx) => {
                tx.executeSql(`insert into ${table} (${columns}) values (${dot})`, values);
                tx.executeSql(`select * from ${table}`, [], (_, { rows }) => {
                    cb(undefined, rows['_array'][0])
                });
            }, err => {
                console.log(" ======================================================================= ");
                console.log(" Error on inserting => ", err);
                console.log(" ======================================================================= ");
                cb(err, undefined)
            }
        );
    } catch (error) {
        return cb(error, undefined)
    }
};

export const onRunRawQRY = async ({ table, sql, options }, cb) => {
    try {
        db.transaction(
            (tx) => {
                tx.executeSql(`${sql}`);
                tx.executeSql(`select * from ${table}`, [], (_, { rows }) => {
                    cb(undefined, rows['_array'][0])
                });
            });
    } catch (error) {
        console.log(" Erreur vient de se produire => ", error);
        return cb(error, undefined)
    }
};

export const onRunRemoveQRY = async ({ table, clause }, cb) => {
    try {
        // DELETE FROM `__tbl_users` WHERE `__tbl_users`.`id` = 1 » ?
        db.transaction(
            (tx) => {
                tx.executeSql(`delete from ${table} where id <> 0`, null,
                    (line) => {
                        cb(undefined, 'done')
                    },
                    (err) => cb(err, undefined)
                )
            });
    } catch (error) {
        return cb(error, undefined)
    }
};

export const onRunRetrieveQRY = async ({ table, limit, clause }, cb) => {
    limit = limit ? limit : 1;
    clause = clause && typeof clause === "string" ? clause : "";
    try {
        db.transaction(
            (tx) => {
                tx.executeSql(`select * from ${table} ${clause} limit ${limit}`, [], (_, { rows }) => {
                    cb(undefined, rows['_array'] && rows['_array']['length'] ? rows['_array'] : [])
                }, (err) => {
                    cb(err, undefined)
                });
            }
            , (err) => {
                cb(err, undefined)
            }
        );
    } catch (error) {
        cb(error, undefined)
    }
};

export const onRunExternalRQST = async ({ url, data, method }, cb) => {

    try {
        await axios({
            timeout,
            method: method ? method : "GET",
            data: data ? data : null,
            url: `${endpoint}/api${url}`,
            headers: {
                ...headers
            }
        })
            .then(res => {
                return cb(undefined, res['data'])
            })
            .catch(err => {
                return cb(err, undefined)
            })
    } catch (error) {
        return cb(error, undefined)
    }
};

export const onRunExternalRQSTE = async ({ url, data, method }, cb) => {
    const u_ = `${endpointcollector}${url}`;
    try {
        await axios({
            timeout,
            method: method ? method : "GET",
            data: data ? data : null,
            url: u_,
            headers: {
                'Authorization': `Bearer ${global.token}`,
                'Content-Type': 'application/json',
                'Cookie': 'PHPSESSID=2ae70f3aa67a740328d793f3e7798e73'
            }
        })
            .then(res => {
                return cb(undefined, res['data'])
            })
            .catch(err => {
                return cb(err, undefined)
            })
    } catch (error) {
        return cb(error, undefined)
    }
};

export const onDeconnextion = async (cb) => {
    try {
        db.transaction(
            (tx) => {
                tx.executeSql(`delete from __tbl_user where id <> 0`, null);
                tx.executeSql(`delete from __tbl_agriculteurs where id <> 0`, null);
                tx.executeSql(`delete from __tbl_champs where id <> 0`, null);
                tx.executeSql(`delete from __tbl_backup_champs where id <> 0`, null);
                tx.executeSql(`delete from __tbl_backup_agriculteurs where id <> 0`, null);
                tx.executeSql(`delete from __tbl_backup_provinces where id <> 0`, null);
                tx.executeSql(`delete from __tbl_backup_territoires where id <> 0`, null);
                tx.executeSql(`delete from __tbl_backup_villages where id <> 0`, null);
                tx.executeSql(`delete from __tbl_backup_cultures where id <> 0`, null);
            },
            err => {
                cb(err, undefined)
            },
            done => cb(undefined, "done"),
            err => {
                console.log("Error on deconnexion => ", err);
            }
        );
    } catch (error) {
        console.log(" Error ", error);
        cb(error, undefined)
    }
};

export const megaStorage = async ({ data, table, columns, dots, cb }) => {
    try {
        db.transaction(
            (tx) => {
                tx.executeSql(`DELETE FROM ${table}`);
                data && data.length > 0 && data.forEach((v, i) => {
                    const values = [];
                    columns.forEach((vV, i) => {
                        if (vV === 'realid') values.push(`${v['id']}`)
                        else values.push(`${v && v[vV]}`)
                    })
                    console.log(values);
                    tx.executeSql(`insert into ${table} (${columns}) values (${dots})`, values);
                })
                tx.executeSql(`select * from ${table}`, [], (_, { rows }) => {
                    console.log(rows['_array']);
                    cb(undefined, rows['_array'] && rows['_array']['length'] ? rows['_array'] : [])
                }, (err) => {
                    // console.log(" An error was occured => ", err);
                    cb(err, undefined)
                });
            },
            err => console.log(" An error was occured => ", err)
        );
    } catch (error) {
        return cb(error, undefined)
    }
};

export const localStorageSAVE = async ({ data, key, expires }, cb) => {
    expires = expires ? expires : 1000 * 3600 * 24;
    storage.save({
        key: key, // Note: Do not use underscore("_") in key!
        data: data,

        // if expires not specified, the defaultExpires will be applied instead.
        // if set to null, then it will never expire.
        expires
    })
        .then(d => {
            cb(undefined, data)
        })
        .catch(e => {
            cb(`error on saving ${key}`, undefined)
        })
};

export const localStorageLOAD = async ({ key }, cb) => {
    storage
        .load({
            key: key ?? 'loginState',

            // autoSync (default: true) means if data is not found or has expired,
            // then invoke the corresponding sync method
            autoSync: false,

            // syncInBackground (default: true) means if data expired,
            // return the outdated data first while invoking the sync method.
            // If syncInBackground is set to false, and there is expired data,
            // it will wait for the new data and return only after the sync completed.
            // (This, of course, is slower)
            syncInBackground: true,

            // you can pass extra params to the sync method
            // see sync example below
            syncParams: {
                extraFetchOptions: {
                    // blahblah
                },
                someFlag: true
            }
        })
        .then(ret => {
            // found data go to then()
            // console.log(ret.userid);
            // console.log(ret);
            cb(undefined, ret)
        })
        .catch(err => {
            // any exception including data not found
            // goes to catch()
            // console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    cb(1, undefined)
                    break;
                case 'ExpiredError':
                    // TODO
                    cb(2, undefined)
                    break;
            }
        });
};

export const syncLocalStorageLOAD = async ({ key }) => {
    try {
        const infos = await storage
            .load({
                key: key ?? 'loginState',

                // autoSync (default: true) means if data is not found or has expired,
                // then invoke the corresponding sync method
                autoSync: false,

                // syncInBackground (default: true) means if data expired,
                // return the outdated data first while invoking the sync method.
                // If syncInBackground is set to false, and there is expired data,
                // it will wait for the new data and return only after the sync completed.
                // (This, of course, is slower)
                syncInBackground: true,

                // you can pass extra params to the sync method
                // see sync example below
                syncParams: {
                    extraFetchOptions: {
                        // blahblah
                    },
                    someFlag: true
                }
            })
        return {
            code: 200,
            message: "Done loading infos",
            data: infos
        }
    } catch (error) {
        return {
            code: 500,
            message: "Error",
            data: error
        }
    }
};


