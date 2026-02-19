import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#api/users";
import tracksRouter from "#api/tracks";
import playlistsRouter from "#api/playlists";

const app = express();

app.use(express.json());
app.use(getUserFromToken);

app.use("/users", usersRouter);
app.use("/tracks", tracksRouter);
app.use("/playlists", playlistsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status ?? 500).send(err.message ?? "Something went wrong on Spider-Man's jukebox! 🕷️");
});

export default app;