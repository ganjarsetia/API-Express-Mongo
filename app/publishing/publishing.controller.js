import Publishing from './publishing.model';

export const getAllPublishingController = async (req, res) => {
  try {
    const publishings = await Publishing.find();
    return res.status(200).json(publishings);
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

export const getPublishingByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const row = await Publishing.findById(id);
    return res.status(200).json(row);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const createPublishingController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!req.body || !name) {
      return res.status(400).json({
        success: false,
        message: 'Undefined parameters.'
      });
    }

    const publishing = await Publishing.create({ name });

    return res.status(200).json({
      success: true,
      message: 'Publishing created with success.',
      data: publishing
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const updatePublishingController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // no need validation ID, because no route to PUT /publishings. If send, will force 404
    if (!req.body || !name) {
      return res.status(400).json({
        success: false,
        message: 'Undefined parameters.'
      });
    }

    const publishing = await Publishing.findByIdAndUpdate(id, req.body, { new: true });

    return res.status(200).json({
      success: true,
      message: 'Publishing updated with success.',
      data: publishing
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};

export const deletePublishingController = async (req, res) => {
  try {
    const { id } = req.params;

    await Publishing.findByIdAndRemove(id);

    return res.status(200).json({
      success: true,
      message: 'Publishing deleted with success.'
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Oops something wrong'
    });
  }
};
