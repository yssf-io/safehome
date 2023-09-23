import Knex from "knex";

export interface Safe {
  address: string;
}

export interface Owner {
  address: string;
  safe: string;
}

export const knex = Knex({
  client: "pg",
  connection: process.env.CONNECTION_STRING,
});

export const getOwners = async (): Promise<Owner[]> => {
  return await knex("owners");
};

export const getOwnersBySafe = async (safe: string): Promise<Owner[]> => {
  return await knex("owners").where({ safe });
};

export const getOwnersById = async (address: string): Promise<Owner[]> => {
  return await knex("owners").where({ address });
};

export const getSafes = async (): Promise<Safe[]> => {
  return await knex("safes");
};

export const addOwner = async (owner: Owner) => {
  return await knex("owners").insert(owner).returning("*");
};

export const addSafe = async (safe: Safe) => {
  return await knex("safes").insert(safe).returning("*");
};
