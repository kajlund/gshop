/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table.uuid('id').primary()
    table.string('name', 255).notNullable()
    table.string('email', 128).unique().notNullable()
    table.string('password', 256).notNullable()
    table.boolean('isAdmin').defaultTo(false)
    table.string('reset_token', 255).notNullable().defaultTo('')
    table.timestamp('reset_expires').defaultTo(knex.fn.now())
    table.timestamps(false, true, false)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
