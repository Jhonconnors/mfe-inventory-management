import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Add,
  Computer,
  Delete,
  DevicesOther,
  Edit,
  History,
  Laptop,
  Print,
  Search,
  SwapHoriz
} from "@mui/icons-material";

import {
  assetLabel,
  enrichAssets,
  inventoryApi,
  loadAssetReferences,
  roleName,
  userName
} from "../../services/inventory";
import "./DashboardContent.css";

const getErrorMessage = (error) =>
  error instanceof Error ? error.message : "Ocurrió un error inesperado.";

const useData = (load) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    load()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((reason) => {
        if (active) setError(getErrorMessage(reason));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [load, reloadKey]);

  return { data, error, loading, reload: () => setReloadKey((key) => key + 1) };
};

const LoadingState = () => <div className="module-message">Cargando información...</div>;
const ErrorState = ({ message, onRetry }) => (
  <div className="module-message module-error" role="alert">
    <span>{message}</span>
    {onRetry && <button className="secondary-action" onClick={onRetry}>Reintentar</button>}
  </div>
);
const EmptyState = ({ children }) => (
  <div className="module-message">{children}</div>
);

const StatusBadge = ({ name }) => (
  <span className={`status-badge ${name?.toLowerCase().includes("asign") ? "assigned" : "available"}`}>
    {name}
  </span>
);

const AssetForm = ({ asset, references, onClose, onSave }) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    placa: asset?.placa || "",
    serie: asset?.serie || "",
    mac: asset?.mac || "",
    posicion_monitor: asset?.posicion_monitor || "",
    id_tipo: asset?.id_tipo || "",
    id_marca: asset?.id_marca || "",
    id_modelo: asset?.id_modelo || "",
    id_estado: asset?.id_estado || "",
    id_sucursal: asset?.id_sucursal || "",
    id_departamento: asset?.id_departamento || "",
    id_usuario: asset?.id_usuario || ""
  }));
  const availableModels = references.models.filter(
    (model) => !form.id_marca || model.id_marca === Number(form.id_marca)
  );

  const setField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "id_marca" ? { id_modelo: "" } : {})
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      placa: form.placa.trim(),
      serie: form.serie.trim(),
      mac: form.mac.trim() || null,
      posicion_monitor: form.posicion_monitor.trim() || null,
      id_tipo: Number(form.id_tipo),
      id_marca: Number(form.id_marca),
      id_modelo: Number(form.id_modelo),
      id_estado: Number(form.id_estado),
      id_sucursal: Number(form.id_sucursal),
      id_departamento: Number(form.id_departamento),
      id_usuario: form.id_usuario ? Number(form.id_usuario) : null
    };

    try {
      await onSave(payload);
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-overlay" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <form className="module-dialog" onSubmit={submit} aria-labelledby="asset-form-title">
        <div className="dialog-heading">
          <h3 id="asset-form-title">{asset ? "Editar activo" : "Registrar activo"}</h3>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <div className="form-grid">
          <label>N.º de placa<input name="placa" value={form.placa} onChange={setField} required pattern="[A-Za-z0-9][A-Za-z0-9._/-]*" /></label>
          <label>N.º de serie<input name="serie" value={form.serie} onChange={setField} required pattern="[A-Za-z0-9][A-Za-z0-9._/-]*" /></label>
          <label>Tipo de equipo<select name="id_tipo" value={form.id_tipo} onChange={setField} required><option value="">Selecciona un tipo</option>{references.types.map((item) => <option key={item.id_tipo} value={item.id_tipo}>{item.nombre}</option>)}</select></label>
          <label>Marca<select name="id_marca" value={form.id_marca} onChange={setField} required><option value="">Selecciona una marca</option>{references.brands.map((item) => <option key={item.id_marca} value={item.id_marca}>{item.nombre}</option>)}</select></label>
          <label>Modelo<select name="id_modelo" value={form.id_modelo} onChange={setField} required disabled={!form.id_marca}><option value="">Selecciona un modelo</option>{availableModels.map((item) => <option key={item.id_modelo} value={item.id_modelo}>{item.nombre}</option>)}</select></label>
          <label>Estado<select name="id_estado" value={form.id_estado} onChange={setField} required><option value="">Selecciona un estado</option>{references.states.map((item) => <option key={item.id_estado} value={item.id_estado}>{item.nombre}</option>)}</select></label>
          <label>Sucursal<select name="id_sucursal" value={form.id_sucursal} onChange={setField} required><option value="">Selecciona una sucursal</option>{references.branches.map((item) => <option key={item.id_sucursal} value={item.id_sucursal}>{item.nombre}</option>)}</select></label>
          <label>Departamento<select name="id_departamento" value={form.id_departamento} onChange={setField} required><option value="">Selecciona un departamento</option>{references.departments.map((item) => <option key={item.id_departamento} value={item.id_departamento}>{item.nombre}</option>)}</select></label>
          <label>Custodio<select name="id_usuario" value={form.id_usuario} onChange={setField}><option value="">Sin asignar</option>{references.users.map((item) => <option key={item.id_usuario} value={item.id_usuario}>{item.nombre}</option>)}</select></label>
          <label>Dirección MAC<input name="mac" value={form.mac} onChange={setField} placeholder="AA:BB:CC:DD:EE:FF" /></label>
          <label>Posición del monitor<input name="posicion_monitor" value={form.posicion_monitor} onChange={setField} /></label>
        </div>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="dialog-actions">
          <button type="button" className="secondary-action" onClick={onClose}>Cancelar</button>
          <button type="submit" className="primary-action" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </div>
  );
};

