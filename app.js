let express = require("express");
let cors = require("cors")
let app = express();
let bodyParser  = require("body-parser");
let db=require("./database");
let port=3000;

app.use(bodyParser.urlencoded({ limit:'50mb',extended: true }));
app.use(bodyParser.json({ limit:'50mb',extended: true }));
app.use(cors());

let router=express.Router();

router.get('/stations',db.getAllStationsData);
router.get('/stations/page/:page',db.getAllStationsDataByPage);
router.get('/stations/:id',db.getStationsDataById);
router.get('/stations/name/:name',db.getStationsDataByName);
router.get('/stations/name/:name/page:page',db.getAllStationsDataByNameByPage);

router.get('/stations/currentActive',db.getStationsDataActive);
router.get('/stations/last',db.getStationsDataLast);

router.post('/stations',db.createStationsData);
router.put('/stations/:id',db.updateStationsData);

router.delete('/station/:id',db.deleteStationsData);
router.delete('/station/name/:name',db.deleteStationsDataByName);

app.use(router);
app.listen(process.env.PORT || port,()=>{
    console.log("Arrancando en http://localhost:"+(process.env.PORT || port)+"/stations");
})