const express = require("express");
const router = express.Router();
const { getRooms, createRoom } = require("../controller/roomController");


router.get('/', getRooms);
router.post('/', createRoom);

module.exports = router;
