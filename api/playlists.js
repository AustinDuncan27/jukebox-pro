import express from "express";
const router = express.Router();

import { getPlaylists, getPlaylistById, createPlaylist, getPlaylistTracks } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlist_tracks";
import requireUser from "#middleware/requireUser";

router.use(requireUser);

router.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylists(req.user.id);
    res.send(playlists);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).send("Request body is required!");
    }
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).send("Missing fields: need both name and description!");
    }
    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const playlist = await getPlaylistById(req.params.id);

    if (!playlist) {
      return res.status(404).send("Playlist not found! 🕷️");
    }
    if (playlist.owner_id !== req.user.id) {
      return res.status(403).send("You do not own this playlist! 🕷️");
    }
    res.send(playlist);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/tracks", async (req, res, next) => {
  try {
    const playlist = await getPlaylistById(req.params.id);
    if (!playlist) {
      return res.status(404).send("Playlist not found! 🕷️");
    }
    if (playlist.owner_id !== req.user.id) {
      return res.status(403).send("You do not own this playlist! 🕷️");
    }
    const tracks = await getPlaylistTracks(req.params.id);
    res.send(tracks);
  } catch (err) {
    next(err);
  }
});

export default router;