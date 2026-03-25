const supabase = require('../config/supabase');

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

const isValidPhone = (telefono) => {
  const phoneRegex = /^\+?[0-9\s-]{7,15}$/;
  return phoneRegex.test(String(telefono));
};

const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const getAllUsuarios = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        ok: false,
        message: 'Error al obtener usuarios',
        error: error.message,
      });
    }

    return res.status(200).json({
      ok: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error inesperado al obtener usuarios',
      error: err.message,
    });
  }
};

const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          ok: false,
          message: 'Usuario no encontrado',
        });
      }

      return res.status(500).json({
        ok: false,
        message: 'Error al obtener el usuario',
        error: error.message,
      });
    }

    return res.status(200).json({
      ok: true,
      data,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error inesperado al obtener el usuario',
      error: err.message,
    });
  }
};

const createUsuario = async (req, res) => {
  try {
    const { nombre, email, telefono, direccion, activo } = req.body;

    if (
      !isNonEmptyString(nombre) ||
      !isNonEmptyString(email) ||
      !isNonEmptyString(telefono) ||
      !isNonEmptyString(direccion)
    ) {
      return res.status(400).json({
        ok: false,
        message:
          'Los campos nombre, email, telefono y direccion son obligatorios',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: 'El email no tiene un formato valido',
      });
    }

    if (!isValidPhone(telefono)) {
      return res.status(400).json({
        ok: false,
        message: 'El telefono no tiene un formato valido',
      });
    }

    if (activo !== undefined && typeof activo !== 'boolean') {
      return res.status(400).json({
        ok: false,
        message: 'El campo activo debe ser booleano',
      });
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        {
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
          telefono: telefono.trim(),
          direccion: direccion.trim(),
          activo: activo === undefined ? true : activo,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(409).json({
          ok: false,
          message: 'El email ya esta registrado',
        });
      }

      return res.status(500).json({
        ok: false,
        message: 'Error al crear usuario',
        error: error.message,
      });
    }

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente',
      data,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error inesperado al crear usuario',
      error: err.message,
    });
  }
};

const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, telefono, direccion, activo } = req.body;

    if (
      nombre === undefined &&
      email === undefined &&
      telefono === undefined &&
      direccion === undefined &&
      activo === undefined
    ) {
      return res.status(400).json({
        ok: false,
        message:
          'Debes enviar al menos nombre, email, telefono, direccion o activo para actualizar',
      });
    }

    const updatePayload = {};

    if (nombre !== undefined) {
      if (!isNonEmptyString(nombre)) {
        return res.status(400).json({
          ok: false,
          message: 'El nombre no puede estar vacio',
        });
      }

      updatePayload.nombre = nombre.trim();
    }

    if (email !== undefined) {
      if (!isNonEmptyString(email) || !isValidEmail(email)) {
        return res.status(400).json({
          ok: false,
          message: 'El email no tiene un formato valido',
        });
      }

      updatePayload.email = email.trim().toLowerCase();
    }

    if (telefono !== undefined) {
      if (!isNonEmptyString(telefono) || !isValidPhone(telefono)) {
        return res.status(400).json({
          ok: false,
          message: 'El telefono no tiene un formato valido',
        });
      }

      updatePayload.telefono = telefono.trim();
    }

    if (direccion !== undefined) {
      if (!isNonEmptyString(direccion)) {
        return res.status(400).json({
          ok: false,
          message: 'La direccion no puede estar vacia',
        });
      }

      updatePayload.direccion = direccion.trim();
    }

    if (activo !== undefined) {
      if (typeof activo !== 'boolean') {
        return res.status(400).json({
          ok: false,
          message: 'El campo activo debe ser booleano',
        });
      }

      updatePayload.activo = activo;
    }

    updatePayload.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('usuarios')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          ok: false,
          message: 'Usuario no encontrado',
        });
      }

      if (error.code === '23505') {
        return res.status(409).json({
          ok: false,
          message: 'El email ya esta registrado',
        });
      }

      return res.status(500).json({
        ok: false,
        message: 'Error al actualizar usuario',
        error: error.message,
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Usuario actualizado correctamente',
      data,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error inesperado al actualizar usuario',
      error: err.message,
    });
  }
};

const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          ok: false,
          message: 'Usuario no encontrado',
        });
      }

      return res.status(500).json({
        ok: false,
        message: 'Error al eliminar usuario',
        error: error.message,
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Usuario eliminado correctamente',
      data,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      message: 'Error inesperado al eliminar usuario',
      error: err.message,
    });
  }
};

module.exports = {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario,
};