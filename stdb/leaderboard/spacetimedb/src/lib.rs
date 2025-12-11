use spacetimedb::{ReducerContext, Table};

#[spacetimedb::table(name = score, public)]
pub struct Score {
    pub player_name: String,
    pub score_value: i32,
    pub rounds: i32,
    pub average_distance: i32,
    pub ts_ms: u64,
}

#[spacetimedb::reducer(init)]
pub fn init(_ctx: &ReducerContext) {
    // Called when the module is initially published
}

#[spacetimedb::reducer(client_connected)]
pub fn identity_connected(_ctx: &ReducerContext) {
    // Called everytime a new client connects
}

#[spacetimedb::reducer(client_disconnected)]
pub fn identity_disconnected(_ctx: &ReducerContext) {
    // Called everytime a client disconnects
}

#[spacetimedb::reducer]
pub fn submit_score(ctx: &ReducerContext, player_name: String, score_value: i32, rounds: i32, average_distance: i32) {
    let row = Score { player_name, score_value, rounds, average_distance, ts_ms: 0 };
    ctx.db.score().insert(row);
}
