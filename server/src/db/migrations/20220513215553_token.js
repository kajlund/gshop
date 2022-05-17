/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('tokens', function (table) {
    table.uuid('id').primary()
    table.string('user_id', 50)
    table.string('token', 50)
    table.timestamp('expired_at')
    table.timestamps(false, true, false)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('tokens')
}
