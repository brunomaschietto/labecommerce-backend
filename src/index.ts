import express, { Request, Response } from "express";
import cors from "cors";
import { users, products, purchases } from "./database";
import { PRODUCTS_CATEGORY } from "./types";
import { db } from "./database/knex";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
  console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`
    SELECT * FROM users;
    `);
    res.status(200).send({ Users: result });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/products", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`
    SELECT * FROM products;
    `);
    res.status(200).send({ Produtos: result });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/purchases", async(req: Request, res: Response) => {
  try {
    const result = await db.raw(`
    SELECT * FROM purchases;
    `);
    res.status(200).send({ Compras: result });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});


app.get("/products/search", async (req: Request, res: Response) => {
  try {
    const q = req.query.q as string;
    if (q.length < 1) {
      res.status(404);
      throw new Error(
        "O nome do produto deve possuir mais do que um caractere"
      );
    }
    const [product] = await db.raw(`
    SELECT * FROM products
    WHERE name = "${q}";
    `);
    res.status(200).send({ Produto: product });
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.post("/users", async (req: Request, res: Response) => {
  try {
    const { id, email, password } = req.body;

    if (!id || !email || !password) {
      res.status(400);
      throw new Error("Dados inválidos");
    }
    const result = await db.raw(`
        INSERT INTO users(id, email, password)
        VALUES("${id}", "${email}", "${password}")
        `);
    res.status(200).send(`${id} cadastrado com sucesso!`);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/products", async (req: Request, res: Response) => {
  try {
    const { id, name, price, category } = req.body;

    if (!id || !name || !price || !category) {
      res.status(400);
      throw new Error("Dados inválidos");
    }
    const result = await db.raw(`
        INSERT INTO users(id, name, price)
        VALUES("${id}", "${name}", "${price}", "${category}")
        `);
    res.status(200).send(`${id} cadastrado com sucesso!`);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.post("/purchases", async (req: Request, res: Response) => {
  try {
    const { id, total_price, paid, delivered_at, buyer_id } = req.body;

    if (!id || !total_price || !paid || !delivered_at || !buyer_id) {
      res.status(400);
      throw new Error("Dados inválidos");
    }
    const result = await db.raw(`
        INSERT INTO purchases(id, total_price, paid, delivered_at, buyer_id)
        VALUES("${id}", "${total_price}", "${paid}", "${delivered_at}", "${buyer_id}")
        `);
    res.status(200).send(`${id} cadastrado com sucesso!`);
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

app.get("/products/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id.length < 1) {
      res.status(404);
      throw new Error(
        "A id do produto deve possuir mais do que um caractere"
      );
    }
    const [product] = await db.raw(`
    SELECT * FROM products
    WHERE id = "${id}";
    `);
    res.status(200).send({ Produto: product });
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});

app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id.length < 1) {
      res.status(404);
      throw new Error(
        "A id do produto deve possuir mais do que um caractere"
      );
    }
    const [purchase] = await db.raw(`
    SELECT * FROM purchases
    WHERE id = "${id}";
    `);
    res.status(200).send({ Compra: purchase });
  } catch (error) {
    console.log(error);
    if (res.statusCode === 200) {
      res.status(500);
    }
    res.send(error.message);
  }
});