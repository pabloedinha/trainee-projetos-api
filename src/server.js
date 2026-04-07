const app = require("./app");

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`API trainee de projetos rodando na porta ${port}`);
});