const DeactivateForm = ({ asset, onClose, onSave }) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setSaving(true);
    setError("");
    try {
      await onSave({
        resolucion: values.get("resolucion"),
        fecha: new Date(values.get("fecha")).toISOString(),
        motivo: values.get("motivo")
      });
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-overlay">
      <form className="module-dialog compact-dialog" onSubmit={submit}>
        <div className="dialog-heading"><h3>Dar de baja {asset.placa}</h3><button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar">×</button></div>
        <label>Resolución<input name="resolucion" maxLength="200" required /></label>
        <label>Fecha<input name="fecha" type="datetime-local" required defaultValue={new Date().toISOString().slice(0, 16)} /></label>
        <label>Motivo<textarea name="motivo" maxLength="2000" rows="3" required /></label>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="dialog-actions">
          <button type="button" className="secondary-action" onClick={onClose}>Cancelar</button>
          <button type="submit" className="primary-action" disabled={saving}>{saving ? "Procesando..." : "Confirmar baja"}</button>
        </div>
      </form>
    </div>
  );
};

const AssetHistory = ({ token, asset, references, onClose }) => {
  const load = useCallback(
    () => inventoryApi.assetHistory(token, asset.id_activo),
    [token, asset.id_activo]
  );
  const result = useData(load);
  return (
    <div className="module-overlay">
      <div className="module-dialog">
        <div className="dialog-heading"><h3>Historial · {asset.placa}</h3><button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar">×</button></div>
        {result.loading ? <LoadingState /> : result.error ? <ErrorState message={result.error} onRetry={result.reload} /> : result.data.length === 0 ? <EmptyState>Este activo aún no tiene eventos de auditoría.</EmptyState> : (
          <div className="table-container"><table className="assets-table"><thead><tr><th>USUARIO</th><th>ACCIÓN</th><th>DETALLE</th><th>FECHA Y HORA</th></tr></thead><tbody>{result.data.map((event) => <tr key={event.id_evento}><td>{userName(references.users, event.id_usuario)}</td><td>{event.accion}</td><td>{event.detalle}</td><td>{new Date(event.fecha_hora).toLocaleString()}</td></tr>)}</tbody></table></div>
        )}
      </div>
    </div>
  );
};

