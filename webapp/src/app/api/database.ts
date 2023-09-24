import Knex from "knex";

export interface Safe {
  address: string;
}

export interface Owner {
  address: string;
  safe: string;
}

export interface Signature {
  safe: string;
  signature: string;
  key?: number;
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

export const getSignatures = async (): Promise<Signature[]> => {
  return await knex("signatures");
};

export const getSignaturesBySafe = async (
  safe: string
): Promise<Signature[]> => {
  return await knex("signatures").where({ safe });
};

export const addSignature = async (signature: Signature) => {
  return await knex("signatures").insert(signature).returning("*");
};

export const deleteSignature = async (signature: Signature) => {
  return await knex("signatures")
    .where({ signature: signature.signature })
    .del()
    .returning("*");
};
