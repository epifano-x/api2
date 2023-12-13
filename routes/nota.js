const express = require('express');
const cors = require('cors');
const router = express.Router();
const Nota = require('../models/Nota');
const { default: mongoose } = require('mongoose');

const corsOptions = {
  origin: 'http://localhost:3001', // Substitua pelo endereço do seu aplicativo React
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  optionsSuccessStatus: 204,
};

router.use(cors(corsOptions));
/**
 * Obter por ID
 */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    new mongoose.Types.ObjectId(id);
  } catch {
    return res.status(400).json({ message: "Formato de ID inválido" });
  }

  const nota = await Nota.findById(id);

  return nota
    ? res.json(nota)
    : res.status(404).json({ message: "ID INEXISTENTE" });
});

/**
 * Obter todas as notas da coleção
 */
router.get('/', async (req, res) => {
  const notas = await Nota.find();
  return res.json(notas);
});

/**
 * Criar uma nova nota
 */
router.post("/", async (req, res) => {
  const notaData = req.body;

  try {
    const nota = await Nota.create(notaData);
    return res.json(nota);
  } catch (error) {
    return res.status(400).json({ message: "Erro ao criar a nota", error: error.message });
  }
});


/**
 * Atualizar uma nota por ID
 */
router.put("/:id", async (req, res) => {
    const notaData = req.body;
    const { id } = req.params;

    try {
        new mongoose.Types.ObjectId(id);
    } catch {
        return res.status(400).json({ message: "Formato de ID inválido" });
    }

    const notaConfere = await Nota.findById(id);

    if (notaConfere) {
        // Crie um objeto com os campos que podem ser atualizados
        const updatedFields = {
            nota: notaData.nota,
            comentario: notaData.comentario,
            updatedAt: new Date(),
        };

        try {
            // Atualize a nota com os campos fornecidos
            await Nota.updateOne({ _id: id }, updatedFields);

            return res.json({ message: "Nota atualizada com sucesso" });
        } catch (error) {
            return res.status(400).json({ message: "Erro ao atualizar a nota", error: error.message });
        }
    } else {
        return res.status(400).json({ message: "ID inexistente" });
    }
});


  

/**
 * Excluir uma nota por ID
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    new mongoose.Types.ObjectId(id);
  } catch {
    return res.status(400).json({ message: "Formato de ID inválido" });
  }

  const nota = await Nota.findById(id);

  if (!nota) {
    return res.status(404).json({ message: "ID INEXISTENTE" });
  }

  await Nota.deleteOne({ _id: id });

  return res.json(nota);
});

module.exports = router;
