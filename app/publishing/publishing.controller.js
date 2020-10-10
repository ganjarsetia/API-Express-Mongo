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
