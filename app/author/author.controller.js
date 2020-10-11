import Author from './author.model';

export const getAllAuthorController = async (req, res) => {
  try {
    const authors = await Author.find();
    return res.status(200).json(authors);
  } catch (err) {
    // uncomment for sample output: {"success":false,"status":500,"data":{"err":"fail get"}}
    // return res.status(500).json(APIerror(500, { message: err }));

    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const getAuthorByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const row = await Author.findById(id);
    return res.status(200).json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const createAuthorController = async (req, res) => {
  try {
    const { name, birth, active } = req.body;
    if (!req.body || !name || !birth || !active) {
      return res.status(400).json({
        success: false,
        message: 'Undefined parameters.'
      });
    }

    const author = await Author.create(req.body);

    return res.status(200).json({
      success: true,
      message: 'Author created with success.',
      data: author
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const updateAuthorController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birth, active } = req.body;

    // no need validation ID, because no route to PUT /authors. If send, will force 404
    if (!req.body || !name || !birth || !active) {
      return res.status(400).json({
        success: false,
        message: 'Undefined parameters.'
      });
    }

    const authors = await Author.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Author updated with success.',
      data: authors
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const deleteAuthorController = async (req, res) => {
  try {
    const { id } = req.params;

    await Author.findByIdAndRemove(id);

    return res.status(200).json({
      success: true,
      message: 'Author deleted with success.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};
