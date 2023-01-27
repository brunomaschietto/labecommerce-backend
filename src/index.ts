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
    const result = await db("users");
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
    const result = await db("products");
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

app.get("/purchases", async (req: Request, res: Response) => {
  try {
    const result = await db("purchases");
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

    if (id !== undefined) {
      if (id.length < 1) {
        res.status(400);
        throw new Error("Id invalido, deve conter mais de 2 caracteres");
      }
    }
    if (email !== undefined) {
      if (!email.includes("@")) {
        res.status(400);
        throw new Error("Email invalido, digite um email corretamente");
      }
    }
    const newUser = {
      id: id,
      email: email,
      password: password,
    };
    await db("users").insert(newUser);
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
    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;

    if (typeof id !== "string") {
      res.status(200);
      throw new Error("Id inválido, precisa ser um texto");
    }
    if (typeof name !== "string") {
      res.status(200);
      throw new Error("Nome inválido, precisa ser um texto");
    }
    if (name.length < 1 || id.length < 1) {
      res.status(400);
      throw new Error(
        "O nome e o do produto deve possuir mais do que um caractere"
      );
    }

    const newProduct = {
      id,
      name,
      price,
      description,
      imageUrl,
    };
    await db("products").insert(newProduct);
    res.status(200).send(`${id} criado com sucesso!`);
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
    const { id, buyer_id, totalPrice, paid } = req.body;

    if (id !== undefined) {
      if (typeof id !== "string") {
        res.status(400);
        throw new Error("Id invalido, precisa ser uma string");
      }
    }

    if (buyer_id !== undefined) {
      if (typeof buyer_id !== "string") {
        res.status(400);
        throw new Error("Buyer inválido");
      }
    }

    const newPurchase = {
      id,
      buyer_id,
      totalPrice,
      paid,
    };

    await db("purchases").insert(newPurchase);
    res.status(200).send(`Compra cadastrada com sucesso!`);
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
      throw new Error("A id do produto deve possuir mais do que um caractere");
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

// app.get("/purchases/:id", async (req: Request, res: Response) => {
//   try {
//     const id = req.params.id;
//     if (id.length < 1) {
//       res.status(404);
//       throw new Error("A id do produto deve possuir mais do que um caractere");
//     }
//     const [purchase] = await db.raw(`
//     SELECT * FROM purchases
//     WHERE id = "${id}";
//     `);
//     res.status(200).send({ Compra: purchase });
//   } catch (error) {
//     console.log(error);
//     if (res.statusCode === 200) {
//       res.status(500);
//     }
//     res.send(error.message);
//   }
// });

app.get("/purchases/:id", async (req: Request, res: Response) => {
  try {
    const purchaseId = req.params.id;
    const produtosComprados = await db
      .select("purchases_products.product_id", "products.*")
      .from("purchases_products")
      .leftJoin("products", "purchases_products.product_id", "products.id")
      .where({ purchase_id: purchaseId });

    const result = await db
      .select("purchases.*", "users.email", "users.id")
      .from("purchases")
      .leftJoin("users", "purchases.buyer_id", "users.id")
      .where({ "purchases.id": purchaseId });
    res.status(200).send({ compra: result, produtos: produtosComprados });
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

app.delete("/products/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;
    const [product] = await db("products").where({ id: idToDelete });

    if (!product) {
      res.status(400);
      throw new Error("Id não encontrada");
    }

    await db("products").del().where({ id: idToDelete });
    res.status(200).send({ message: "Tarefa deletada com sucesso!" });
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

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const idToDelete = req.params.id;
    const [user] = await db("users").where({ id: idToDelete });

    if (!user) {
      res.status(400);
      throw new Error("Id não encontrada");
    }

    await db("users").del().where({ id: idToDelete });
    res.status(200).send({ message: "Tarefa deletada com sucesso!" });
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

app.put("/products/:id", async (req: Request, res: Response) => {
  try {
    const idToUpdate = req.params.id;

    const newId = req.body.id;
    const newName = req.body.name;
    const newPrice = req.body.price;
    const newDescription = req.body.description;
    const newImageUrl = req.body.imageUrl;

    if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }

      if (newId.length < 1) {
        res.status(400);
        throw new Error("'id' deve possuir no mínimo 1 caractere");
      }
    }

    if (newName !== undefined) {
      if (typeof newName !== "string") {
        res.status(400);
        throw new Error("'name' deve ser string");
      }

      if (newName.length < 1) {
        res.status(400);
        throw new Error("'name' deve possuir no mínimo 1 caractere");
      }
    }

    if (newDescription !== undefined) {
      if (typeof newDescription !== "string") {
        res.status(400);
        throw new Error("'description' deve ser string");
      }

      if (newDescription.length < 1) {
        res.status(400);
        throw new Error("'description' deve possuir no mínimo 1 caractere");
      }
    }

    if (newPrice !== undefined) {
      if (typeof newPrice !== "number") {
        res.status(400);
        throw new Error("'Preço atualizado' deve ser number");
      }
    }

    const [product] = await db("products").where({ id: idToUpdate });
    if (product) {
      const updateProduct = {
        id: newId || product.id,
        name: newName || product.name,
        price: newPrice || product.price,
        description: newDescription || product.description,
        imageUrl: newImageUrl || product.imageUrl,
      };
      await db("products").update(updateProduct).where({ id: idToUpdate });
    }
    res.status(200).send({ message: "Tarefa editada com sucesso!" });
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

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    const idToUpdate = req.params.id;

    const newId = req.body.id;
    const newEmail = req.body.email;
    const newPassword = req.body.password;

    if (newId !== undefined) {
      if (typeof newId !== "string") {
        res.status(400);
        throw new Error("'id' deve ser string");
      }

      if (newId.length < 1) {
        res.status(400);
        throw new Error("'id' deve possuir no mínimo 1 caractere");
      }
    }

    if (newEmail !== undefined) {
      if (typeof newEmail !== "string") {
        res.status(400);
        throw new Error("'name' deve ser string");
      }

      if (newEmail.length < 1) {
        res.status(400);
        throw new Error("'name' deve possuir no mínimo 1 caractere");
      }
    }

    if (newPassword !== undefined) {
      if (typeof newPassword !== "string") {
        res.status(400);
        throw new Error("'Password' deve ser string");
      }

      if (newPassword.length < 1) {
        res.status(400);
        throw new Error("'Password' deve possuir no mínimo 1 caractere");
      }
    }


    const [user] = await db("users").where({ id: idToUpdate });
    if (user) {
      const updateUser = {
        id: newId || user.id,
        name: newEmail || user.name,
        price: newPassword || user.price
      };
      await db("users").update(updateUser).where({ id: idToUpdate });
    }
    res.status(200).send({ message: "User editado com sucesso!" });
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
