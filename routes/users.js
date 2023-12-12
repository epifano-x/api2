var express = require('express');
var router = express.Router();
const User = require("../models/User");
const { default: mongoose } = require('mongoose');

/**
 * Obter peloI ID
 */
router.get("/:id", async (req, res) => {
  const {id} = req.params;
  try {
    new mongoose.Types.ObjectId(id);
  }catch{
    return res.status(400).json( {message: "o formato do id e invalido"})
  }
  
  const user = await User.findById(id);

  return user
  ? res.json(user)
  : res.status(404).json({ message: "ID INEXISTENTE" });

}); 



/**
 * Obter todos os usuários da  collection
 */
router.get('/', async (request, response) => {
  const users = await User.find();
  return response.json(users);
});

router.post("/", async (req, res) => {
  const user = req.body;

  await User.create(user);

  return res.json(user);
});

router.put("/:id", async (req, res) => {
  const userJson = req.body;
  const {id} = req.params;
  try {
    new mongoose.Types.ObjectId(id);
  }catch{
    return res.status(400).json({message:"o formato do id e invalido"})
  }

  const userConfere = await User.findById(id);

  if(userConfere){
    userJson.updatedAt = new Date();
    userJson.createdAt = userConfere.creatdAt;

    const hasErrors = new User(userJson).validateSync();
    if(hasErrors) return res.status(400).json(hasErrors);

    await User.updateOne({_id: id}, userJson);
    return res.json(userJson);
  }else{
    return res.status(400).json({message:"o formato do id e invalido"})
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    new mongoose.Types.ObjectId(id);
  } catch {
    return res.status(400).json({ message: "o formato do id e invalido" });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "ID INEXISTENTE" });
  }

  await User.deleteOne({ _id: id });

  return res.json(user);
});

module.exports = router;