const AssetInventoryModule = ({ token, user }) => {
  const canManageAssets = ["ADMINISTRADOR", "ENCARGADO_INVENTARIO"].includes(user.role);
  const load = useCallback(async () => {
    const [assets, references] = await Promise.all([
      inventoryApi.assets(token),
      loadAssetReferences(token, canManageAssets)
    ]);
    return { assets: enrichAssets(assets, references), references };
  }, [token, canManageAssets]);
  const result = useData(load);
  const [search, setSearch] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [editing, setEditing] = useState(undefined);
  const [deactivating, setDeactivating] = useState(null);
  const [historyAsset, setHistoryAsset] = useState(null);
  const assets = result.data?.assets || [];
  const filtered = assets.filter((asset) => {
    const text = `${asset.placa} ${asset.serie} ${asset.brandName} ${asset.modelName} ${asset.custodianName}`.toLowerCase();
    return text.includes(search.toLowerCase()) &&
      (!selectedState || String(asset.id_estado) === selectedState);
  });

  const saveAsset = async (payload) => {
    if (editing) await inventoryApi.updateAsset(token, editing.id_activo, payload);
    else await inventoryApi.createAsset(token, payload);
    setEditing(undefined);
    result.reload();
  };

  const deactivate = async (payload) => {
    await inventoryApi.deactivateAsset(token, deactivating.id_activo, payload);
    setDeactivating(null);
    result.reload();
  };

  return (
    <>
      <div className="content-toolbar">
        <div><h3>Inventario de equipos</h3><p>Consulta, registra y administra los activos tecnológicos.</p></div>
        {canManageAssets && <button className="primary-action" onClick={() => setEditing(null)}><Add /> Nuevo activo</button>}
      </div>
      <div className="filter-bar">
        <div className="search-box"><Search /><input placeholder="Buscar por placa, serie, marca o custodio..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
        <select value={selectedState} onChange={(event) => setSelectedState(event.target.value)}><option value="">Todos los estados</option>{result.data?.references.states.map((state) => <option key={state.id_estado} value={state.id_estado}>{state.nombre}</option>)}</select>
      </div>
      {result.loading ? <LoadingState /> : result.error ? <ErrorState message={result.error} onRetry={result.reload} /> : filtered.length === 0 ? <EmptyState>No hay activos que coincidan con la búsqueda.</EmptyState> : (
        <div className="table-container"><table className="assets-table"><thead><tr><th>PLACA / SERIE</th><th>EQUIPO</th><th>CUSTODIO</th><th>UBICACIÓN</th><th>ESTADO</th><th>ACCIONES</th></tr></thead><tbody>
          {filtered.map((asset) => <tr key={asset.id_activo}>
            <td><strong>{asset.placa}</strong><span className="serial-cell">{asset.serie}</span></td>
            <td><strong>{asset.typeName}</strong><small>{asset.brandName} / {asset.modelName}</small></td>
            <td>{asset.custodianName}</td>
            <td>{asset.branchName}<small>{asset.departmentName}</small></td>
            <td><StatusBadge name={asset.stateName} /></td>
            <td><div className="table-actions">
              <button title="Ver historial" aria-label="Ver historial" onClick={() => setHistoryAsset(asset)}><History /></button>
              {canManageAssets && <button title="Editar" aria-label="Editar" onClick={() => setEditing(asset)}><Edit /></button>}
              {canManageAssets && asset.stateName.toLowerCase() !== "baja" && <button title="Dar de baja" aria-label="Dar de baja" className="danger-action" onClick={() => setDeactivating(asset)}>×</button>}
            </div></td>
          </tr>)}
        </tbody></table></div>
      )}
      {editing !== undefined && result.data && <AssetForm asset={editing} references={result.data.references} onClose={() => setEditing(undefined)} onSave={saveAsset} />}
      {deactivating && <DeactivateForm asset={deactivating} onClose={() => setDeactivating(null)} onSave={deactivate} />}
      {historyAsset && result.data && <AssetHistory token={token} asset={historyAsset} references={result.data.references} onClose={() => setHistoryAsset(null)} />}
    </>
  );
};

const assetCatalogs = [
  { key: "marcas", endpoint: "marcas", idField: "id_marca", title: "Marcas", singular: "marca" },
  { key: "modelos", endpoint: "modelos", idField: "id_modelo", title: "Modelos", singular: "modelo", requiresBrand: true },
  { key: "tipos", endpoint: "tipos-equipo", idField: "id_tipo", title: "Tipos de equipo", singular: "tipo de equipo" }
];

const locationCatalogs = [
  { key: "sucursales", endpoint: "sucursales", idField: "id_sucursal", title: "Sucursales", singular: "sucursal" },
  { key: "departamentos", endpoint: "departamentos", idField: "id_departamento", title: "Departamentos", singular: "departamento" }
];

const CatalogForm = ({ definition, item, brands, onClose, onSave }) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setError("");
    setSaving(true);
    const payload = { nombre: values.get("nombre").trim() };
    if (definition.requiresBrand) payload.id_marca = Number(values.get("id_marca"));

    try {
      await onSave(payload);
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-overlay">
      <form className="module-dialog compact-dialog" onSubmit={submit}>
        <div className="dialog-heading">
          <h3>{item ? `Editar ${definition.singular}` : `Crear ${definition.singular}`}</h3>
          <button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar">×</button>
        </div>
        <label>Nombre<input name="nombre" maxLength="100" defaultValue={item?.nombre || ""} required autoFocus /></label>
        {definition.requiresBrand && <label>Marca<select name="id_marca" defaultValue={item?.id_marca || ""} required><option value="" disabled>Selecciona una marca</option>{brands.map((brand) => <option key={brand.id_marca} value={brand.id_marca}>{brand.nombre}</option>)}</select></label>}
        {definition.requiresBrand && brands.length === 0 && <div className="form-error">Primero crea una marca para poder agregar modelos.</div>}
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="dialog-actions">
          <button type="button" className="secondary-action" onClick={onClose}>Cancelar</button>
          <button type="submit" className="primary-action" disabled={saving || (definition.requiresBrand && brands.length === 0)}>{saving ? "Guardando..." : item ? "Guardar cambios" : "Crear"}</button>
        </div>
      </form>
    </div>
  );
};

