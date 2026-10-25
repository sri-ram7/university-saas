exports.uploadFile = async (file) => {
  return {
    url: file.path,
    publicId: file.filename,
  };
};