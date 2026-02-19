import express from "express";
const router = express.Router();

import { getTracks, getTrackById } from "#db/queries/tracks";
import { getPlaylists, getPlaylistsByTrackId } from "#db/queries/playlists";
import requireUser from "#middleware/requireUser";

router.get("/", async (req, res, next) => {
  try {
    const tracks = await getTracks();
    res.send(tracks);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const track = await getTrackById(req.params.id);
    if (!track) {
      return res.status(404).send("Track not found! 🕷️");
    }
    res.send(track);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/playlists", requireUser, async (req, res, next) => {
  try {
    const track = await getTrackById(req.params.id);
    if (!track) {
      return res.status(404).send("Track not found! 🕷️");
    }
    const playlists = await getPlaylistsByTrackId(req.params.id, req.user.id);
    res.send(playlists);
  } catch (err) {
    next(err);
  }
});

export default router;

