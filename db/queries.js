import db from "#db/client";

export async function getTracks() {
  const result = await db.query(`
    SELECT * FROM tracks
  `);
  return result.rows;
}

export async function getTrackById(id) {
  const result = await db.query(`
    SELECT * FROM tracks
    WHERE id = $1
  `, [id]);
  return result.rows[0];
}

export async function getPlaylists() {
  const result = await db.query(`
    SELECT * FROM playlists
  `);
  return result.rows;
}

export async function getPlaylistById(id) {
  const result = await db.query(`
    SELECT * FROM playlists
    WHERE id = $1
  `, [id]);
  return result.rows[0];
}

export async function createPlaylist(name, description) {
  const result = await db.query(`
    INSERT INTO playlists (name, description)
    VALUES ($1, $2)
    RETURNING *
  `, [name, description]);
  return result.rows[0];
}

export async function getPlaylistTracks(playlistId) {
  const result = await db.query(`
    SELECT tracks.*
    FROM tracks
    JOIN playlists_tracks ON tracks.id = playlists_tracks.track_id
    WHERE playlists_tracks.playlist_id = $1
  `, [playlistId]);
  return result.rows;
}

export async function addTrackToPlaylist(playlistId, trackId) {
  const result = await db.query(`
    INSERT INTO playlists_tracks (playlist_id, track_id)
    VALUES ($1, $2)
    RETURNING *
  `, [playlistId, trackId]);
  return result.rows[0];
}