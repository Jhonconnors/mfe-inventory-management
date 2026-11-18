import { apiRequest } from "./api";

const request = (path, accessToken, method = "GET", payload) =>
  apiRequest(path, accessToken, {
    method,
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) })
  });

const requestAll = async (path, token) => {
  const items = [];
  const limit = 100;
  for (let offset = 0; ; offset += limit) {
    const separator = path.includes("?") ? "&" : "?";
    const page = await apiRequest(
      `${path}${separator}limit=${limit}&offset=${offset}`,
      token
    );
    items.push(...page);
    if (page.length < limit) return items;
  }
};

export const inventoryApi = {
  assets: (token) => requestAll("/activos", token),
  users: (token, includeInactive = false) =>
    requestAll(
      includeInactive ? "/usuarios?include_inactive=true" : "/usuarios",
      token
    ),
  audit: (token) => requestAll("/auditoria", token),
  branches: (token) => requestAll("/sucursales", token),
  departments: (token) => requestAll("/departamentos", token),
  brands: (token) => requestAll("/marcas", token),
  models: (token) => requestAll("/modelos", token),
  types: (token) => requestAll("/tipos-equipo", token),
  states: (token) => requestAll("/estados-equipo", token),
  roles: (token) => requestAll("/roles", token),
  catalogItems: (token, endpoint) => requestAll(`/${endpoint}`, token),
  createCatalogItem: (token, endpoint, payload) =>
    request(`/${endpoint}`, token, "POST", payload),
  updateCatalogItem: (token, endpoint, id, payload) =>
    request(`/${endpoint}/${id}`, token, "PUT", payload),
  deleteCatalogItem: (token, endpoint, id) =>
    request(`/${endpoint}/${id}`, token, "DELETE"),
  createAsset: (token, payload) => request("/activos", token, "POST", payload),
  createUser: (token, payload) => request("/usuarios", token, "POST", payload),
  createRole: (token, payload) => request("/roles", token, "POST", payload),
  updateUser: (token, id, payload) =>
    request(`/usuarios/${id}`, token, "PUT", payload),
  deleteUser: (token, id) => request(`/usuarios/${id}`, token, "DELETE"),
  updateRole: (token, id, payload) =>
    request(`/roles/${id}`, token, "PUT", payload),
  deleteRole: (token, id) => request(`/roles/${id}`, token, "DELETE"),
  updateAsset: (token, id, payload) =>
    request(`/activos/${id}`, token, "PUT", payload),
  assignAsset: (token, id, payload) =>
    request(`/activos/${id}/asignar`, token, "POST", payload),
  transferAsset: (token, id, payload) =>
    request(`/activos/${id}/trasladar`, token, "POST", payload),
  deactivateAsset: (token, id, payload) =>
    request(`/activos/${id}/baja`, token, "POST", payload),
  assetHistory: (token, id) =>
    request(`/activos/${id}/historial?limit=100`, token)
};

export const loadAssetReferences = async (token, includeUsers = true) => {
  const [types, brands, models, states, branches, departments, users] =
    await Promise.all([
      inventoryApi.types(token),
      inventoryApi.brands(token),
      inventoryApi.models(token),
      inventoryApi.states(token),
      inventoryApi.branches(token),
      inventoryApi.departments(token),
      includeUsers ? inventoryApi.users(token) : Promise.resolve([])
    ]);

  return { types, brands, models, states, branches, departments, users };
};

export const enrichAssets = (assets, references) => {
  const byId = (items, idField, id) =>
    items.find((item) => item[idField] === id);

  return assets.map((asset) => ({
    ...asset,
    typeName: byId(references.types, "id_tipo", asset.id_tipo)?.nombre || `Tipo ${asset.id_tipo}`,
    brandName: byId(references.brands, "id_marca", asset.id_marca)?.nombre || `Marca ${asset.id_marca}`,
    modelName: byId(references.models, "id_modelo", asset.id_modelo)?.nombre || `Modelo ${asset.id_modelo}`,
    stateName: byId(references.states, "id_estado", asset.id_estado)?.nombre || `Estado ${asset.id_estado}`,
    branchName: byId(references.branches, "id_sucursal", asset.id_sucursal)?.nombre || `Sucursal ${asset.id_sucursal}`,
    departmentName: byId(references.departments, "id_departamento", asset.id_departamento)?.nombre || `Departamento ${asset.id_departamento}`,
    custodianName: asset.id_usuario == null
      ? "Sin asignar"
      : byId(references.users, "id_usuario", asset.id_usuario)?.nombre || `Usuario ${asset.id_usuario}`
  }));
};

export const roleName = (roles, id) =>
  roles.find((role) => role.id_rol === id)?.nombre || `Rol ${id}`;

export const userName = (users, id) =>
  users.find((user) => user.id_usuario === id)?.nombre || `Usuario ${id}`;

export const assetLabel = (asset) =>
  `${asset.placa} · ${asset.serie}`;
