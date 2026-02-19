import db from "#db/client";

export async function createPlaylist(name, description, ownerId) {
  const sql = `
    INSERT INTO playlists (name, description, owner_id)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const { rows: [playlist] } = await db.query(sql, [name, description, ownerId]);
  return playlist;
}

export async function getPlaylists(ownerId) {
  const sql = `
    SELECT * FROM playlists
    WHERE owner_id = $1
  `;
  const { rows: playlists } = await db.query(sql, [ownerId]);
  return playlists;
}

export async function getPlaylistById(id) {
  const sql = `
    SELECT * FROM playlists
    WHERE id = $1
  `;
  const { rows: [playlist] } = await db.query(sql, [id]);
  return playlist;
}

export async function getPlaylistTracks(playlistId) {
  const sql = `
    SELECT tracks.*
    FROM tracks
    JOIN playlists_tracks ON tracks.id = playlists_tracks.track_id
    WHERE playlists_tracks.playlist_id = $1
  `;
  const { rows: tracks } = await db.query(sql, [playlistId]);
  return tracks;
}

export async function getPlaylistsByTrackId(trackId, ownerId) {
  const sql = `
    SELECT playlists.*
    FROM playlists
    JOIN playlists_tracks ON playlists.id = playlists_tracks.playlist_id
    WHERE playlists_tracks.track_id = $1
    AND playlists.owner_id = $2
  `;
  const { rows: playlists } = await db.query(sql, [trackId, ownerId]);
  return playlists;
}