const CatalogManager = ({ token, user, title, description, definitions }) => {
  const canWrite = ["ADMINISTRADOR", "ENCARGADO_INVENTARIO"].includes(user.role);
  const load = useCallback(async () => {
    const entries = await Promise.all(
      definitions.map(async (definition) => [
        definition.key,
        await inventoryApi.catalogItems(token, definition.endpoint)
      ])
    );
    return Object.fromEntries(entries);
  }, [definitions, token]);
  const result = useData(load);
  const [dialog, setDialog] = useState(null);
  const brands = result.data?.marcas || [];

  const save = async (payload) => {
    if (dialog.item) {
      await inventoryApi.updateCatalogItem(
        token,
        dialog.definition.endpoint,
        dialog.item[dialog.definition.idField],
        payload
      );
    } else {
      await inventoryApi.createCatalogItem(token, dialog.definition.endpoint, payload);
    }
    setDialog(null);
    result.reload();
  };

  const remove = async () => {
    await inventoryApi.deleteCatalogItem(
      token,
      dialog.definition.endpoint,
      dialog.item[dialog.definition.idField]
    );
    setDialog(null);
    result.reload();
  };

  return (
    <>
      <div className="content-toolbar">
        <div><h3>{title}</h3><p>{description}</p></div>
      </div>
      {result.loading ? <LoadingState /> : result.error ? <ErrorState message={result.error} onRetry={result.reload} /> : (
        <div className="catalog-grid">
          {definitions.map((definition) => {
            const items = result.data[definition.key] || [];
            return (
              <section className="catalog-section" key={definition.key}>
                <div className="catalog-heading">
                  <div><h3>{definition.title}</h3><span>{items.length} registros</span></div>
                  {canWrite && <button className="primary-action" onClick={() => setDialog({ definition })}><Add /> Crear</button>}
                </div>
                {items.length === 0 ? <EmptyState>No hay {definition.title.toLowerCase()} registrados.</EmptyState> : (
                  <div className="table-container">
                    <table className="assets-table catalog-table">
                      <thead><tr><th>NOMBRE</th>{definition.requiresBrand && <th>MARCA</th>}{canWrite && <th>ACCIONES</th>}</tr></thead>
                      <tbody>
                        {items.map((item) => {
                          const brand = definition.requiresBrand
                            ? brands.find((entry) => entry.id_marca === item.id_marca)
                            : null;
                          return (
                            <tr key={item[definition.idField]}>
                              <td><strong>{item.nombre}</strong></td>
                              {definition.requiresBrand && <td>{brand?.nombre || `Marca ${item.id_marca}`}</td>}
                              {canWrite && <td><div className="table-actions">
                                <button title={`Editar ${definition.singular}`} aria-label={`Editar ${definition.singular}`} onClick={() => setDialog({ definition, item })}><Edit /></button>
                                <button title={`Eliminar ${definition.singular}`} aria-label={`Eliminar ${definition.singular}`} onClick={() => setDialog({ type: "delete", definition, item })}><Delete /></button>
                              </div></td>}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
      {dialog?.definition && dialog.type !== "delete" && <CatalogForm definition={dialog.definition} item={dialog.item} brands={brands} onClose={() => setDialog(null)} onSave={save} />}
      {dialog?.type === "delete" && <ConfirmDelete title={`Eliminar ${dialog.definition.singular}`} description={`Se eliminará ${dialog.item.nombre}. Si está referenciado por otros registros, el backend rechazará la operación y mostrará el motivo.`} onClose={() => setDialog(null)} onConfirm={remove} />}
    </>
  );
};

const AssetsModule = ({ token, user }) => {
  const [section, setSection] = useState("inventario");

  return (
    <>
      <div className="module-tabs" role="tablist" aria-label="Secciones de activos tecnológicos">
        <button type="button" role="tab" aria-selected={section === "inventario"} className={section === "inventario" ? "active" : ""} onClick={() => setSection("inventario")}>Inventario</button>
        <button type="button" role="tab" aria-selected={section === "catalogos"} className={section === "catalogos" ? "active" : ""} onClick={() => setSection("catalogos")}>Catálogos</button>
      </div>
      {section === "inventario"
        ? <AssetInventoryModule token={token} user={user} />
        : <CatalogManager token={token} user={user} title="Catálogos de activos" description="Administra las marcas, modelos y tipos de equipo." definitions={assetCatalogs} />}
    </>
  );
};

const LocationsModule = ({ token, user }) => (
  <CatalogManager
    token={token}
    user={user}
    title="Ubicaciones"
    description="Administra las sucursales y departamentos disponibles para los activos."
    definitions={locationCatalogs}
  />
);

const MovementModule = ({ token, activeModule, user }) => {
  const canWrite = ["ADMINISTRADOR", "ENCARGADO_INVENTARIO"].includes(user.role);
  const load = useCallback(async () => {
    const [assets, references] = await Promise.all([
      inventoryApi.assets(token),
      loadAssetReferences(token, canWrite)
    ]);
    return { assets: enrichAssets(assets, references), references };
  }, [token, canWrite]);
  const result = useData(load);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState(null);
  const [selected, setSelected] = useState(null);
  const isTransfer = activeModule === "traslados";
  const items = result.data?.assets.filter((asset) => asset.stateName.toLowerCase() !== "baja") || [];

  const submit = async (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const assetId = Number(values.get("id_activo"));
    const payload = {
      id_usuario: Number(values.get("id_usuario")),
      id_sucursal: Number(values.get("id_sucursal")),
      id_departamento: Number(values.get("id_departamento")),
      nota_interna: values.get("nota_interna") || null
    };
    setError("");
    setSavingId(assetId);
    try {
      if (isTransfer) await inventoryApi.transferAsset(token, assetId, payload);
      else await inventoryApi.assignAsset(token, assetId, { ...payload, nota_interna: payload.nota_interna || "Asignación registrada desde el sistema" });
      setSelected(null);
      result.reload();
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <>
      <div className="content-toolbar">
        <div><h3>{isTransfer ? "Traslados de activos" : "Asignaciones de equipos"}</h3><p>{isTransfer ? "Registra el nuevo custodio y ubicación en un solo paso." : "Asigna un custodio y una ubicación física al equipo."}</p></div>
        {canWrite && result.data && <button className="primary-action" onClick={() => setSelected(true)} disabled={!items.length}>{isTransfer ? <SwapHoriz /> : <Add />}{isTransfer ? "Nuevo traslado" : "Nueva asignación"}</button>}
      </div>
      {error && <div className="form-error inline-error" role="alert">{error}</div>}
      {result.loading ? <LoadingState /> : result.error ? <ErrorState message={result.error} onRetry={result.reload} /> : items.length === 0 ? <EmptyState>No hay activos disponibles para mostrar.</EmptyState> : (
        <div className="table-container"><table className="assets-table"><thead><tr><th>ACTIVO</th><th>N.º DE SERIE</th><th>CUSTODIO</th><th>UBICACIÓN</th><th>ESTADO</th><th></th></tr></thead><tbody>
          {items.map((asset) => <tr key={asset.id_activo}><td><strong>{asset.placa}</strong><small>{asset.typeName} · {asset.brandName} {asset.modelName}</small></td><td className="serial-cell">{asset.serie}</td><td>{asset.custodianName}</td><td>{asset.branchName}<small>{asset.departmentName}</small></td><td><StatusBadge name={asset.stateName} /></td><td>{asset.id_activo === savingId ? "Guardando..." : ""}</td></tr>)}
        </tbody></table></div>
      )}
      {selected && result.data && <div className="module-overlay"><form className="module-dialog compact-dialog" onSubmit={submit}>
        <div className="dialog-heading"><h3>{isTransfer ? "Registrar traslado" : "Registrar asignación"}</h3><button type="button" className="dialog-close" onClick={() => setSelected(null)} aria-label="Cerrar">×</button></div>
        <label>Activo<select name="id_activo" required defaultValue=""><option value="" disabled>Selecciona un activo</option>{items.map((item) => <option key={item.id_activo} value={item.id_activo}>{assetLabel(item)}{item.custodianName !== "Sin asignar" ? ` · ${item.custodianName}` : ""}</option>)}</select></label>
        <label>Custodio<select name="id_usuario" required defaultValue=""><option value="" disabled>Selecciona un usuario</option>{result.data.references.users.map((item) => <option key={item.id_usuario} value={item.id_usuario}>{item.nombre}</option>)}</select></label>
        <label>Sucursal<select name="id_sucursal" required defaultValue=""><option value="" disabled>Selecciona una sucursal</option>{result.data.references.branches.map((item) => <option key={item.id_sucursal} value={item.id_sucursal}>{item.nombre}</option>)}</select></label>
        <label>Departamento<select name="id_departamento" required defaultValue=""><option value="" disabled>Selecciona un departamento</option>{result.data.references.departments.map((item) => <option key={item.id_departamento} value={item.id_departamento}>{item.nombre}</option>)}</select></label>
        <label>Nota interna<textarea name="nota_interna" maxLength="2000" rows="3" required={!isTransfer} /></label>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="dialog-actions"><button type="button" className="secondary-action" onClick={() => setSelected(null)}>Cancelar</button><button type="submit" className="primary-action" disabled={savingId !== null}>{savingId !== null ? "Guardando..." : "Confirmar"}</button></div>
      </form></div>}
    </>
  );
};

const AuditModule = ({ token, user }) => {
  const canViewUsers = ["ADMINISTRADOR", "ENCARGADO_INVENTARIO"].includes(user.role);
  const load = useCallback(async () => {
    const [events, users, assets] = await Promise.all([
      inventoryApi.audit(token),
      canViewUsers ? inventoryApi.users(token) : Promise.resolve([]),
      inventoryApi.assets(token)
    ]);
    return { events, users, assets };
  }, [token, canViewUsers]);
  const result = useData(load);

  return (
    <>
      <div className="content-toolbar"><div><h3>Bitácora de auditoría</h3><p>Historial inmutable de operaciones realizadas sobre los activos.</p></div></div>
      {result.loading ? <LoadingState /> : result.error ? <ErrorState message={result.error} onRetry={result.reload} /> : result.data.events.length === 0 ? <EmptyState>Aún no hay eventos registrados en la bitácora.</EmptyState> : (
        <div className="table-container"><table className="assets-table"><thead><tr><th>USUARIO</th><th>ACCIÓN</th><th>ACTIVO</th><th>DETALLE</th><th>FECHA Y HORA</th></tr></thead><tbody>
          {result.data.events.map((event) => {
            const asset = result.data.assets.find((item) => item.id_activo === event.id_activo);
            return <tr key={event.id_evento}><td>{userName(result.data.users, event.id_usuario)}</td><td><StatusBadge name={event.accion} /></td><td className="serial-cell">{asset?.placa || `Activo ${event.id_activo}`}</td><td className="audit-detail">{event.detalle}</td><td>{new Date(event.fecha_hora).toLocaleString()}</td></tr>;
          })}
        </tbody></table></div>
      )}
    </>
  );
};

const UsersModule = ({ token, user }) => {
  const canManage = user.role === "ADMINISTRADOR";
  const load = useCallback(async () => {
    const [users, roles] = await Promise.all([
      inventoryApi.users(token, true),
      inventoryApi.roles(token)
    ]);
    return { users, roles };
  }, [token]);
  const result = useData(load);
  const [dialog, setDialog] = useState(null);

  const saveUser = async (payload, existingUser) => {
    if (existingUser) {
      await inventoryApi.updateUser(token, existingUser.id_usuario, payload);
    } else {
      await inventoryApi.createUser(token, payload);
    }
    setDialog(null);
    result.reload();
  };

  const saveRole = async (payload, existingRole) => {
    if (existingRole) {
      await inventoryApi.updateRole(token, existingRole.id_rol, payload);
    } else {
      await inventoryApi.createRole(token, payload);
    }
    setDialog(null);
    result.reload();
  };

  return (
    <>
      <div className="content-toolbar">
        <div><h3>Usuarios y roles</h3><p>Administra las cuentas y perfiles de acceso del sistema.</p></div>
        {canManage && <div className="toolbar-actions">
            <button className="secondary-action" onClick={() => setDialog({ type: "role" })}>Nuevo rol</button>
            <button className="primary-action" onClick={() => setDialog({ type: "user" })}><Add /> Nuevo usuario</button>
          </div>}
      </div>
      {result.loading ? <LoadingState /> : result.error ? <ErrorState message={result.error} onRetry={result.reload} /> : (
        <>
          <div className="content-section-title"><h3>Usuarios</h3><p>Cuentas activas e inactivas registradas en el sistema.</p></div>
          {result.data.users.length === 0 ? <EmptyState>No hay usuarios registrados.</EmptyState> : (
            <div className="table-container"><table className="assets-table"><thead><tr><th>NOMBRE</th><th>CORREO</th><th>ROL</th><th>ESTADO</th>{canManage && <th>ACCIONES</th>}</tr></thead><tbody>
              {result.data.users.map((item) => <tr key={item.id_usuario}><td><strong>{item.nombre}</strong></td><td>{item.correo}</td><td>{roleName(result.data.roles, item.id_rol)}</td><td><StatusBadge name={item.activo ? "Activo" : "Inactivo"} /></td>{canManage && <td><div className="table-actions"><button title="Editar usuario" aria-label="Editar usuario" onClick={() => setDialog({ type: "user", item })}><Edit /></button><button title={item.id_usuario === user.id ? "No puedes eliminar tu propia cuenta" : "Eliminar usuario"} aria-label="Eliminar usuario" disabled={item.id_usuario === user.id} onClick={() => setDialog({ type: "delete-user", item })}><Delete /></button></div></td>}</tr>)}
            </tbody></table></div>
          )}
          <div className="content-section-title roles-section-title"><h3>Roles</h3><p>Perfiles disponibles para asignar a los usuarios.</p></div>
          {result.data.roles.length === 0 ? <EmptyState>No hay roles registrados. Crea un rol antes de agregar usuarios.</EmptyState> : (
            <div className="table-container"><table className="assets-table roles-table"><thead><tr><th>ID</th><th>NOMBRE DEL ROL</th>{canManage && <th>ACCIONES</th>}</tr></thead><tbody>
              {result.data.roles.map((item) => <tr key={item.id_rol}><td>{item.id_rol}</td><td><StatusBadge name={item.nombre} /></td>{canManage && <td><div className="table-actions"><button title="Editar rol" aria-label="Editar rol" onClick={() => setDialog({ type: "role", item })}><Edit /></button><button title="Eliminar rol" aria-label="Eliminar rol" onClick={() => setDialog({ type: "delete-role", item })}><Delete /></button></div></td>}</tr>)}
            </tbody></table></div>
          )}
        </>
      )}
      {dialog?.type === "user" && result.data && <UserForm user={dialog.item} roles={result.data.roles} onClose={() => setDialog(null)} onSave={(payload) => saveUser(payload, dialog.item)} />}
      {dialog?.type === "role" && <RoleForm role={dialog.item} onClose={() => setDialog(null)} onSave={(payload) => saveRole(payload, dialog.item)} />}
      {dialog?.type === "delete-user" && <ConfirmDelete title="Eliminar usuario" description={`Se eliminará permanentemente a ${dialog.item.nombre}. Los usuarios con eventos de auditoría o activos asignados no se pueden eliminar; en esos casos, desactiva la cuenta.`} onClose={() => setDialog(null)} onConfirm={async () => { await inventoryApi.deleteUser(token, dialog.item.id_usuario); setDialog(null); result.reload(); }} />}
      {dialog?.type === "delete-role" && <ConfirmDelete title="Eliminar rol" description={`Se eliminará el rol ${dialog.item.nombre}. Solo es posible si no está asignado a usuarios.`} onClose={() => setDialog(null)} onConfirm={async () => { await inventoryApi.deleteRole(token, dialog.item.id_rol); setDialog(null); result.reload(); }} />}
    </>
  );
};

const UserForm = ({ user, roles, onClose, onSave }) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setError("");
    setSaving(true);
    try {
      await onSave({
        nombre: values.get("nombre").trim(),
        correo: values.get("correo").trim(),
        ...(values.get("password") ? { password: values.get("password") } : {}),
        id_rol: Number(values.get("id_rol")),
        activo: user ? values.get("activo") === "true" : true
      });
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-overlay">
      <form className="module-dialog compact-dialog" onSubmit={submit}>
        <div className="dialog-heading"><h3>{user ? "Actualizar usuario" : "Agregar usuario"}</h3><button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar">×</button></div>
        <label>Nombre completo<input name="nombre" maxLength="150" autoComplete="name" defaultValue={user?.nombre || ""} required /></label>
        <label>Correo electrónico<input name="correo" type="email" maxLength="100" autoComplete="email" defaultValue={user?.correo || ""} required /></label>
        <label>Contraseña<input name="password" type="password" minLength="12" maxLength="255" autoComplete="new-password" required={!user} /><small className="field-hint">{user ? "Déjala vacía para conservar la contraseña actual." : "Debe tener al menos 12 caracteres."}</small></label>
        <label>Rol<select name="id_rol" required defaultValue={user?.id_rol || ""} disabled={roles.length === 0}><option value="" disabled>Selecciona un rol</option>{roles.map((role) => <option key={role.id_rol} value={role.id_rol}>{role.nombre}</option>)}</select></label>
        {user && <label>Estado de la cuenta<select name="activo" defaultValue={String(user.activo)}><option value="true">Activo</option><option value="false">Inactivo</option></select><small className="field-hint">Puedes reactivar una cuenta inactiva desde aquí.</small></label>}
        {roles.length === 0 && <div className="form-error">Primero crea un rol para poder asignarlo al usuario.</div>}
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="dialog-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancelar</button><button type="submit" className="primary-action" disabled={saving || roles.length === 0}>{saving ? "Guardando..." : user ? "Guardar cambios" : "Crear usuario"}</button></div>
      </form>
    </div>
  );
};

const RoleForm = ({ role, onClose, onSave }) => {
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    setError("");
    setSaving(true);
    try {
      await onSave({ nombre: values.get("nombre").trim() });
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="module-overlay">
      <form className="module-dialog compact-dialog" onSubmit={submit}>
        <div className="dialog-heading"><h3>{role ? "Actualizar rol" : "Agregar rol"}</h3><button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar">×</button></div>
        <label>Nombre del rol<input name="nombre" maxLength="50" defaultValue={role?.nombre || ""} required /></label>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="dialog-actions"><button type="button" className="secondary-action" onClick={onClose}>Cancelar</button><button type="submit" className="primary-action" disabled={saving}>{saving ? "Guardando..." : role ? "Guardar cambios" : "Crear rol"}</button></div>
      </form>
    </div>
  );
};

const ConfirmDelete = ({ title, description, onClose, onConfirm }) => {
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const confirm = async () => {
    setError("");
    setDeleting(true);
    try {
      await onConfirm();
    } catch (reason) {
      setError(getErrorMessage(reason));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="module-overlay">
      <div className="module-dialog compact-dialog" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="dialog-heading"><h3 id="delete-title">{title}</h3><button type="button" className="dialog-close" onClick={onClose} aria-label="Cerrar">×</button></div>
        <p className="confirm-description">{description}</p>
        {error && <div className="form-error" role="alert">{error}</div>}
        <div className="dialog-actions"><button type="button" className="secondary-action" onClick={onClose} disabled={deleting}>Cancelar</button><button type="button" className="primary-action delete-confirm" onClick={confirm} disabled={deleting}>{deleting ? "Eliminando..." : "Eliminar permanentemente"}</button></div>
      </div>
    </div>
  );
};

const HomeModule = ({ token, user }) => {
  const canViewUsers = ["ADMINISTRADOR", "ENCARGADO_INVENTARIO"].includes(user.role);
  const load = useCallback(async () => {
    const [assets, events, references] = await Promise.all([
      inventoryApi.assets(token),
      inventoryApi.audit(token),
      loadAssetReferences(token, canViewUsers)
    ]);
    return { assets: enrichAssets(assets, references), events, references };
  }, [token, canViewUsers]);
  const result = useData(load);

  const stats = useMemo(() => {
    const items = result.data?.assets || [];
    return {
      total: items.length,
      assigned: items.filter((item) => item.custodianName !== "Sin asignar").length,
      available: items.filter((item) => item.stateName.toLowerCase().includes("disponible")).length,
      repair: items.filter((item) => item.stateName.toLowerCase().includes("repar")).length
    };
  }, [result.data]);

  return (
    <>
      <div className="welcome-banner"><div><span>PLATAFORMA DE GESTIÓN</span><h2>Bienvenido, {user.name || user.username}</h2><p>Administra y consulta los activos tecnológicos de tu organización.</p></div><DevicesOther className="welcome-icon" /></div>
      {result.loading ? <LoadingState /> : result.error ? <ErrorState message={result.error} onRetry={result.reload} /> : <>
        <div className="content-section-title"><h3>Estado del inventario</h3><p>Resumen de los activos registrados en el backend.</p></div>
        <div className="stats-grid">
          <StatCard icon={<Computer />} color="blue" label="Total de activos" value={stats.total} caption="Equipos registrados" />
          <StatCard icon={<Laptop />} color="green" label="Asignados" value={stats.assigned} caption="Con custodio responsable" />
          <StatCard icon={<DevicesOther />} color="yellow" label="Disponibles" value={stats.available} caption="En bodega" />
          <StatCard icon={<Print />} color="purple" label="En reparación" value={stats.repair} caption="Con estado de reparación" />
        </div>
        <div className="content-section-title"><h3>Últimos movimientos</h3><p>Eventos recientes de la bitácora.</p></div>
        {result.data.events.length === 0 ? <EmptyState>Aún no hay movimientos registrados.</EmptyState> : <div className="table-container"><table className="assets-table"><thead><tr><th>USUARIO</th><th>ACCIÓN</th><th>ACTIVO</th><th>FECHA</th></tr></thead><tbody>
          {result.data.events.slice(0, 5).map((event) => {
            const asset = result.data.assets.find((item) => item.id_activo === event.id_activo);
            return <tr key={event.id_evento}><td>{userName(result.data.references.users, event.id_usuario)}</td><td>{event.accion}</td><td className="serial-cell">{asset?.placa || `Activo ${event.id_activo}`}</td><td>{new Date(event.fecha_hora).toLocaleString()}</td></tr>;
          })}
        </tbody></table></div>}
      </>}
    </>
  );
};

const StatCard = ({ icon, color, label, value, caption }) => (
  <div className="stat-card"><div className={`stat-icon ${color}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{caption}</small></div></div>
);

const DashboardContent = ({ activeModule, user, accessToken }) => {
  const canViewUsers = ["ADMINISTRADOR", "ENCARGADO_INVENTARIO"].includes(user.role);
  const views = {
    inicio: <HomeModule token={accessToken} user={user} />,
    activos: <AssetsModule token={accessToken} user={user} />,
    ubicaciones: <LocationsModule token={accessToken} user={user} />,
    asignaciones: <MovementModule token={accessToken} activeModule="asignaciones" user={user} />,
    traslados: <MovementModule token={accessToken} activeModule="traslados" user={user} />,
    auditoria: <AuditModule token={accessToken} user={user} />,
    usuarios: canViewUsers ? <UsersModule token={accessToken} user={user} /> : <ErrorState message="No tienes permisos para consultar usuarios." />
  };

  return <section className="dashboard-content">{views[activeModule] || views.inicio}</section>;
};

export default DashboardContent;
