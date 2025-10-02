const os = require("os")
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

const html = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");

app.get("/", (req, res) => {
    res.set("Content-Type", "text/html; charset=utf-8"); // fuerza MIME correcto
    res.removeHeader?.("Content-Disposition");
    res.sendFile(path.resolve(process.cwd(), "index.html"));
});

const getLocalIPv4s = () => {
  const nets = os.networkInterfaces();
  const addrs = [];
  for (const name of Object.keys(nets))
  {
    for (const net of nets[name] || [])
    {
      // IPv4 no interna (descarta 127.0.0.1)
      if ((net.family === "IPv4" || net.family === 4) && !net.internal)
      {
        addrs.push({ name, address: net.address });
      }
    }
  }
  return addrs;
}

app.listen(3000, "0.0.0.0", () =>
{
  console.log(`Servidor escuchando en todas las interfaces (0.0.0.0:${3000})`);
  const ips = getLocalIPv4s();
  if (ips.length === 0)
  {
    console.log(`Visita: http://localhost:${3000}`);
  }
  else
  {
    console.log("Abre desde otro dispositivo en la misma red:");
    ips.forEach(({ name, address }) =>
      console.log(`  → http://${address}:${3000}  (${name})`)
    );
  }
});