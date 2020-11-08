import Book from './book.model';

export const getAllBookController = async (req, res) => {
  try {
    const books = await Book.find();
    return res.status(200).json(books);
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

export const getBookByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const row = await Book.findById(id);
    return res.status(200).json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const createBookController = async (req, res) => {
  try {
    // { title: 'Buku 3', ISBN: '9783161484100', authors: ['The Author'], publishing: { name: 'Pubilsher three' }, year: 2018 }
    const { title, ISBN, authors, publishing, year } = req.body;
    if (!req.body || !title || !ISBN || !authors || !publishing || !year) {
      return res.status(400).json({
        success: false,
        message: 'Undefined parameters.'
      });
    }

    const book = await Book.create(req.body);

    return res.status(200).json({
      success: true,
      message: 'Book created with success.',
      data: book
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const updateBookController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, ISBN, authors, publishing, year } = req.body;

    // no need validation ID, because no route to PUT /books. If send, will force 404
    if (!req.body || !title || !ISBN || !authors || !publishing || !year) {
      return res.status(400).json({
        success: false,
        message: 'Undefined parameters.'
      });
    }

    const books = await Book.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Book updated with success.',
      data: books
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const deleteBookController = async (req, res) => {
  try {
    const { id } = req.params;

    await Book.findByIdAndRemove(id);

    return res.status(200).json({
      success: true,
      message: 'Book deleted with success.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};
