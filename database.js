//let db = require('mysql');
/*let pool = db.createPool({
    host: 'ec2-34-246-141-162.eu-west-1.compute.amazonaws.com',
    user: 'musgxcjuljsjvi',
    password: '3f0e31cee864214a979ba33ba91545a4341111f5284367adb3a889d010a1064d',
    port: 5432,
    database: 'deecjjqs24ie57'
})*/
let db = require('pg');
let pool = new db.Pool({
    host: 'ec2-34-246-141-162.eu-west-1.compute.amazonaws.com',
    user: 'musgxcjuljsjvi',
    password: '3f0e31cee864214a979ba33ba91545a4341111f5284367adb3a889d010a1064d',
    port: 5432,
    database: 'deecjjqs24ie57'
})
const table='data';

const getAllStationsData = (request, response) => {
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let q = "SELECT * FROM data ORDER BY time desc";
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            // response.status(200).json(result);
            response.status(200).json(result.rows);
        }
    })
}
const getAllStationsDataByPage = (request, response) => {
    //el request
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let page = request.params.page;
    if (!page || page < 1) {
        page = 1;
    }
    let nperpage = 10;
    let offset = (page - 1) * nperpage;
    let q = `SELECT * FROM data ORDER BY time DESC LIMIT ${nperpage} OFFSET ${offset}`;
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            //response.status(200).json(result);
            response.status(200).json(result.rows);
        }
    })
}


const getStationsDataById = (request, response) => {
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let id = request.params.id;
    let q = `SELECT * FROM data WHERE id=${id}`;
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            //response.status(200).json(result);
            response.status(200).json(result.rows);
        }
    })
}

const getStationsDataByName = (request, response) => {
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let name = request.params.name;
    let q = `SELECT * FROM data WHERE name='${name}' ORDER BY time desc`;
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            //response.status(200).json(result);
            response.status(200).json(result.rows);
        }
    })
}

const getAllStationsDataByNameByPage = (request, response) => {
    //el request
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let name = request.params.name;
    let page = request.params.page;
    if (!page || page < 1) {
        page = 1;
    }
    let nperpage = 10;
    let offset = (page - 1) * nperpage;
    let q = `SELECT * FROM data WHERE name='${name}' ORDER BY time DESC LIMIT ${nperpage} OFFSET ${offset}`;
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            //response.status(200).json(result);
            response.status(200).json(result.rows);
        }
    })
}


const getStationsDataActive = (request, response) => {
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let name = request.params.name;
    let q = `SELECT DISTINCT(name),data,time,id FROM data WHERE time > (NOW() - INTERVAL '10 min') ORDER BY time desc`;
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            //response.status(200).json(result);
            response.status(200).json(result.rows);
        }
    })
}
const getStationsDataLast = (request, response) => {
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let name = request.params.name;
    let q = `SELECT DISTINCT(name),data,time,id FROM data ORDER BY time desc`;
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            console.log(result);
            //response.status(200).json(result);
            response.status(200).json(result.rows);
        }
    })
}

const createStationsData = (request, response) => {
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let data = '';
    let station='';
    if (request.body.data) {
        data = JSON.parse(request.body.data);
    }
    if (request.body.station) {
        station = request.body.station;
    }
    //let datos=JSON.parse(request.body);  //desde ionic
   // let q = `INSERT INTO clientes (name) VALUES ('${name}')`;
    let q = `INSERT INTO data (station,data,time) VALUES ('${station}','${JSON.stringify(data)}',NOW()) 
             RETURNING id as id`;
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
           // console.log(result);
            //response.status(200).json(result.insertId);
            response.status(200).json(result.rows[0].id);
        }
    })
}
const updateStationsData = (request, response) => {
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let id = request.params.id;
    let data = '';
    let station = '';
    if (request.body.station) {
        station = request.body.station;
    }
    if (request.body.data) {
        data = JSON.parse(request.body.data);
    }
    //let datos=JSON.parse(request.body);
    if(data!='' && station!=''){
        let q = `UPDATE data SET `
        if(station!=''){
            `station = '${station}'`; 
        }
        if(data!=''){
            `data = '${JSON.stringify(data)}'`; 
        }
        
        q+=` WHERE id=${id}`;
        pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //console.log(result);
            response.status(200).json(`Usuario ${id} actualizado`);
        }
    })
    }else{
        response.status(200).json(`Nada que actualizar`);
    }
    
}
const deleteStationsData = (request, response) => {
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let id = request.params.id;
    
    let q = `DELETE FROM data WHERE id=${id}`;
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //console.log(result);
            response.status(200).json(`Información ${id} eliminada`);
        }
    })
}

const deleteStationsDataByName = (request, response) => {
    let apiKey=request.headers.apikey;
    if(!watchDog(apiKey)){
        response.status(403).json("La ApiKey no es válida.");
        return;
    }
    let name = request.params.name;
    
    let q = `DELETE FROM data WHERE name='${name}'`;
    pool.query(q, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            //console.log(result);
            response.status(200).json(`Información de la estación ${name} eliminada`);
        }
    })
}
const watchDog=(apiKey)=>{
    console.log(apiKey)
    if(apiKey!="Franciscodelosrios.es"){
        return false 
    }else{
        return true;
    }
}

module.exports = {
    getAllStationsData,
    getAllStationsDataByPage,
    getStationsDataById,
    getStationsDataByName,
    getAllStationsDataByNameByPage,
    getStationsDataActive,
    getStationsDataLast,
    createStationsData,
    updateStationsData,
    deleteStationsData,
    deleteStationsDataByName
}