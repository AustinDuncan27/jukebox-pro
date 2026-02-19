import db from "#db/client";
import bcrypt from "bcrypt";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const hashedPassword1 = await bcrypt.hash("peterparker123", 10);
  const hashedPassword2 = await bcrypt.hash("milesmorales123", 10);

  const usersResult = await db.query(`
    INSERT INTO users (username, password) VALUES
      ('peter_parker', $1),
      ('miles_morales', $2)
    RETURNING *
  `, [hashedPassword1, hashedPassword2]);

  const userIds = usersResult.rows.map(user => user.id);

  const tracksResult = await db.query(`
    INSERT INTO tracks (name, duration_ms) VALUES
      ('Miles Morales Theme', 240000),
      ('Into The Spider-Verse', 195000),
      ('Sunflower', 158000),
      ('Elevate', 212000),
      ('Scared of the Dark', 187000),
      ('What Up Danger', 203000),
      ('Familia', 178000),
      ('Unforgettable', 234000),
      ('Memories', 196000),
      ('Empire State of Mind', 276000),
      ('Spider-Man Theme (Classic)', 167000),
      ('Web Slinger Beats', 221000),
      ('Queens Bridge Anthem', 198000),
      ('Daily Bugle Blues', 189000),
      ('Peter Parker Playlist', 201000),
      ('Gwen Stacy Groove', 213000),
      ('Noir City Nights', 245000),
      ('Peni Parker Pop', 176000),
      ('Spider-Ham Shuffle', 163000),
      ('Across The Spider-Verse', 228000)
    RETURNING *
  `);

  const trackIds = tracksResult.rows.map(track => track.id);

  const playlistsResult = await db.query(`
    INSERT INTO playlists (name, description, owner_id) VALUES
      ('Web Slinging Bangers', 'Hype songs for swinging through NYC', ${userIds[0]}),
      ('Chill on the Rooftop', 'Relaxing beats after a long patrol', ${userIds[0]}),
      ('Villain Battle Mix', 'Intense tracks for fighting Sinister Six', ${userIds[0]}),
      ('Peter Parker Study', 'Focus music for homework at Midtown High', ${userIds[0]}),
      ('Aunt May Approved', 'Songs even Aunt May would enjoy', ${userIds[0]}),
      ('Miles Morales Vibes', 'Brooklyn beats for the new Spider-Man', ${userIds[1]}),
      ('Spider-Verse Soundtrack', 'Best songs from across the multiverse', ${userIds[1]}),
      ('Daily Bugle Workout', 'Pump up songs for training', ${userIds[1]}),
      ('Gwen Stacy Favorites', 'Ghost-Spider approved playlist', ${userIds[1]}),
      ('Late Night NYC', 'Midnight patrol soundtrack', ${userIds[1]})
    RETURNING *
  `);

  const playlistIds = playlistsResult.rows.map(playlist => playlist.id);
  await db.query(`
    INSERT INTO playlists_tracks (playlist_id, track_id) VALUES
      (${playlistIds[0]}, ${trackIds[0]}),
      (${playlistIds[0]}, ${trackIds[3]}),
      (${playlistIds[0]}, ${trackIds[5]}),
      (${playlistIds[1]}, ${trackIds[2]}),
      (${playlistIds[1]}, ${trackIds[8]}),
      (${playlistIds[2]}, ${trackIds[4]}),
      (${playlistIds[2]}, ${trackIds[6]}),
      (${playlistIds[3]}, ${trackIds[14]}),
      (${playlistIds[3]}, ${trackIds[9]}),
      (${playlistIds[4]}, ${trackIds[1]}),
      (${playlistIds[4]}, ${trackIds[7]}),
      (${playlistIds[5]}, ${trackIds[11]}),
      (${playlistIds[6]}, ${trackIds[12]}),
      (${playlistIds[7]}, ${trackIds[13]}),
      (${playlistIds[8]}, ${trackIds[15]})
  `);
}