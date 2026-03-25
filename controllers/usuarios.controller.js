const supabase = require('../config/supabase');

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email).toLowerCase());
};

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
    const { nombre, email } = req.body;

    if (!nombre || !email) {
      return res.status(400).json({
        ok: false,
        message: 'Los campos nombre y email son obligatorios',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        ok: false,
        message: 'El email no tiene un formato valido',
      });
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre: nombre.trim(), email: email.trim().toLowerCase() }])
      .select()
      .single();

    if (error) {
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
    const { nombre, email } = req.body;

    if (!nombre && !email) {
      return res.status(400).json({
        ok: false,
        message: 'Debes enviar al menos nombre o email para actualizar',
      });
    }

    const updatePayload = {};

    if (nombre) {
      updatePayload.nombre = nombre.trim();
    }

    if (email) {
      if (!isValidEmail(email)) {
        return res.status(400).json({
          ok: false,
          message: 'El email no tiene un formato valido',
        });
      }

      updatePayload.email = email.trim().toLowerCase();
    }

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
